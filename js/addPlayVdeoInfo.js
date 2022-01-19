var a = UrlParam.paramValues("a");
var b = UrlParam.paramValues("b");

document.getElementById('video').src = 'https://cdn.jsdelivr.net/gh/popoYSL/adssdas/v/'+a+'/index.m3u8?123456.key'
$(function(){
$.getJSON('json/'+b+".json",function(data){
document.title = data[0]['folderName'];
document.getElementById('vid-createTimetitle').innerText=data[0]['folderName'];
document.getElementById('').innerText="发布时间："+data[0]["created_at"];
document.getElementById('avatar-img').src = data[0]['avatar-img']
document.getElementById('subscribe').innerText = data[0]['subscribe']
document.getElementById('achornameChannnel').innerHTML = data[0]["achorname"]
var $jsontip = $("#sidebar");
var strHtml = "";//存储数据的变量

$jsontip.empty();//清空内容
$.each(data,function(infoIndex,info){
    strHtml +=
    "<div class='side-video-list'>"
    +"<a href='" + "play-video.html?a="+info["linkid"] +"&b="+info["firstLinkId"]+"'class='small-thumbnail'><img src='"+ info["thumbUrl"] +"'></a>"
    +"<div class='vid-info'>"
        +"<a href=''>"+info["name"]+"</a>"
        +"<p>"+info["achorname"]+"</p>"
        +"<p>发布时间："+info["created_at"]+"</p>"
    +"</div>"
    +"</div>";
    // play-video.html?a=jrKeWMlm2wCz1Vl
    //"<a href='" + info["url"] + "' target='_blank'><img src='" + info["img"] + "' /></a>";
})
$jsontip.html(strHtml);//显示处理后的数据

// const dp = new DPlayer({
//     container: document.getElementById('video'),
//     video: {
//         url: 'https://cdn.jsdelivr.net/gh/popoYSL/adssdas/v/'+a+'/index.m3u8',
//         thumbnails: 'https://cdn.jsdelivr.net/gh/popoYSL/adssdas/v/'+a+'/thumb.png',
//         pic: 'https://cdn.jsdelivr.net/gh/popoYSL/adssdas/v/'+a+'/thumb.png',
//         type: 'hls',
//     },
//     });

})

})