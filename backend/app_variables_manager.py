import json

class AppVariablesManager:
    def __init__(self):
        self.recommended_places_file = "recommended_places.json"
        self.advice_file = "advice.json"

    def _write_to_file(self, file_path, data):
        try:
            with open(file_path, 'w') as file:
                json.dump(data, file)
        except IOError as e:
            print(f"Error writing to file {file_path}: {e}")

    def _read_from_file(self, file_path):
        try:
            with open(file_path, 'r') as file:
                return json.load(file)
        except IOError:
            return None

    def set_recommended_places(self, places):
        self._write_to_file(self.recommended_places_file, places)

    def get_recommended_places(self):
        return self._read_from_file(self.recommended_places_file)

    def clear_recommended_places(self):
        self._write_to_file(self.recommended_places_file, None)

    def set_advice(self, advice):
        self._write_to_file(self.advice_file, advice)

    def get_advice(self):
        return self._read_from_file(self.advice_file)

    def clear_advice(self):
        self._write_to_file(self.advice_file, None)
