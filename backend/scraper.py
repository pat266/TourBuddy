from concurrent.futures.thread import ThreadPoolExecutor
from functools import partial
import requests
from bs4 import BeautifulSoup


class Scraper:
    """
    Scraper class to extract the content from the links
    """
    def __init__(self):
        """
        Initialize the Scraper class.
        """
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0"
        })

    def run(self, urls):
        """
        Extracts the content from the links
        """
        partial_extract = partial(self.extract_data_from_link, session=self.session)
        with ThreadPoolExecutor(max_workers=20) as executor:
            contents = executor.map(partial_extract, urls)
        res = [content for content in contents if content['raw_content'] is not None]
        return res

    def extract_data_from_link(self, link, session):
        """
        Extracts the data from the link
        """
        content = ""
        try:
            if link:
                content = self.scrape_text_with_bs(link, session)

            if len(content) < 100:
                return {'url': link, 'raw_content': None}
            return {'url': link, 'raw_content': content}
        except Exception as e:
            return {'url': link, 'raw_content': None}

    def scrape_text_with_bs(self, link, session):
        response = session.get(link, timeout=4)
        soup = BeautifulSoup(response.content, 'lxml', from_encoding=response.encoding)

        for script_or_style in soup(["script", "style"]):
            script_or_style.extract()

        raw_content = self.get_content_from_url(soup)
        lines = (line.strip() for line in raw_content.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        content = "\n".join(chunk for chunk in chunks if chunk)
        return content

    def get_content_from_url(self, soup):
        """Get the text from the soup

        Args:
            soup (BeautifulSoup): The soup to get the text from

        Returns:
            str: The text from the soup
        """
        text = ""
        tags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5']
        for element in soup.find_all(tags):  # Find all the <p> elements
            text += element.text + "\n"
        return text