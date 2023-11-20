from flask import Flask, jsonify, request
from places_processor import PlacesProcessor
from scrape_and_summarize import ScrapeAndSummarize
from config import Config
from openai import OpenAI

app = Flask(__name__)
client = OpenAI(api_key=Config.OPENAI_API_KEY)
places_processor = PlacesProcessor(client)
scrapeAndSummarize = ScrapeAndSummarize()

@app.route('/recommended_places', methods=['GET'])
def get_recommended_places():
    latitude = request.args.get('latitude', default="33.771030", type=str)
    longitude = request.args.get('longitude', default="-84.391090", type=str)
    radius = request.args.get('radius', default=10, type=int)

    recommended_places = places_processor.get_recommended_places(latitude, longitude, radius)
    updated_recommended_places = places_processor.process_places_concurrently(recommended_places)

    return jsonify(updated_recommended_places)

@app.route('/detailed_reviews', methods=['GET'])
def search():
    place_name = request.args.get('place_name')
    place_type = request.args.get('place_type')
    numresults = int(request.args.get('numresults', 5))

    crawled_reviews = scrapeAndSummarize.ddgsearch(place_name, numresults)
    summary = scrapeAndSummarize.summarize_reviews(crawled_reviews, place_type)

    return jsonify({'summary': summary})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
    # curl "http://localhost:5000/recommended_places?latitude=33.771030&longitude=-84.391090&radius=10"
    # curl "http://localhost:5000/detailed_reviews?place_name=R.+Thomas+Deluxe+Grill&place_type=food+and+dining&numresults=5"