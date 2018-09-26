import operations
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..','common'))

from cloudAMQP_client import CloudAMQPClient
LOG_CLICKS_TASK_QUEUE_URL = "amqp://zoqvthpo:L7AY_DRQV2eFmKPfYASipJtHxsE8bOpC@orangutan.rmq.cloudamqp.com/zoqvthpo"  
LOG_CLICKS_TASK_QUEUE_NAME = "tap-news-log-clicks-task-queue"
cloudAMQP_client = CloudAMQPClient(LOG_CLICKS_TASK_QUEUE_URL, LOG_CLICKS_TASK_QUEUE_NAME) 

def test_getOneNews_basic():
    news = operations.get_one_news()
    print(news)
    assert news is not None
    
    print('test_getOneNews_basic passed.')

def test_getNewsSummariesForUser_basic():
    news = operations.getNewsSummariesForUser('test_user', 1)
    assert len(news) > 0
    print('test_getNewsSummariesForUser_basic passed!')


def test_getNewsSummariesForUser_invalid_pageNum():
    news = operations.getNewsSummariesForUser('test_user', -1)
    assert len(news) == 0
    print('test_getNewsSummariesForUser_invalid_pageNum passed!')


def test_getNewsSummariesForUser_large_pageNum():
    news = operations.getNewsSummariesForUser('test_user', 1000)
    assert len(news) == 0
    print('test_getNewsSummariesForUser_large_pageNum passed!')


def test_getNewsSummariesForUser_pagination():
    news_page_1 = operations.getNewsSummariesForUser('test_user', 1)
    news_page_2 = operations.getNewsSummariesForUser('test_user', 2)

    assert len(news_page_1) > 0
    assert len(news_page_2) > 0

    digests_page_1_set = set([news['digest'] for news in news_page_1])
    digests_page_2_set = set([news['digest'] for news in news_page_2])

    assert len(digests_page_1_set.intersection(digests_page_2_set)) == 0

    print('test_getNewsSummariesForUser_pagination passed!')

def test_logNewsClickForUser():
    operations.logNewsClickForUser('test_user', 'test_news')
    cloudAMQP_client.sleep(3)
    msg = cloudAMQP_client.getMessage()
    assert msg['userId'] == 'test_user'
    assert msg['newsId'] == 'test_news'
    print('test_logNewsClickForUser passed!')



if __name__ == "__main__":
    test_getOneNews_basic()
    test_getNewsSummariesForUser_basic()
    test_getNewsSummariesForUser_invalid_pageNum()
    test_getNewsSummariesForUser_large_pageNum()
    test_getNewsSummariesForUser_pagination()
    test_logNewsClickForUser()
