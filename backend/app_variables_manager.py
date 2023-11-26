class AppVariablesManager:
    def __init__(self):
        self._current_recommended_places = None
        self._advice = None

    def set_recommended_places(self, places):
        self._current_recommended_places = places

    def get_recommended_places(self):
        return self._current_recommended_places

    def clear_recommended_places(self):
        self._current_recommended_places = None

    def set_advice(self, advice):
        self._advice = advice

    def get_advice(self):
        return self._advice

    def clear_advice(self):
        self._advice = None