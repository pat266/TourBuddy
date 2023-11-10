import re
from config import Config
import threading
import queue
import bs4
from readability import Document


def extract_useful_information_from_single_chunk(client, url, title, text, ix, q=None):
    '''
    This function takes the url, title, and a chunk of text of a webpage, and it asks
    openai to extract only the useful information from the text. It returns the result,
    which is a string of text, and it also puts the result in a queue if a queue is passed in.
    '''
    # in this function, we will take the url, title, and some text extracted from the webpage
    # by bs4, and we will ask openai to extract only the useful information from the text

    prompt = f"""
    You will be given information about a place. Your task is to extract and summarize the key information. If there is no information, simply return "No Important Information Found\n".
    Key information such as the environment and atmosphere of the place. If possible, estimate the range of the cost, and give some recommendations of what food people ordered or activities they did.
    Try not to rewrite the text, but instead extract only the useful information from the text.

    Here is a url: {url}
    Here is its title: {title}
    Here is some text extracted from the webpage:
    {text}
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
                "content": "You are a helpful assistant to help finding important information.",
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],

    )
    if q:
        q.put((ix, response.choices[0].message.content))

    text = response.choices[0].message.content.strip()

    # sometimes the first line is something like "Useful information extracted from the text:", so we remove that
    lines = text.splitlines()
    if "useful information" in lines[0].lower():
        text = '\n'.join(lines[1:])

    return (ix, text)

def extract_useful_information(client, url, title, text, max_chunks):
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
    # Create the chunks with the specified size and overlap
    chunks = [text[i:i+Config.CHUNK_SIZE] for i in range(0, len(text), Config.CHUNK_SIZE - Config.CHUNK_OVERLAP)]
    chunks = chunks[:max_chunks]

    threads = []

    q = queue.Queue()

    for ix, chunk in enumerate(chunks):
        t = threading.Thread(target=extract_useful_information_from_single_chunk, args=(client, url, title, chunk, ix, q))
        threads.append(t)
        t.start()

    # Wait for all threads to complete
    for t in threads:
        t.join()

    # Get all the results from the queue
    results = []
    while not q.empty():
        results.append(q.get())

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

def remove_duplicate_empty_lines(text):
    # Replace multiple spaces with a single space
    text = re.sub(r'\s+', ' ', text)

    # Replace multiple newlines with a single newline
    text = re.sub(r'\n+', '\n', text)

    # Replace multiple tabs with a single tab
    text = re.sub(r'\t+', '\t', text)

    return text