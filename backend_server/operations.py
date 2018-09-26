""" Backend Operations """

import json
import os
import sys
import pickle
import redis 

# import common packages in parent directory, ../utils
# sys.path.append(os.path.join(os.path.dirname(__file__), 'utils'))
sys.path.append(os.path.join(os.path.dirname(__file__), '..','common'))
import mongodb_client

from bson.json_util import dumps # mongodb 直接读下来的是bson而不是json
from datetime import datetime
from cloudAMQP_client import CloudAMQPClient
import news_recommendation_service_client



NEWS_TABLE_NAME = "news"

REDIS_HOST = 'localhost'
REDIS_PORT = 6379

NEWS_LIST_BATCH_SIZE = 10 # number of nuews in single page
NEWS_LIMIT = 200  # max number of news of one fetch
USER_NEWS_TIME_OUT_IN_SECONDS = 60 * 60

redis_client = redis.StrictRedis()

LOG_CLICKS_TASK_QUEUE_URL = "amqp://zoqvthpo:L7AY_DRQV2eFmKPfYASipJtHxsE8bOpC@orangutan.rmq.cloudamqp.com/zoqvthpo"  
LOG_CLICKS_TASK_QUEUE_NAME = "tap-news-log-clicks-task-queue"
cloudAMQP_client = CloudAMQPClient(LOG_CLICKS_TASK_QUEUE_URL, LOG_CLICKS_TASK_QUEUE_NAME) 

# for pylint scoring, not using camel style
def get_one_news():
    """Get one news. """
    # LOGGER.debug('get_one_N=news is called')
    db = mongodb_client.get_db()
    news = db[NEWS_TABLE_NAME].find_one()
    # res = mongodb_client.get_db()['news'].find_one()
    # dumps(res) : convert bson to string
    # then convert string to json.
    return json.loads(dumps(news))

def getNewsSummariesForUser(user_id, page_num):
    page_num = int(page_num)

    if page_num <= 0:
        return []

    begin_index = (page_num - 1) * NEWS_LIST_BATCH_SIZE
    end_index = page_num * NEWS_LIST_BATCH_SIZE

    # The final list of news to be returned.
    sliced_news = []
    db = mongodb_client.get_db()

    if redis_client.get(user_id) is not None:
        news_digests = pickle.loads(redis_client.get(user_id))

        sliced_news_digests = news_digests[begin_index:end_index]
        sliced_news = list(db[NEWS_TABLE_NAME].find({'digest':{'$in':sliced_news_digests}}))
    else:
        total_news = list(db[NEWS_TABLE_NAME].find().sort([('publishedAt', -1)]).limit(NEWS_LIMIT))

        total_news_digests = [x['digest'] for x in total_news]

        redis_client.set(user_id, pickle.dumps(total_news_digests))
        redis_client.expire(user_id, USER_NEWS_TIME_OUT_IN_SECONDS)

        sliced_news = total_news[begin_index:end_index]


    #  get preference for user
    # TODO: use preference to customize returned news list
    preference = news_recommendation_service_client.getPreferenceForUser(user_id) 

    if preference is not None and len(preference) > 0:
        topPreference = preference[0]
    
    for news in sliced_news:
        # Remove text field to save bandwidth.
        del news['text']
        if news['class'] == topPreference:
            news['reason'] = 'Recommend' # reason在newscard里面加一个小图标

    return json.loads(dumps(sliced_news))


def logNewsClickForUser(user_id, news_id):
    message = {'userId': user_id, 'newsId' : news_id, 'timestamp':str(datetime.utcnow())}

    cloudAMQP_client.sendMessage(message)
