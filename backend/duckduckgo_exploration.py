import crochet
crochet.setup()

import bs4
from duckduckgo_search import DDGS
from openai import OpenAI
import logging
import threading
import queue
from readability import Document
from myspider import MySpider
import scrapy
from scrapy.crawler import CrawlerRunner

import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request

app = Flask(__name__)

# Load environment variables from .env file
load_dotenv('../.env')

# OpenAI API Key
client = OpenAI(
    # defaults to os.environ.get("OPENAI_API_KEY")
    api_key=os.getenv('OPENAI_API_KEY'),
)

ddgs = DDGS()

# ******
# this is a hack to stop scrapy from logging its version info to stdout
# there should be a better way to do this, but I don't know what it is
import scrapy.utils.log

def null_log_scrapy_info(settings):
    pass

# replace the log_scrapy_info function with a null function
# get the module dictionary that contains the log_scrapy_info function
log_scrapy_info_module_dict = scrapy.utils.log.__dict__

# set the log_scrapy_info function to null
log_scrapy_info_module_dict['log_scrapy_info'] = null_log_scrapy_info
# ******

def setloglevel(loglevel):
    # this function sets the log level for the script
    if loglevel == 'DEBUG':
        logging_level = logging.DEBUG
    elif loglevel == 'INFO':
        logging_level = logging.INFO
    elif loglevel == 'WARNING':
        logging_level = logging.WARNING
    elif loglevel == 'ERROR':
        logging_level = logging.ERROR
    elif loglevel == 'CRITICAL':
        logging_level = logging.CRITICAL
    else:
        logging_level = logging.INFO

    # surely there is a better way to do this?
    logger = logging.getLogger('scrapy')
    logger.setLevel(logging_level)
    logger = logging.getLogger('filelock')
    logger.setLevel(logging_level)
    logger = logging.getLogger('py.warnings')
    logger.setLevel(logging_level)
    logger = logging.getLogger('readability')
    logger.setLevel(logging_level)
    logger = logging.getLogger('ddgsearch')
    logger.setLevel(logging_level)
    logger = logging.getLogger('urllib3')
    logger.setLevel(logging_level)
    logger = logging.getLogger('openai')
    logger.setLevel(logging_level)

def extract_useful_information_from_single_chunk(url, title, text, ix, q=None):
    '''
    This function takes the url, title, and a chunk of text of a webpage, and it asks
    openai to extract only the useful information from the text. It returns the result,
    which is a string of text, and it also puts the result in a queue if a queue is passed in.
    '''
    # in this function, we will take the url, title, and some text extracted from the webpage
    # by bs4, and we will ask openai to extract only the useful information from the text

    logger = logging.getLogger("ddgsearch")
    logger.info(f"extracting useful information from chunk {ix}, title: {title}")

    prompt = f"""
    Here is a url: {url}
    Here is its title: {title}
    Here is some text extracted from the webpage by bs4:
    ---------
    {text}
    ---------

    Web pages can have a lot of useless junk in them. For example, there might be a lot of ads, or a lot of navigation links,
    or a lot of text that is not relevant to the topic of the page. We want to extract only the useful information from the text.

    You can use the url and title to help you understand the context of the text.
    Please extract only the useful information from the text. Try not to rewrite the text, but instead extract only the useful information from the text.
    """

    response = client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        max_tokens=500,
        temperature=0.2,
        top_p=0.5,
        frequency_penalty=0.3,
        messages=
        [
            {
                "role": "system",
                "content": "You are a helpful assistant for text summarization.",
            },
            {
                "role": "user",
                "content": f"Summarize this for a tourist who is looking for information: {prompt}",
            },
        ],

    )
    if q:
        q.put((ix, response.choices[0].message.content))
    logger.info(f"DONE extracting useful information from chunk {ix}, title: {title}")

    text = response.choices[0].message.content.strip()

    # sometimes the first line is something like "Useful information extracted from the text:", so we remove that
    lines = text.splitlines()
    if "useful information" in lines[0].lower():
        text = '\n'.join(lines[1:])

    return (ix, text)

