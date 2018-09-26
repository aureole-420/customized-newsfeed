# this is the rpc client to call the RPC servcie

# import jsonrpclib
# URL = "http://localhost:6060"

# # client = jsonrpclib.ServerProxy(URL)
# client = jsonrpclib.ServerProxy(URL)

# def classify(text):
#     topic = client.classify(text)
#     print("Topic: %s" % str(topic))
#     return topic

import jsonrpclib

URL = "http://localhost:6060"

client = jsonrpclib.ServerProxy(URL)

def classify(text):
    topic = client.classify(text)
    print("Topic: %s" % str(topic))
    return topic