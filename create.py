import time
import subprocess
import hashlib
import os
import json
import time
from turtle import tilt
import requests
from bs4 import BeautifulSoup
import os

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

def TimeStampToTime(timestamp):
    timeStruct = time.localtime(timestamp)
    return time.strftime("%Y年%m月%d日 %H:%M:%S",timeStruct)
def get_FileCreateTime(filePath):
    t = os.path.getctime(filePath)
    return TimeStampToTime(t)

def getJson(targeturl,tilte,videoFileList):
    achorname,subscribe,avatarImg = huya_message(targeturl)
    indexList = []
    mkdir('json')
    if len(videoFileList)>0:
        print(tilte)
        fileList=[]
        fileDict = {}
        firstFileId  = ''
        for file in videoFileList:
            
            linkid,link,thumbUrl,createTime = getLink(file)
            fileDict['achorname'] = achorname
            fileDict['subscribe'] = subscribe
            fileDict['avatar-img'] = avatarImg
           
            
            fileDict['name'] = file[:-4] #侧边标题名称
            fileDict['link'] = link # 视频链接videoUrl
            fileDict['linkid'] = linkid
            fileDict['thumbUrl'] = thumbUrl #封面图链接
           
            fileDict['created_at'] = createTime
            
            if(len(fileList))==0:
                fileDict["folderName"] = tilte
                firstFileId = linkid
                fileDict["firstLinkId"] = firstFileId
                firstFile = fileDict
            fileList.append(fileDict)
        indexList.append(firstFile)
        with open(os.path.join('json',firstFileId+'.json'),"w",encoding="utf-8") as f:
            json.dump(fileList,f)
    with open(os.path.join('json','index.json'),"w",encoding="utf-8") as f:
        json.dump(indexList[::-1],f)
        
def mkdir(path):
    path=path.strip()
    path=path.rstrip("\\")
    isExists=os.path.exists(path)
    if not isExists:
        os.makedirs(path) 
        return True
    else:
        return False
def cmd(command):
    subprocess.run(command, encoding="utf-8" , shell=True)
def getLink(video_path):
    base64_video_path = str(hashlib.md5(video_path.encode(encoding='UTF-8')).hexdigest())
    root_path = 'v'
    file_path = os.path.join(root_path,base64_video_path)
    mkdir(root_path)
    mkdir(file_path)
    fileName = video_path[:-3]
    video_ts = fileName+"ts"
    m3u8_path= os.path.join(file_path,fileName+"m3u8")

    cmd_thumb = f'ffmpeg -y -i {video_path} -vf  "thumbnail,scale=640:360" -frames:v 1 {file_path}/thumb.png'
    cmd_str1 = f'ffmpeg -y -i {video_path} -vcodec copy -acodec copy -vbsf h264_mp4toannexb {video_ts}'
    cmd_str2 = f'ffmpeg -y -i {video_ts} -c copy -map 0 -f segment -segment_list {m3u8_path} -segment_time 5 {file_path}/%03d.ts'
    cmd(cmd_thumb)
    cmd(cmd_str1)
    cmd(cmd_str2)
    thumbUrl = f'https://cdn.jsdelivr.net/gh/popoYSL/video-bed/v/{base64_video_path}/thumb.png'
    linkid = base64_video_path
    link = f'https://cdn.jsdelivr.net/gh/popoYSL/video-bed/v/{base64_video_path}/index.m3u8'
    createTime = str(get_FileCreateTime(video_path))
    os.remove(video_path)
    os.remove(video_ts)
    return linkid,link,thumbUrl,createTime
def push():
    cmd(f"git add .")
    cmd(f"git commit -m 'update'")
    cmd(f"git push")
targeturl = 'https://www.huya.com/wanzi'
tilte = 'test'
videoFileList = ['Lete.mp4']
getJson(targeturl,tilte,videoFileList)
push()