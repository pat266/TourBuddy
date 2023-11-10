import crochet
crochet.setup()

from scrapy.crawler import CrawlerRunner
from scrapy.settings import Settings
from crawl_spider_2 import MySpider
from duckduckgo_search import DDGS
from openai import OpenAI
from config import Config

class WebScraper():
    def __init__(self):
        self.ddgs = DDGS()
        self.client = OpenAI(api_key=Config.OPENAI_API_KEY)

    @crochet.run_in_reactor
    def run_spider(self, url_list, clean_with_llm):
        custom_settings = {
            'LOG_ENABLED': False,
            'RANDOMIZE_DOWNLOAD_DELAY': True,
        }
        settings = Settings()
        settings.setdict(custom_settings)
        crawler = CrawlerRunner(settings)
        deferred = crawler.crawl(MySpider, start_urls=url_list, clean_with_llm=clean_with_llm)
        return deferred

    def ddgsearch(self, query, numresults=10, clean_with_llm=False):
        results = list(self.ddgs.text(query, max_results=numresults))
        urls = [result['href'] for result in results][:numresults]
        print(urls)
        MySpider.results = []
        eventual_result = self.run_spider(urls, clean_with_llm)
        try:
            results = eventual_result.wait(timeout=20.0)
        except crochet.TimeoutError:
            raise Exception("The scraping operation timed out.")
        return MySpider.results

    def summarize_reviews(self, crawled_reviews, place_type):
        all_reviews = ''.join([review['useful_text'] for review in crawled_reviews])
        if place_type == 'food and dining':
            prompt = f"""
            "From the following paragraph about a restaurant, please identify and summarize the key details regarding:
            1) the estimated cost in the restaurant,
            2) the most popular dishes or what people commonly order,
            and 3) the environment and atmosphere of the restaurant.
            {all_reviews}"
            """
        else:
            prompt = f"""
            "From the following paragraph about a place, please identify and summarize the key details regarding:
            1) the estimated cost of entry,
            2) the most popular activitiess,
            and 3) the environment and atmosphere of the place.
            {all_reviews}"
            """

        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo-1106",
            max_tokens=500,
            temperature=0,
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant.",
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
        )
        return response.choices[0].message.content.strip()
