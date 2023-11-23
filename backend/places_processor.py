import threading
from langchain.chat_models import ChatOpenAI
from langchain.agents import initialize_agent, AgentType, Tool, AgentExecutor
from duckduckgo_search import DDGS
from scrape_and_summarize import ScrapeAndSummarize
from config import Config
from opentripmap import OpenTripMapAPI

class PlacesProcessor:
    def __init__(self, client):
        self.client = client
        self.ddgs = DDGS()
        self.scrapeAndSummarize = ScrapeAndSummarize()
        self.mrkl = self.initialize_langchain_agent()
        self.opentripmap = OpenTripMapAPI()
        

    def get_summarized_reviews(self, place):
        all_reviews = self.scrapeAndSummarize.ddgsearch(place, 3)
        return self.scrapeAndSummarize.summarize_reviews(all_reviews, None)

    def initialize_langchain_agent(self):
        turbo_llm = ChatOpenAI(api_key=Config.OPENAI_API_KEY, temperature=0, model="gpt-3.5-turbo-1106") # 16k tokens sent, 4k tokens received
        tools = [
            Tool(
                name="get_place_information",
                func=self.get_summarized_reviews,
                description="Get summarized reviews of a place"
            ),
        ]

        return initialize_agent(
            agent=AgentType.OPENAI_FUNCTIONS,
            tools=tools,
            llm=turbo_llm,
            verbose=False,
            max_iterations=2,
            early_stopping_method='generate',
        )

    def get_recommended_places(self, latitude="33.771030", longitude="-84.391090", radius=10):
        keys_to_keep = ['name', 'address', 'latitude', 'longitude', 'phone', 'preference', 'id']
        preferences_list = ['sports', 'art and culture', 'museum and history', 
                            'food and dining', 'nature and outdoors', 'music', 
                            'technology', 'shopping', 'movies and entertainment']
        recommended_places_list = []

        for preference in preferences_list:
            for original_dict in self.ddgs.maps(f"places related to {preference}", 
                                           latitude=str(latitude), 
                                           longitude=str(longitude), 
                                           radius=radius, 
                                           max_results=10):
                # Add the 'preference' key and value directly to the original dictionary
                original_dict['preference'] = preference
                # add an id to distinguish between different places
                original_dict['id'] = str(original_dict['latitude']) + str(original_dict['longitude'])
                # replace the 'title' key with 'name' key
                original_dict['name'] = original_dict.pop('title', None)
                recommended_places_list.append({k: original_dict[k] for k in keys_to_keep if k in original_dict})
        return recommended_places_list
    
    def get_recommended_places_open_trip_map(self, latitude="33.771030", longitude="-84.391090", radius=10, preferences=['banks', 'restaurants']):
        recommended_places_list = self.opentripmap.nearby_search(latitude, longitude, radius * 1000, kinds=preferences)
        # Filter out dictionaries where 'name' is empty or null
        recommended_places_list = [place for place in recommended_places_list if place.get('name')][:20]
        print('Got the recommended places from OpenTripMap API')
        for recommended_place in recommended_places_list:
            # print(recommended_place)
            recommended_place['id'] = str(recommended_place['point']['lat']) + str(recommended_place['point']['lon'])
            recommended_place['latitude'] = recommended_place['point']['lat']
            recommended_place['longitude'] = recommended_place['point']['lon']
            recommended_place.pop('point', None)
            recommended_place.pop('rate', None)
            recommended_place.pop('osm', None)
            recommended_place.pop('dist', None)

        return recommended_places_list

    def generate_informations(self, place_name):
        prompt = f"""
        Based on what you know, generate information about this place: {place_name} and also get more information by using the tool to get summarized reviews of that place.
        Key information such as the environment and atmosphere of the place. 
        If possible, estimate the range of the cost, and give some recommendations of what food people order if it is a restaurant or common activities people do in here.
        Label them appropriately, and go to the next line for each detail.
        """
        return self.mrkl.run(prompt)
    
    def generate_information(self, place_name):
        prompt = f"""
        Based on what you know, generate about this place: {place_name}. If you do not know anything, simply return "".
        Key information such as the environment and atmosphere of the place.
        If possible, estimate the cost (preferably range of number), and give some recommendations of what food people order if it is a restaurant, or common activities people do in here.
        Label them appropriately, and go to the next line for each detail.
        """
        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo-1106",
            max_tokens=500,
            temperature=0,
            messages=
            [
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt},
            ],
        )
        info = response.choices[0].message.content.strip()
        # if info in 'have any specific information about':
        #     print(f"Finding additional information about {place_name}.")
        #     # scrape the web for information
        #     info = self.get_summarized_reviews(place_name)
        print(info)
        return info

    def thread_worker(self, place):
        try:
            print(f"Starting processing for {place['name']}")
            place['info'] = self.generate_information(place['name'])
            print(f"Finished processing for {place['name']}")
        except Exception as e:
            print(f"Error gathering information for {place['name']}: {e}")

    def process_places_concurrently(self, places):
        threads = []
        for place in places:
            t = threading.Thread(target=self.thread_worker, args=(place,))
            threads.append(t)
            t.start()

        for t in threads:
            t.join()
        
        # for place in places:
        #     if place['info'] in 'have any specific information about':
        #         place['info'] = self.get_summarized_reviews(place['name'])
        return places
