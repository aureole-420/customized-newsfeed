# use pika as AMQP client
# pip3 install pika
# https://pika.readthedocs.io/en/0.10.0/  此文档比较复杂
# https://www.rabbitmq.com/tutorials/tutorial-one-python.html rabbitmq的文档比较简单

import logging
import json
import pika

LOGGER_FORMAT = '%(asctime)s - %(message)s'
logging.basicConfig(format=LOGGER_FORMAT)
LOGGER = logging.getLogger('cloud_amqp_client')
LOGGER.setLevel(logging.DEBUG)


# https://www.rabbitmq.com/tutorials/tutorial-one-python.html
# 把例子里面的代码封装到类里
# create client class, since we want to connect to different cloud amqp instances
class CloudAMQPClient:
    # 初始化, queue_name是routing key
    def __init__(self, cloud_amqp_url, queue_name):
        self.cloud_amqp_url= cloud_amqp_url
        self.queue_name= queue_name
        self.params = pika.URLParameters(cloud_amqp_url)
        self.params.socket_timeout = 3 # 3 seconds
        self.connection = pika.BlockingConnection(self.params)
        self.channel = self.connection.channel()
        # create a queue
        self.channel.queue_declare(queue=queue_name)


    # send a message
    def sendMessage(self, message):
        # message is a json object, when send message to queue,
        # we need to convert it to string
        self.channel.basic_publish(exchange='',
            routing_key=self.queue_name,
            body=json.dumps(message)) # json.dumps 序列化， json.loads 反序列化
        LOGGER.debug("[x] send message to %s:%s", self.queue_name, message)

    # Get a message, if no message, return none
    def getMessage(self):
        method_frame, header_frame, body = self.channel.basic_get(self.queue_name)
        # if error, method_frame null
        if method_frame:
            LOGGER.debug("[x] Received messag from %s %s", self.queue_name, body)
            self.channel.basic_ack(method_frame.delivery_tag)
            # decode bytes to stringm then convert string to json format
            return json.loads(body.decode('utf-8'))
        else:
            LOGGER.debug("No message returned")
            return None

    # BlockingConnection.sleep is a safer way to sleep than time.sleep(). Thi
    # will respoond to server's heartbeat
    def sleep(self, seconds):
        self.connection.sleep(seconds)
