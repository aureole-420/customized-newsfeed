# "amqp://zoqvthpo:L7AY_DRQV2eFmKPfYASipJtHxsE8bOpC@orangutan.rmq.cloudamqp.com/zoqvthpo" 

# import os 
# import sys
# import logging
# # from newspaper import Article
# # import common package in parent directory 
# sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))
# sys.path.append(os.path.join(os.path.dirname(__file__), 'scrapers'))
# import cnn_news_scraper 
# from cloudAMQP_client import CloudAMQPClient


# # TODO: use your own queue. 
# DEDUPE_NEWS_TASK_QUEUE_URL = "amqp://zoqvthpo:L7AY_DRQV2eFmKPfYASipJtHxsE8bOpC@orangutan.rmq.cloudamqp.com/zoqvthpo"  
# DEDUPE_NEWS_TASK_QUEUE_NAME = "dedupe_news_task" 
# SCRAPE_NEWS_TASK_QUEUE_URL = "amqp://zoqvthpo:L7AY_DRQV2eFmKPfYASipJtHxsE8bOpC@orangutan.rmq.cloudamqp.com/zoqvthpo" 
# SCRAPE_NEWS_TASK_QUEUE_NAME = "news_to_scrape"


# SLEEP_TIME_IN_SECONDS = 5
# logger_format = '%(asctime)s - %(message)s' 
# logging.basicConfig(format=logger_format) 
# logger = logging.getLogger('news_fetcher') 
# logger.setLevel(logging.DEBUG)
# dedupe_news_queue_client = CloudAMQPClient(DEDUPE_NEWS_TASK_QUEUE_URL, DEDUPE_NEWS_TASK_QUEUE_NAME)
# scrape_news_queue_client = CloudAMQPClient(SCRAPE_NEWS_TASK_QUEUE_URL, SCRAPE_NEWS_TASK_QUEUE_NAME)

# def run():
#     while True:
#         if scrape_news_queue_client is not None:
#             msg = scrape_news_queue_client.getMessage()
#             if msg is not None:
#                 # parse and process the task
#                 try:
#                     handle_message(msg)
#                 except Exception as e:
#                     logger.warning(e)
#                     pass
#             scrape_news_queue_client.sleep(SLEEP_TIME_IN_SECONDS)



# def handle_message(msg):
#     if not isinstance(msg, dict):
#         logger.warning('message is broken') 
#         return

#     task = msg 
#     text = None

#     # we only support CNN now 
#     if task['source'] == 'cnn':
#         text = cnn_news_scraper.extract_news(task['url']) 
#     else:
#         return
    
#     task['text'] = text
#     # task['text'] = text.encode('utf-8')
#     dedupe_news_queue_client.sendMessage(task)


# if __name__ == '__main__': 
#     run()



import logging
import os
import sys

from newspaper import Article

# import common package in parent directory
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))

from cloudAMQP_client import CloudAMQPClient

DEDUPE_NEWS_TASK_QUEUE_URL = "amqp://zoqvthpo:L7AY_DRQV2eFmKPfYASipJtHxsE8bOpC@orangutan.rmq.cloudamqp.com/zoqvthpo"  
DEDUPE_NEWS_TASK_QUEUE_NAME = "dedupe_news_task" 
SCRAPE_NEWS_TASK_QUEUE_URL = "amqp://zoqvthpo:L7AY_DRQV2eFmKPfYASipJtHxsE8bOpC@orangutan.rmq.cloudamqp.com/zoqvthpo" 
SCRAPE_NEWS_TASK_QUEUE_NAME = "news_to_scrape"

SLEEP_TIME_IN_SECONDS = 5

logger_format = '%(asctime)s - %(message)s'
logging.basicConfig(format=logger_format)
logger = logging.getLogger('news_fetcher')
logger.setLevel(logging.DEBUG)

scrape_news_queue_client  = CloudAMQPClient(SCRAPE_NEWS_TASK_QUEUE_URL, SCRAPE_NEWS_TASK_QUEUE_NAME)
dedupe_news_queue_client  = CloudAMQPClient(DEDUPE_NEWS_TASK_QUEUE_URL, DEDUPE_NEWS_TASK_QUEUE_NAME)

def handle_message(msg):
    if not isinstance(msg, dict):
        logger.warning('message is broken')
        return

    text = None

    article = Article(msg['url'])
    article.download()
    article.parse()

    msg['text'] = article.text
    dedupe_news_queue_client.sendMessage(msg)


def run():
    while True:
        if scrape_news_queue_client is not None:
            msg = scrape_news_queue_client.getMessage()

            if msg is not None:
                try:
                    handle_message(msg)
                except Exception as e:
                    logger.warning(e)
                    pass
            scrape_news_queue_client.sleep(SLEEP_TIME_IN_SECONDS)

if __name__ == "__main__":
    run()