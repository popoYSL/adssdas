// var menuIcon = document.querySelector(".menu-icon");
// var sidebar = document.querySelector(".sidebar");
// var container  = document.querySelector(".container");

// menuIcon.onclick = function(){
//     sidebar.classList.toggle("small-siderbar");
//     container.classList.toggle("large-container")
// }
// var searchIcon = document.querySelector(".search-icon");
// var searchBox = document.querySelector(".search-box");
// var searchBoxInput = document.querySelector(".search-box-input");
// // var container  = document.querySelector(".container");

// searchIcon.onclick = function(){
//     searchBox.classList.toggle("open-search-box");
//     searchBoxInput.classList.toggle("open-search-box-input")
// }
// --------------------------------------------
init()
// --------------------------------------------
function init()
{
    var w = document.documentElement.clientWidth || document.body.clientWidth;
    if(w>900)
    {
        document.getElementsByClassName("search-icon")[0].setAttribute("src",'images/search.png')

    }
    else
    {
        document.getElementsByClassName("search-icon")[0].setAttribute("src",'images/return.png')
    }
}
//---------------------搜索页面-----------------------
function SearchFunction() 
{
    // 声明变量
    var input, filter, ul, li, a, i;
    input = document.getElementById('myInput');
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName('li');
    // 循环所有列表，查找匹配项
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1 && filter!='') {
            li[i].style.display = 'inline'
        }
        else
        {
            li[i].style.display = 'none'
        }
    }
}
// ----------------打开搜索结果页面-------------------------
function OpenWinFunction()
{

    var input, filter;
    input = document.getElementById('myInput');
    filter = input.value.toUpperCase();
    if(filter!='')
    {
        goUrl = "search.html?s="+filter;
        window.open(goUrl,'_self');
    }
    
}
function OpenWinByfilter(element)
{
    filter = element.innerHTML
    goUrl = "search.html?s="+filter.replace("#","")
    window.open(goUrl,'_self');
}
function OpenVideo(id,playingVideo,createTime)
{
    var lists = document.getElementsByClassName('side-choose-video-list')
    var videoE = document.getElementById('video')
    if(videoE.src.search(id) == -1)
    {
        videoE.src='video.html?v='+id;;
        if(playingVideo!='')
            document.getElementById('playingVideo').innerText=playingVideo;
        if(createTime!='')
            document.getElementById('createTime').innerText=createTime;
    }
    for(var i = 0;i<lists.length;i++)
    {
        if(lists[i].id==id)
        {
            lists[i].classList.add("side-video-list_click")
            lists[i].getElementsByClassName('right-box-fileindex')[0].innerHTML = '▶'
            playerVideo.fire()
            var element = document.getElementById('video')
            element._params = i
        }
        else
        {
          
            lists[i].classList.remove("side-video-list_click")
            lists[i].getElementsByClassName('right-box-fileindex')[0].innerHTML = i+1
        }
    }
}
function _bindEventHandler(event)
{
    const i = event.target._params
    callbacks.fire(i+1)
}
function Open()
{
    var w = document.documentElement.clientWidth || document.body.clientWidth;
    if(w>900)
    {
        if(document.getElementsByClassName("search-icon")[0].getAttribute("src")== "images/return.png")
            document.getElementsByClassName("search-icon")[0].setAttribute("src",'images/search.png')
        OpenWinFunction()
    }
    else
    {
        document.getElementsByClassName("search-icon")[0].setAttribute("src",'images/return.png')
        var middle = document.querySelector(".nav-middle");
        middle.classList.toggle("open-nav-middle");
    }
   
}

