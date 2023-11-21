import threading
from langchain.chat_models import ChatOpenAI
from langchain.agents import initialize_agent, AgentType, Tool, AgentExecutor
from duckduckgo_search import DDGS
from scrape_and_summarize import ScrapeAndSummarize
from config import Config

class PlacesProcessor:
    def __init__(self, client):
        self.client = client
        self.ddgs = DDGS()
        self.scrapeAndSummarize = ScrapeAndSummarize()
        self.mrkl = self.initialize_langchain_agent()
        

    def get_summarized_reviews(self, place):
        all_reviews = self.scrapeAndSummarize.ddgsearch(place, 5)
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
        keys_to_keep = ['title', 'address', 'latitude', 'longitude', 'phone', 'preference', 'id']
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
                recommended_places_list.append({k: original_dict[k] for k in keys_to_keep if k in original_dict})
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
        Based on what you know, generate about this place: {place_name}.
        Key information such as the environment and atmosphere of the place.
        If possible, estimate the range of the cost, and give some recommendations of what food people order if it is a restaurant, or common activities people do in here.
        Label them appropriately, and go to the next line for each detail.
        """
        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo-1106",
            max_tokens=200,
            temperature=0,
            messages=
            [
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt},
            ],
        )
        return response.choices[0].message.content.strip()

    def thread_worker(self, place):
        try:
            place['generated_info'] = self.generate_information(place['title'])
        except Exception as e:
            print(f"Error generating information for {place['title']}: {e}")

    def process_places_concurrently(self, places):
        threads = []
        for place in places:
            t = threading.Thread(target=self.thread_worker, args=(place,))
            threads.append(t)
            t.start()

        for t in threads:
            t.join()

        return places
