import requests
from bs4 import BeautifulSoup
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
# targeturl = "https://www.huya.com/116"
# achorname,subscribe,avatarImg = huya_message(targeturl)
print(formatSubNum(2334))