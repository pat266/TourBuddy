import requests
from config import Config

class OpenTripMapAPI:
    def __init__(self, api_key):
        self.base_url = "https://opentripmap-places-v1.p.rapidapi.com/en/places"
        self.headers = {
            "X-RapidAPI-Key": Config.OPENTRIPMAP_API_KEY,
            "X-RapidAPI-Host": "opentripmap-places-v1.p.rapidapi.com",
        }

    def autosuggest(self, query):
        url = f"{self.base_url}/autosuggest"
        params = {
            "query": query
        }
        response = requests.get(url, headers=self.headers, params=params)
        return response.json()

    def bbox(self, south, west, north, east):
        url = f"{self.base_url}/bbox"
        params = {
            "south": south,
            "west": west,
            "north": north,
            "east": east
        }
        response = requests.get(url, headers=self.headers, params=params)
        return response.json()

    def nearby_search(self, lat, lon, radius, kinds=[]):
        url = f"{self.base_url}/radius"
        params = {
            "lat": lat,
            "lon": lon,
            "radius": radius
        }
        if kinds is not None or len(kinds) > 0:
            params['kinds'] = ','.join(kinds)
        response = requests.get(url, headers=self.headers, params=params)
        return response.json()

    def place_properties(self, xid):
        url = f"{self.base_url}/{xid}"
        response = requests.get(url, headers=self.headers)
        return response.json()

    def geoname(self, geoname_id):
        url = f"{self.base_url}/geoname"
        params = {
            "geoname_id": geoname_id
        }
        response = requests.get(url, headers=self.headers, params=params)
        return response.json()
