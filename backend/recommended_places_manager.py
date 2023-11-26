# simple class to encapsulate the result of the recommendation algorithm
class RecommendedPlacesManager:
    def __init__(self):
        self._current_recommended_places = None

    def set_recommended_places(self, places):
        self._current_recommended_places = places

    def get_recommended_places(self):
        return self._current_recommended_places
    
    def clear_recommended_places(self):
        self._current_recommended_places = None