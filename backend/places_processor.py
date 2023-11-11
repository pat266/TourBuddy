import threading
from openai import OpenAI
from duckduckgo_search import DDGS

class PlacesProcessor:
    def __init__(self, client):
        self.client = client
        self.ddgs = DDGS()

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

    def generate_information(self, place_name):
        prompt = f"""
        Based on what you know, generate about this place: {place_name}.
        Key information such as the environment and atmosphere of the place. If possible, estimate the range of the cost, and give some recommendations of what food people ordered or activities they did.
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
