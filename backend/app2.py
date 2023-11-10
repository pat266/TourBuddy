from flask import Flask, jsonify, request
from places_processor_2 import PlacesProcessor
from config import Config
from openai import OpenAI

app = Flask(__name__)
client = OpenAI(api_key=Config.OPENAI_API_KEY)
places_processor = PlacesProcessor(client)

@app.route('/recommended_places', methods=['GET'])
def get_recommended_places():
    latitude = request.args.get('latitude', default="33.771030", type=str)
    longitude = request.args.get('longitude', default="-84.391090", type=str)
    radius = request.args.get('radius', default=10, type=int)

    recommended_places = places_processor.get_recommended_places(latitude, longitude, radius)
    updated_recommended_places = places_processor.process_places_concurrently(recommended_places)

    return jsonify(updated_recommended_places)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
    # curl "http://localhost:5000/recommended_places?latitude=33.771030&longitude=-84.391090&radius=10"