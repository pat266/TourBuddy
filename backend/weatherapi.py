import requests
from config import Config

class WeatherAPIClient:
    def __init__(self):
        self.base_url = "http://api.weatherapi.com/v1/current.json"

    def get_current_weather(self, latitude, longitude):
        """Get the current weather for a given latitude and longitude."""
        params = {
            "key": Config.WEATHER_API_KEY,
            "q": f"{latitude},{longitude}"
        }
        try:
            response = requests.get(self.base_url, params=params)
            response.raise_for_status()  # Raises an HTTPError if the HTTP request returned an unsuccessful status code
            return response.json()
        except requests.RequestException as e:
            print(f"An error occurred: {e}")
            return None
