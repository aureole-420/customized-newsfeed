# -*- coding: utf-8 -*-
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '..','common'))

from cloudAMQP_client import CloudAMQPClient
import mongodb_client
import logging
import news_classes


'''
Time decay model:

If selected:
p = (1-α)p + α

If not:
p = (1-α)p

Where p is the selection probability, and α is the degree of weight decrease.
The result of this is that the nth most recent selection will have a weight of
(1-α)^n. Using a coefficient value of 0.05 as an example, the 10th most recent
selection would only have half the weight of the most recent. Increasing α
would bias towards more recent results prefers.
'''

NUM_OF_CLASSES = 8
INITIAL_P = 1.0 / NUM_OF_CLASSES  #using 1.0 in case python2 gives error
ALPHA = 0.1


SLEEP_TIME_IN_SECONDS = 1
LOG_CLICKS_TASK_QUEUE_URL = "amqp://zoqvthpo:L7AY_DRQV2eFmKPfYASipJtHxsE8bOpC@orangutan.rmq.cloudamqp.com/zoqvthpo"  
LOG_CLICKS_TASK_QUEUE_NAME = "tap-news-log-clicks-task-queue"

PREFERENCE_MODEL_TABLE_NAME = "user_preference_model"
NEWS_TABLE_NAME = "news"

LOGGER_FORMAT = '%(asctime)s - %(message)s'
logging.basicConfig(format=LOGGER_FORMAT)
LOGGER = logging.getLogger('click_log_processor')
LOGGER.setLevel(logging.DEBUG)
clouldAMQP_client = CloudAMQPClient(LOG_CLICKS_TASK_QUEUE_URL, LOG_CLICKS_TASK_QUEUE_NAME)

def handle_message(msg):
    if not isinstance(msg, dict):
        return

    if ('userId' not in msg
        or 'newsId' not in msg
        or 'timestamp' not in msg):
        return
    
    userId = msg['userId']
    newsId = msg['newsId']
    db = mongodb_client.get_db()
    model = db[PREFERENCE_MODEL_TABLE_NAME].find_one({'userId' : userId})


    """
    how model looks like:
    
        userId: 'user1',
        preference: {
            'sport' : 0.2,
            'USA' : 0.1,
             ...
        }
    """
    if model is None:
        LOGGER.info("creating preference model for user: %s", userId)
        new_model = {'userId' : userId}
        preference = {} 

        for i in news_classes.classes:
            preference[i] = float(INITIAL_P)
        new_model['preference'] = preference
        model = new_model

    LOGGER.info('Updating preference model for user %s', userId)
    #updating model check
    news = db[NEWS_TABLE_NAME].find_one({'digest': newsId})
    if (news is None
        or 'class' not in news
        or news['class'] not in news_classes.classes):# in case someone changed news classes
        return
    
    #start updating
    click_class = news['class']  #for example, "sports"

    # Update the clicked one.
    old_p = model['preference'][click_class]
    model['preference'][click_class] = float((1 - ALPHA) * old_p + ALPHA)

    # Update not clicked classes.
    for i, prob in model['preference'].items():
        if not i == click_class:
            model['preference'][i] = float((1 - ALPHA) * model['preference'][i])

    db[PREFERENCE_MODEL_TABLE_NAME].replace_one({'userId':userId}, model, upsert=True)

def run():
    while True:
        if clouldAMQP_client is not None:
            msg = clouldAMQP_client.getMessage()
            if msg is not None:
                try:
                    handle_message(msg)
                except Exception as e:
                    LOGGER.warn(e)
                    pass 
            clouldAMQP_client.sleep(SLEEP_TIME_IN_SECONDS)

if __name__ == "__main__":
    run()