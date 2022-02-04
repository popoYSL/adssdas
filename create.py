from cgi import test
from multiprocessing.spawn import import_main_path
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
import copy
import shutil
import requests

def mkdir(path):
    path=path.strip()
    path=path.rstrip("\\")
    isExists=os.path.exists(path)
    if not isExists:
        os.makedirs(path) 
        return True
    else:
        return False
def huya_message(targeturl):
    try:
        req = requests.get(url = targeturl)
        html = req.text
        bf = BeautifulSoup(html,'lxml')
        achorname = bf.find_all(class_ = 'host-name')[0].text
        subscribe = bf.find_all(id='activityCount', class_ = 'subscribe-count')[0].text
        avatarImg = bf.find_all(id='avatar-img')[0].get('src')
    except:
        achorname = 'popo'
        subscribe = '12321312'
        avatarImg = 'images/Jack.png'
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
    if(os.path.exists(filePath)):
        t = os.path.getctime(filePath)
        return TimeStampToTime(t)
def getIds():
    ids = []
    response = requests.get("https://github.com/popoYSL/adssdas/tree/main/v")
    html = response.text
    bs = BeautifulSoup(html,'lxml')
    texts = bs.find_all('a', class_='js-navigation-open Link--primary')
    for t in texts:
        ids.append(str(t.text))
    return ids
def cmd(command):
    p = subprocess.run(command, encoding="utf-8" , shell=True)
def getLink(video_path):
    ids = getIds()
    base64_video_path = str(hashlib.md5(video_path.encode(encoding='UTF-8')).hexdigest())
    root_path = 'v'
    file_path = os.path.join(root_path,base64_video_path)
    if not(base64_video_path in ids or os.path.exists(file_path)):
        mkdir(root_path)
        mkdir(file_path)
            
        cmd_thumb = f'ffmpeg -y -i "{video_path}" -vf  "thumbnail,scale=640:360:force_original_aspect_ratio=decrease,pad=640:360:(ow-iw)/2:(oh-ih)/2" -qscale 1 -frames:v 1 {file_path}/thumb.png'
        
        cmd_transalte_normal=f'ffmpeg -y -threads 6 -i "{video_path}" -c copy temp"{video_path}"'
        cmd(cmd_transalte_normal)
        os.remove(video_path)
        os.rename(f'temp{video_path}',video_path)

        cmd_transalte=f'ffmpeg -y -threads 6 -re -fflags +genpts -i "{video_path}" -s:0 1920x1080 -ac 2 -vcodec libx264 -profile:v main -pix_fmt yuv420p -b:v:0 6000k -maxrate:0 6000k -bufsize:0 8000k -r 30 -ar 44100 -g 48 -c:a aac -b:a:0 128k -s:2 1280x720 -ac 2 -vcodec libx264 -profile:v main -pix_fmt yuv420p -b:v:1 2000k -maxrate:2 2000k -bufsize:2 4000k -r 30 -ar 44100 -g 48 -c:a aac -b:a:1 128k -s:4 720x480 -ac 2 -vcodec libx264 -profile:v main -pix_fmt yuv420p -b:v:2 1000k -maxrate:4 1000k -bufsize:4 2000k -r 30 -ar 44100 -g 48 -s:5 640x360 -ac 2 -vcodec libx264 -profile:v main -pix_fmt yuv420p -b:v:0 330k -maxrate:0 330k -bufsize:0 350k -r 30 -ar 44100 -g 48 -c:a aac -b:a:2 128k -map 0:v -map 0:a -map 0:v -map 0:a -map 0:v -map 0:a -map 0:v -map 0:a -f hls -var_stream_map "v:0,a:0 v:1,a:1 v:2,a:2 v:3,a:3" -hls_segment_type mpegts -hls_enc 1 -hls_enc_key 0123456789ABCDEF0123456789ABCDEF -hls_enc_key_url "key.key" -start_number 10 -hls_time 10 -hls_list_size 0 -hls_start_number_source 1 -master_pl_name "index.m3u8" -hls_segment_filename "{file_path}/index_%v-%09d.ts" "{file_path}/index_%v.m3u8"'
        
        cmd(cmd_thumb)
        cmd(cmd_transalte)
      
        if os.path.exists('key.key'):
            if os.path.exists(os.path.join(file_path,'key.key')):
                os.remove(os.path.join(file_path,'key.key'))
            shutil.move('key.key',file_path)
    push(file_path)
    thumbUrl = f'https://cdn.jsdelivr.net/gh/popoYSL/adssdas/v/{base64_video_path}/thumb.png'
    linkid = base64_video_path
    link = f'https://cdn.jsdelivr.net/gh/popoYSL/adssdas/v/{base64_video_path}/index.m3u8'
    createTime = str(get_FileCreateTime(video_path))
    return linkid,link,thumbUrl,createTime
