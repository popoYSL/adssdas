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
def getLink(fileId):
    data =streamtape.get_download_ticket(login,key,fileId)
    download_ticket = data['result']['ticket']
    import asyncio
    link = asyncio.get_event_loop().run_until_complete(streamtape.get_download_link(fileId,download_ticket))
    return(link['result']['url'])
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
def takeCreateTime(elem):
    ts = int(time.mktime(time.strptime(elem['created_at'], "%Y年%m月%d日 %H:%M:%S")))
    return ts
def sortByCreateTime(indexList):
    indexList.sort(key=takeCreateTime,reverse = True)
    return indexList
def mkdir(path):
    path=path.strip()
    path=path.rstrip("\\")
    isExists=os.path.exists(path)
    # 判断结果
    if not isExists:
        os.makedirs(path) 
def getJson():
    mkdir('json')
    try:
        with open(os.path.join('json','index.json'),"r",encoding="utf-8") as f:
            indexList = json.load(f)  
    except:
        indexList = []
    with open('links.json',"r",encoding="utf-8") as f:
        linkDict = json.load(f)
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
                file['link'] = linkDict[file['linkid']] # 视频链接videoUrl
                linkid = file['linkid']
                thumbData = streamtape.get_thumbnail(login,key,linkid)
                count = 0
                while not (thumbData['status']==200):
                    print('miss thumbData '+file['name'])
                    thumbData = streamtape.get_thumbnail(login,key,linkid)
                    count = count +1
                    if(count>3):
                        thumbData['result'] = 'images/miss.jpg'
                        break
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
            indexList = sortByCreateTime(indexList)
            with open(os.path.join('json','index.json'),"w",encoding="utf-8") as f:
                json.dump(indexList,f)


# try:
#     with open(os.path.join('json','index.json'),"r",encoding="utf-8") as f:
#         indexList = json.load(f)  
#     indexList = indexList[::-1]  
# except:
#     indexList = []
getJson()

# with open("./record.json",'r') as load_f:
#     load_dict = json.load(load_f)
# print(type(load_dict.keys()))
# for folder in load_dict.keys():
#     title = folder
#     fileList = load_dict[folder]
#     for fileInfo in fileList:
#         print(fileInfo['name']+'in'+folder)

