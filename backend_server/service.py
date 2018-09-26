""" Backend service """ # doc string
# 看 jsonrpclib的doc

import logging
# import json
# import os
# import sys
# import mongodb_client
import operations

# https://pypi.org/project/jsonrpclib-pelix/
# 数据的收发，parsing全部都是这个lib做了
from jsonrpclib.SimpleJSONRPCServer import SimpleJSONRPCServer

# from bson.json_util import dumps # mongodb 直接读下来的是bson而不是json

# import common packages in parent directory, ../utils
# sys.path.append(os.path.join(os.path.dirname(__file__), 'utils'))



SERVER_HOST = 'localhost' # 127.0.0.1
SERVER_PORT = 4040

LOGGING_FORMAT = '%(asctime)s - %(message)s'
logging.basicConfig(format=LOGGING_FORMAT)
LOGGER = logging.getLogger('backend_service')
LOGGER.setLevel(logging.DEBUG) #开发阶段log比较多
# logger.setLevel(logging.INFO) #部署阶段

def add(num1, num2):
    """Test method"""
    LOGGER.debug('add is called with %d and %d', num1, num2)
    return num1 + num2

# for pylint scoring, not using camel style
def get_one_news():
    """Test method to get one news. """
    LOGGER.debug('get_one_news is called')
    return operations.get_one_news()
    # LOGGER.debug('get_one_N=news is called')
    # res = mongodb_client.get_db()['news'].find_one()
    # # dumps(res) : convert bson to string
    # # then convert string to json.
    # return json.loads(dumps(res))

def get_news_summaries_for_user(user_id, page_num):
    """get news summaries for a user"""
    LOGGER.debug("get_news_summaries_for_user is called with %s and %s", user_id, page_num)
    return operations.getNewsSummariesForUser(user_id, page_num)

def log_news_click_for_users(user_id, news_id):
    """log a news click event for a user."""
    LOGGER.debug("log_news_click_for_user is called with %s and %s", user_id, news_id)
    return operations.logNewsClickForUser(user_id, news_id)



SERVER = SimpleJSONRPCServer((SERVER_HOST, SERVER_PORT))
SERVER.register_function(add, 'add')
SERVER.register_function(get_one_news, 'getOneNews') # still expose 'getOneNews'
SERVER.register_function(get_news_summaries_for_user, 'getNewsSummariesForUser')

LOGGER.info("Starting RPC server on %s:%d", SERVER_HOST, SERVER_PORT)

SERVER.serve_forever()
