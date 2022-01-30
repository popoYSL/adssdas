from autobahn.twisted.websocket import WebSocketServerProtocol, WebSocketServerFactory
import base64
import sys
from twisted.python import log
from twisted.internet import reactor
import os
import json
import threading
import json
from math import fabs
import streamtape
import time
import requests
from bs4 import BeautifulSoup
import os

login = '3d2cb17b4037b64a9cf3'
key = 'goX9YaPq0OTvZp'
parent_folder_id = 'KYRpxWMB3_k' 

def huya_message(targeturl):
    req = requests.get(url = targeturl)
    html = req.text
    bf = BeautifulSoup(html,'lxml')
    achorname = bf.find_all(class_ = 'host-name')[0].text
    subscribe = bf.find_all(id='activityCount', class_ = 'subscribe-count')[0].text
    avatarImg = bf.find_all(id='avatar-img')[0].get('src')
    return achorname,formatSubNum(subscribe),avatarImg
def formatSubNum(subNum):
    subNum = int(subNum)
    if(subNum>=10000):
        return(str((int(subNum/1000)/10))+'万位订阅者')
    else:
        return str(subNum)
def isHas(indexList,folderName):
    for file in indexList:
        if(file['folderName']==folderName or file['folderName']=='已经删除'):
            return True
    return False

class MyServerProtocol(WebSocketServerProtocol):

    def onConnect(self, request):
        print("Client connecting: {}".format(request.peer))

    def onOpen(self):
        print("WebSocket connection open.")

        # def hello():
        #     encoded_string = bytes('hello','utf8')
        #     self.sendMessage(encoded_string)
        #     self.factory.reactor.callLater(0.2, hello)

        # # start sending messages every 20ms ..
        # hello()

    def onMessage(self, payload, isBinary):
        if isBinary:
            print("Binary message received: {} bytes".format(len(payload)))
        else:
            print("Text message received: {}".format(payload.decode('utf8')))
        name = str(payload.decode('utf8'))
        t=threading.Thread(args=(name,),target=self.myhandler)
        t.start()
        # self.myhandler(name)
        # echo back message verbatim
        # self.sendMessage(payload, isBinary)

    def onClose(self, wasClean, code, reason):
        print("WebSocket connection closed: {}".format(reason))
    def delIndex(self):
        jsonPath = os.path.join('json','index.json')
        if os.path.exists(jsonPath):
            os.remove(jsonPath)
    def updateIndex(self):
        self.getJson()
    def removeInfo(self,name):
        with open(os.path.join('json','index.json'),"r",encoding="utf-8") as f:
            indexList = json.load(f)  
        for  file in indexList:
            if file['folderName']==name:
                jsonPath = os.path.join('json',file['firstLinkId']+".json")
                if os.path.exists(jsonPath):
                    os.remove(jsonPath)
                file.clear()
                file['folderName'] = '已经删除'
        with open(os.path.join('json','index.json'),"w",encoding="utf-8") as f:
            indexList = json.dump(indexList,f) 
    def myhandler(self,name):
        if(name=='0'):
            self.updateIndex()
        elif(name=='1'):
            self.delIndex()
            self.updateIndex()
        else:
            self.removeInfo(name)
    def getJson(self):
        try:
            with open(os.path.join('json','index.json'),"r",encoding="utf-8") as f:
                indexList = json.load(f)  
            indexList = indexList[::-1]  
        except:
            indexList = []
        achorname,subscribe,avatarImg = huya_message(targeturl="https://www.huya.com/wanzi")
        data = streamtape.subfolder_conent(login,key,parent_folder_id)# 第一层folder
        folderDict = data['result']['folders']        
        #每个folder
        for folder in folderDict:             
            parentfolder_id = folder['id']
            folderName = folder['name'] #作为标题名称
            if(isHas(indexList,folderName)):
                continue
            data = streamtape.subfolder_conent(login,key,parentfolder_id)
            fileDict = data['result']['files']
            if len(fileDict)>0:
                print(folderName)
                fileList=[]
                firstFileId  = ''
                for file in fileDict:
                    file['achorname'] = achorname
                    file['subscribe'] = subscribe
                    file['avatar-img'] = avatarImg
                    if(len(fileList))==0:
                        file["folderName"] = folderName
                        firstFileId = file['linkid']
                        firstFile = file
                    file["firstLinkId"] = firstFileId
                    file['name'] = file['name'][:-4] #侧边标题名称
                    file['link'] = "https://streamtape.com/e/"+file['linkid'] # 视频链接videoUrl
                    linkid = file['linkid']
                    thumbData = streamtape.get_thumbnail(login,key,linkid)
                    while not (thumbData['status']==200):
                        thumbData = streamtape.get_thumbnail(login,key,linkid)
                        if thumbData['status']==200:
                            break
                        time.sleep(10)
                    file['thumbUrl'] = thumbData['result'] #封面图链接
                    timeArray = time.localtime(file['created_at'])
                    file['created_at'] = str(time.strftime("%Y年%m月%d日 %H:%M:%S", timeArray))
                    fileList.append(file)
                if not(firstFile in indexList):
                    indexList.append(firstFile)
                with open(os.path.join('json',firstFileId+'.json'),"w",encoding="utf-8") as f:
                    json.dump(fileList,f)
        with open(os.path.join('json','index.json'),"w",encoding="utf-8") as f:
            json.dump(indexList[::-1],f)
if __name__ == '__main__':
    log.startLogging(sys.stdout)

    factory = WebSocketServerFactory(u"ws://127.0.0.1:50007")
    factory.protocol = MyServerProtocol
    # factory.setProtocolOptions(maxConnections=2)

    # note to self: if using putChild, the child must be bytes...

    reactor.listenTCP(50007, factory)
    reactor.run()