function OpenSideWin()
{
    sidebar = document.getElementById("sidebar1");
    sidebar.classList.toggle("siderbardisplay");
    sidebar = document.querySelector("#showfile");
    if(sidebar.innerHTML == "显示文件列表")
        sidebar.innerHTML = "隐藏文件列表";
    else
        sidebar.innerHTML = "显示文件列表";
}
function ArrayQueue(){  
    var arr = [];  
        //入队操作  
    this.push = function(element){  
        arr.push(element);  
        return true;  
    }  
        //出队操作  
    this.pop = function(){  
        return arr.shift();  
    }  
        //获取队首  
    this.getFront = function(){  
        return arr[0];  
    }  
        //获取队尾  
    this.getRear = function(){  
        return arr[arr.length - 1]  
    }  
        //清空队列  
    this.clear = function(){  
        arr = [];  
    }  
        //获取队长  
    this.size = function(){  
        return length;  
    }  
}
var getJsonArray = new ArrayQueue();
 /**
     * [Queue]
     * @param {[Int]} size [队列大小]
     */

async function getJson(name)
{
    let promise = new Promise((resolve,reject)=>{ 
        ws = new WebSocket("ws://127.0.0.1:50006");
            // ws.onmessage = function (evt) {
            //     // im.src = "data:image/png;base64," + evt.data;
            //     alert(String(evt.data).length);
            // }
            
            // ws.onopen=function(){
            //     ws.send('0');
            // }
        // }
        //心跳检测  .所谓的心跳检测，就是隔一段时间向服务器仅限一次数据访问，因为长时间不使用会导致ws自动断开，
        // 一般是间隔90秒内无操作会自动断开，因此，在间隔时间内进行一次数据访问，以防止ws断开即可，
        //这里选择30秒，倒计时30秒内无操作则进行一次访问，有操作则重置计时器
        //
        //封装为键值对的形式，成为js对象，与json很相似
        var heartCheck = {
        timeout: 30000,//30秒
        timeoutObj: null,
        reset: function () {//接收成功一次推送，就将心跳检测的倒计时重置为30秒
            clearTimeout(this.timeoutObj);//重置倒计时
            this.start();
        },
        start: function () {//启动心跳检测机制，设置倒计时30秒一次
            this.timeoutObj = setTimeout(function () {
            var message = '-1';
            ws.send(message);//启动心跳
            }, this.timeout)
        }
        //onopen连接上，就开始start及时，如果在定时时间范围内，onmessage获取到了服务端消息，
        // 就重置reset倒计时，距离上次从后端获取消息30秒后，执行心跳检测，看是不是断了。
        };
        // ---- ...
        // socket
        ws.onopen = function () {
            //当WebSocket创建成功时，触发onopen事件
            ws.send(name); //将消息发送到服务端
            heartCheck.start();//连接成功之后启动心跳检测机制
        }
        ws.onmessage = function (e) {
        //当客户端收到服务端发来的消息时，触发onmessage事件，参数e.data包含server传递过来的数据
        var data = JSON.parse(e.data);
        heartCheck.reset();
            
        //接收一次后台推送的消息，即进行一次心跳检测重置
        resolve(data)
        }
    });
    // getJsonArray.push(promise)
    let result = await promise;
    return result;
} 
window.addEventListener('resize', () => { //监听浏览器窗口大小改变
    watchChangeSize()
});

function watchChangeSize (){
    var sider = document.getElementById("sidebar1");
    var vid = document.getElementById('player')
    if (sider.offsetHeight!=vid.offsetHeight&&window.innerWidth>900)
    {
        var h = String(parseInt(vid.offsetHeight)-30)+"px";
        sider.offsetHeight = h;
        sider.style.minHeight = h;
        sider.style.maxHeight = h;
    }
    else
    {
        sider.style.minHeight = '500px'
        sider.style.maxHeight = '500px'
    }
}
// ----------------搜索索引-------------------
$(function(){
    $.getJSON('json/index.json',function(data){
    var $jsontip = $("#myUL");
    var strHtml = "";//存储数据的变量
    $jsontip.empty();//清空内容
    $.each(data,function(infoIndex,info){
        if(info['name'] != '已经删除')
            strHtml +=
            '<li><a href="'+ "play-video.html?v="+info["linkid"] +'">'+info["folderName"]+'</a></li>'
    })
    $jsontip.html(strHtml);//显示处理后的数据
    
    })
    
    })
