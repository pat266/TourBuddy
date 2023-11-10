from flask import Flask, jsonify, request
from search_service import SearchService

app = Flask(__name__)
search_service = SearchService()

@app.route('/search', methods=['GET'])
def get_ddgsearch():
    # Extract query parameters
    query = request.args.get('query', default="how to make a great pastrami sandwich", type=str)
    numresults = request.args.get('numresults', default=10, type=int)
    clean_with_llm = request.args.get('clean_with_llm', default=False, type=lambda v: v.lower() == 'true')
    
    # Call the ddgsearch function
    try:
        results = search_service.ddgsearch(query, numresults=numresults, clean_with_llm=clean_with_llm)
        return jsonify(results)
    except Exception as e:
        # This will print the full traceback to the console or wherever your logs are directed
        app.logger.error('Unhandled exception', exc_info=True)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
    # curl "http://127.0.0.1:5000/search?query=how+to+make+a+great+pastrami+sandwich&numresults=1&clean_with_llm=True"