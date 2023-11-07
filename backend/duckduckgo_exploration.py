import argparse
import bs4
from duckduckgo_search import DDGS
import openai
import logging
import threading
import queue
from readability import Document
import json

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

import scrapy
from scrapy.crawler import CrawlerProcess

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv('../.env')

# Retrieve the API key
openai_api_key = os.getenv('OPENAI_API_KEY')

if openai_api_key is not None and len(openai_api_key) != 0:
    print("API key retrieved successfully.")
else:
    print("API key not found.")

# OpenAI API Key
openai.api_key = openai_api_key

ddgs = DDGS()

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

    response = openai.completions.create(
        engine="text-davinci-003",
        prompt=prompt,
        max_tokens=1000,
        temperature=0.2,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )

    if q:
        q.put((ix, response['choices'][0]['text']))
    logger.info(f"DONE extracting useful information from chunk {ix}, title: {title}")

    text = response['choices'][0]['text']

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

    chunks = [text[i*1000: i*1000+1100] for i in range(len(text)//1000)]
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


class MySpider(scrapy.Spider):
    '''
    This is the spider that will be used to crawl the webpages. We give this to the scrapy crawler.
    '''
    name = 'myspider'
    start_urls = None
    clean_with_llm = False
    results = []

    def __init__(self, start_urls, clean_with_llm, *args, **kwargs):
        super(MySpider, self).__init__(*args, **kwargs)
        self.start_urls = start_urls
        self.clean_with_llm = clean_with_llm

    def start_requests(self):
        for url in self.start_urls:
            yield scrapy.Request(url, callback=self.parse)

    def parse(self, response):
        logger = logging.getLogger('ddgsearch')
        logger.info(f"***Parsing {response.url}...")

        body_html = response.body.decode('utf-8')

        url = response.url

        soup = bs4.BeautifulSoup(body_html, 'html.parser')
        title = soup.title.string
        text = soup.get_text()
        text = remove_duplicate_empty_lines(text)

        if self.clean_with_llm:
            useful_text = extract_useful_information(url, title, text, 50)
        else:
            useful_text = readability(body_html)
        useful_text = remove_duplicate_empty_lines(useful_text)

        self.results.append({
            'url': url,
            'title': title,
            'text': text,
            'useful_text': useful_text
        })

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

    process = CrawlerProcess()
    setloglevel(loglevel) # this is necessary because the crawler process modifies the log level
    process.crawl(MySpider, urls, clean_with_llm)
    process.start()

    # here the spider has finished downloading the pages and cleaning them up
    return MySpider.results

if __name__ == '__main__':
    query = "how to make a great pastrami sandwich"

    # search duckduckgo and scrape the results

    results1 = ddgsearch(query, numresults=4, clean_with_llm=False)
    results2 = ddgsearch(query, numresults=4, clean_with_llm=False)


    # print the results
    print (f"Results: {json.dumps(results1, indent=2)}")