def getJson(targeturl,videoDictList):
    
    achorname,subscribe,avatarImg = huya_message(targeturl)
    
    try:
        with open(os.path.join('json','index.json'),'r') as load_f:
            indexList = json.load(load_f)
    except:
        indexList = []
    mkdir('json')
    for videoInfo in videoDictList:
        tilte = videoInfo['title']
        videoFileList = videoInfo['files']
        if len(videoFileList)>0:
            print(tilte)
            fileList=[]
            fileDict = {}
            firstFileId  = ''
            linkid = ''
            firstFile = {}
            for file in videoFileList:
                linkid,link,thumbUrl,createTime = getLink(file)
                fileDict['name'] = file[:-4] #侧边标题名称
                fileDict['link'] = link # 视频链接videoUrl
                fileDict['linkid'] = linkid
                fileDict['thumbUrl'] = thumbUrl #封面图链接
            
                fileDict['created_at'] = createTime
                
                if(len(fileList))==0:
                    fileDict['achorname'] = achorname
                    fileDict['subscribe'] = subscribe
                    fileDict['avatar-img'] = avatarImg
                    fileDict["folderName"] = tilte
                    firstFileId = linkid
                    fileDict["firstLinkId"] = firstFileId
                    fileDict['tags'] = videoInfo['tags']
                    fileDict['desc'] = videoInfo['desc']
                    firstFile = fileDict
                if not fileDict in fileList:
                    fileList.append(fileDict)
                fileDict = copy.deepcopy(fileDict)
            if firstFile:
               indexList.append(firstFile)
            if fileList:
                with open(os.path.join('json',firstFileId+'.json'),"w",encoding="utf-8") as f:
                    json.dump(fileList,f)
        if indexList:
            with open(os.path.join('json','index.json'),"w",encoding="utf-8") as f:
                json.dump(indexList[::-1],f)
def push(path):
    cmd(f"git add .")
    cmd(f"git commit -m 'update'")
    cmd(f"git push")
def getHttpStatusCode(url):
    try:
        request = requests.get(url)
        httpStatusCode = request.status_code
        return httpStatusCode
    except Exception as e:
        return 404

    
def clearIndex():
    try:
        ids = getIds()
        with open(os.path.join('json','index.json'),'r') as load_f:
            indexList = json.load(load_f)
        newindexList = []
        for file in indexList:
            id = file['linkid']
            if(id in ids and not file in newindexList):
                newindexList.append(file)
        with open(os.path.join('json','index.json'),"w",encoding="utf-8") as f:
            json.dump(newindexList,f)
    except:
        indexList = []
targeturl = 'https://www.huya.com/wanzi'
videoDict = {}
videoDictList = []

videoDict['title'] = "擦玻璃"
videoDict['files'] = [f for f in os.listdir('./') if f.endswith('flv')]
videoDict['desc'] = ['如有问题，请联系删除']
videoDict['tags'] = ['鄧紫棋','句號']

videoDictList.append(videoDict)
videoDict = copy.deepcopy(videoDict)
getJson(targeturl,videoDictList)
# clearIndex()