def extract_useful_information(url, title, text, max_chunks):
    '''
    This function takes the url, title, and text of a webpage.
    It returns the most useful information from the text.

    , and it calls
    extract_useful_information_from_single_chunk to extract the useful information.

    It does this by breaking the text into chunks, and then calling
    extract_useful_information_from_single_chunk on each chunk (which is turn calls openai).
    It then concatenates the results from all the chunks.

    It uses threading to do this in parallel, because openai is slow.
    '''

    chunk_size = 3500
    overlap = 100

    # Create the chunks with the specified size and overlap
    chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size - overlap)]
    chunks = chunks[:max_chunks]

    threads = []

    q = queue.Queue()

    for ix, chunk in enumerate(chunks):
        t = threading.Thread(target=extract_useful_information_from_single_chunk, args=(url, title, chunk, ix, q))
        threads.append(t)
        t.start()

    # Wait for all threads to complete
    for t in threads:
        t.join()

    # Get all the results from the queue
    results = []
    while not q.empty():
        results.append(q.get())

    logger = logging.getLogger("ddgsearch")
    logger.info (f"Got {len(results)} results from the queue")

    # Sort the results by the index
    results.sort(key=lambda x: x[0])

    # concatenate the text from the results
    text = ''.join([x[1] for x in results])

    return text

def readability(input_text):
    '''
    This function will use the readability library to extract the useful information from the text.
    Document is a class in the readability library. That library is (roughly) a python
    port of readability.js, which is a javascript library that is used by firefox to
    extract the useful information from a webpage. We will use the Document class to
    extract the useful information from the text.
    '''

    doc = Document(input_text)

    summary = doc.summary()

    # the summary is html, so we will use bs4 to extract the text
    soup = bs4.BeautifulSoup(summary, 'html.parser')
    summary_text = soup.get_text()

    return summary_text

def remove_duplicate_empty_lines(input_text):
    lines = input_text.splitlines()

    # this function removes all duplicate empty lines from the lines
    fixed_lines = []
    for index, line in enumerate(lines):
        if line.strip() == '':
            if index != 0 and lines[index-1].strip() != '':
                fixed_lines.append(line)
        else:
            fixed_lines.append(line)

    return '\n'.join(fixed_lines)

@crochet.run_in_reactor
def run_spider(url_list, clean_with_llm):
    crawler = CrawlerRunner()
    deferred = crawler.crawl(MySpider, start_urls=url_list, clean_with_llm=clean_with_llm)
    return deferred

def ddgsearch(query, numresults=10, clean_with_llm=False, loglevel='ERROR'):
    '''
    This function performs a search on duckduckgo and returns the results.
    It uses the scrapy library to download the pages and extract the useful information.
    It extracts useful information from the pages using either the readability library
    or openai, depending on the value of clean_with_llm.

    query: the query to search for
    numresults: the number of results to return
    clean_with_llm: if True, use openai to clean the text. If False, use readability.
    loglevel: the log level to use, a string. Can be DEBUG, INFO, WARNING, ERROR, or CRITICAL.
    '''
    # set the log level
    setloglevel(loglevel)

    # perform the search
    results = list(ddgs.text(query, max_results=numresults))

    logger = logging.getLogger('ddgsearch')
    logger.info(f"Got {len(results)} results from the search.")
    logger.debug(f"Results: {results}")

    # get the urls
    urls = [result['href'] for result in results]
    urls = urls[:numresults]

    setloglevel(loglevel) # this is necessary because the crawler process modifies the log level
    eventual_result = run_spider(urls, clean_with_llm)
    
    # Wait for the specified time or until the result is ready
    try:
        results = eventual_result.wait(timeout=300.0)  # waits for 5 minutes
    except crochet.TimeoutError:
        raise Exception("The scraping operation timed out.")

    return MySpider.results

@app.route('/search', methods=['GET'])
def get_ddgsearch():
    # Extract query parameters
    query = request.args.get('query', default="how to make a great pastrami sandwich", type=str)
    numresults = request.args.get('numresults', default=10, type=int)
    clean_with_llm = request.args.get('clean_with_llm', default=False, type=lambda v: v.lower() == 'true')
    
    # Call the ddgsearch function
    try:
        results = ddgsearch(query, numresults=numresults, clean_with_llm=clean_with_llm)
        return jsonify(results)
    except Exception as e:
        # This will print the full traceback to the console or wherever your logs are directed
        app.logger.error('Unhandled exception', exc_info=True)
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
