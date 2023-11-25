import os
from dotenv import load_dotenv
import logging

# Load environment variables from .env file
load_dotenv('../.env')

class Config:
    # Retrieve the OpenAI API key from environment variables
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    OPENTRIPMAP_API_KEY = os.getenv('OPENTRIPMAP_API_KEY')

    # Parameters related to spider execution, like chunk size and timeout
    CHUNK_SIZE = 3500
    CHUNK_OVERLAP = 100
    SPIDER_TIMEOUT = 300.0 # Timeout for crawling in seconds
