import scrapy
from scrapy.crawler import CrawlerRunner
from scrapy.settings import Settings
from openai import OpenAI
import bs4
from util_extract_information import *
from config import Config

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
        body_html = response.body.decode('utf-8')

        url = response.url

        soup = bs4.BeautifulSoup(body_html, 'html.parser')
        # Check if title tag exists
        if soup.title:
            title = soup.title.string
        else:
            title = "No Title Found"
        text = soup.get_text()
        text = remove_duplicate_empty_lines(text)

        if self.clean_with_llm:
            client = OpenAI(api_key=Config.OPENAI_API_KEY)
            useful_text = extract_useful_information(client, url, title, text, 50)
        else:
            useful_text = readability(body_html)
        useful_text = remove_duplicate_empty_lines(useful_text)

        self.results.append({
            'url': url,
            'title': title,
            # 'text': text,
            'text': '',
            'useful_text': useful_text
        })