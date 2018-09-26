from pymongo import MongoClient

MONGO_DB_HOST = 'localhost'
MONGO_DB_PORT = 27017
DB_NAME = 'tap-news'


# https://api.mongodb.com/python/current/tutorial.html
# singleton client
client = MongoClient(MONGO_DB_HOST, MONGO_DB_PORT)


# if there is no argument, use the defualt DB_NAME # Othewise, use the passed in argument
def get_db(db = DB_NAME):
    db = client[db]
    return db
