# Backend Setup and API Usage Guide

This README provides the necessary steps to set up and run the backend for our application, as well as details on how to use its API endpoints.

## Setting up the Backend

### Prerequisites
- Python installed on your system.
- Virtual environment tool (like venv or virtualenv).

### Steps to Run

1. **Initiate a Virtual Environment:**
   - Navigate to the project directory in the terminal.
   - Run `python -m venv venv` to create a virtual environment named `venv`.

2. **Activate the Virtual Environment:**
   - For Windows, run `venv\Scripts\activate`.
   - For Unix or MacOS, run `source venv/bin/activate`.

3. **Install Required Packages:**
   - Ensure you are in the project root directory where the `requirements.txt` file is located.
   - Run `pip install -r requirements.txt` to install the necessary packages.

4. **Run the Flask Application:**
   - Execute `python app.py` to start the Flask server.

## API Endpoints

The application provides two main GET request endpoints:

1. **Recommended Places:**
   - **Endpoint:** `/recommended_places`
   - **Description:** This endpoint returns a list of recommended places based on the provided latitude, longitude, and radius.
   - **Sample Request:** `http://localhost:5000/recommended_places?latitude=33.771030&longitude=-84.391090&radius=10`

2. **Detailed Reviews:**
   - **Endpoint:** `/detailed_reviews`
   - **Description:** Fetches detailed reviews for a specified place. The parameters `place_name` and `place_type` should match the `title` and `preference` from the `/recommended_places` endpoint results, respectively.
   - **Sample Request:** `http://localhost:5000/detailed_reviews?place_name=R.+Thomas+Deluxe+Grill&place_type=food+and+dining&numresults=5&clean_with_llm=True`

## Response Handling

- The response from `/recommended_places` will include a list of places, each with a `title` and `preference`.
- Use the `title` and `preference` values in the `/detailed_reviews` endpoint to fetch more detailed information about a specific place.

## Additional Information

- Ensure your Flask application (`app.py`) is correctly configured to handle these endpoints.
- The backend server runs on `http://localhost:5000` by default. Adjust your requests accordingly if you're using a different host or port.
- For any issues or further customization, refer to the Flask documentation and the application's source code.
