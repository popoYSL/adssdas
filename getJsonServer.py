import json
import os
from autobahn.twisted.websocket import WebSocketServerProtocol, WebSocketServerFactory
import base64
import sys
from twisted.python import log
from twisted.internet import reactor
from io import StringIO
class MyServerProtocol(WebSocketServerProtocol):

    def onConnect(self, request):
        print("Client connecting: {}".format(request.peer))

    def onOpen(self):
        print("WebSocket connection open.")
        # self.sendMessage(b'1')
        # def hello():
        #     # with open("/var/www/html/img/image.png", "rb") as image_file:
        #     #     encoded_string = base64.b64encode(image_file.read())
        #     self.sendMessage('hello client!!!!')
        #     # self.factory.reactor.callLater(0.2, hello)

        # # start sending messages every 20ms ..
        # hello()

    def onMessage(self, payload, isBinary):
        if isBinary:
            print("Binary message received: {} bytes".format(len(payload)))
        else:
            print("Text message received: {}".format(payload.decode('utf8')))
        # indexLists = json.dumps(payload.decode('utf8'))  
        # print(indexLists)
        # if(payload.decode('utf8')=='0'):
        if not(payload.decode('utf8')=='-1'):
            with open('json/'+payload.decode('utf8')+'.json',"r") as f:
                indexList = json.load(f)  
            io = StringIO()
            json.dump(indexList,io)
            io.getvalue()
            # echo back message verbatim
            self.sendMessage(io.getvalue().encode(), isBinary)

    def onClose(self, wasClean, code, reason):
        print("WebSocket connection closed: {}".format(reason))


if __name__ == '__main__':
    log.startLogging(sys.stdout)

    factory = WebSocketServerFactory(u"ws://127.0.0.1:50006")
    factory.protocol = MyServerProtocol
    # factory.setProtocolOptions(maxConnections=2)

    # note to self: if using putChild, the child must be bytes...

    reactor.listenTCP(50006, factory)
    reactor.run()