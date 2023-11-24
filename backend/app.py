from flask import Flask, jsonify, request
from places_processor import PlacesProcessor
from scrape_and_summarize import ScrapeAndSummarize
from config import Config
from openai import OpenAI
import time

app = Flask(__name__)
client = OpenAI(api_key=Config.OPENAI_API_KEY)
places_processor = PlacesProcessor(client)
scrapeAndSummarize = ScrapeAndSummarize()

@app.route('/recommended_places', methods=['GET'])
def get_recommended_places():
    start_time = time.time()
    latitude = request.args.get('latitude', default="33.771030", type=str)
    longitude = request.args.get('longitude', default="-84.391090", type=str)
    radius = request.args.get('radius', default=10, type=int)

    recommended_places = places_processor.get_recommended_places(latitude, longitude, radius)
    updated_recommended_places = places_processor.process_places(recommended_places)

    execution_time = time.time() - start_time
    print(f"The recommended_places API took {execution_time} seconds to execute.")

    return jsonify(updated_recommended_places)

@app.route('/recommended_places_open_trip', methods=['GET'])
def get_recommended_places_open_trip():
    start_time = time.time()
    latitude = request.args.get('latitude', default="33.771030", type=str)
    longitude = request.args.get('longitude', default="-84.391090", type=str)
    radius = request.args.get('radius', default=5, type=int)

    recommended_places = places_processor.get_recommended_places_open_trip_map(latitude, longitude, radius)
    updated_recommended_places = places_processor.process_places(recommended_places)

    execution_time = time.time() - start_time
    print(f"The get_recommended_places_open_trip API took {execution_time} seconds to execute.")

    return jsonify(updated_recommended_places)

@app.route('/detailed_reviews', methods=['GET'])
def search():
    place_name = request.args.get('place_name')
    place_type = request.args.get('place_type')
    numresults = int(request.args.get('numresults', 5))

    start_time = time.time()
    all_reviews = scrapeAndSummarize.ddgsearch(place_name, numresults)
    execution_time = time.time() - start_time
    print(f"The ddgsearch function took {execution_time} seconds to execute.")

    start_time = time.time()
    summary = scrapeAndSummarize.summarize_reviews(all_reviews, place_type)
    execution_time = time.time() - start_time
    print(f"The summarize_reviews function took {execution_time} seconds to execute.")
    return jsonify({'summary': summary})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
    # curl "http://localhost:5000/recommended_places?latitude=33.771030&longitude=-84.391090&radius=10"
    # curl "http://localhost:5000/recommended_places_open_trip?latitude=33.771030&longitude=-84.391090&radius=10"
    # curl "http://localhost:5000/detailed_reviews?place_name=R.+Thomas+Deluxe+Grill&place_type=food+and+dining&numresults=5"
    