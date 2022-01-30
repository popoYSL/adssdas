var v = UrlParam.paramValues("v");
var fristLinkId = ''
// getJson(v).then(value => console.log(value[0])) 
var callbacks = $.Callbacks()    
//<p>如有问题，请联系删除</p>
//<a href="https://www.huya.com/wanzi" style="color: #33a6f1;">https://www.huya.com/wanzi</a>
$(function(){ 
    
    $.getJSON('json/'+v+'.json',function(data){
    var element = document.getElementById('video')
    element.src=data[0]['link'];
    element.addEventListener('ended', _bindEventHandler)
    
    //添加回调
    callbacks.add(function(i)
    {
        if(i<data.length)
        {
            var playingVideo = " • 正在播放："+data[i]['name'].replaceAll("'",() =>" ");
            var createTime = " • 发布时间："+data[i]["created_at"];
            OpenVideo(data[i]['link'] , data[i]['linkid'] , playingVideo ,createTime)
        }
    }) 
   
    var $tagstip = $(".tags");
    var tagsHtml = "";//存储数据的变量
    $tagstip.empty();//清空内容
    var tags = data[0]['tags']
    var lens = tags.length
    for(var i=0;i<lens;i++)
    {
        tagsHtml += "<a href='#' onclick={OpenWinByfilter(this)}>"+tags[i]+"</a>"
    }
    $tagstip.html(tagsHtml);

    var $desctip = $(".vid-description");
    var descHtml = "";//存储数据的变量
    $desctip.empty();//清空内容
    var desc = data[0]['desc']
    var lens = desc.length
    for(var i=0;i<lens;i++)
    {
        descHtml += "<p>"+desc[i]+"</p>"
    }
    $desctip.html(descHtml);

    document.title = data[0]['folderName'];
    document.getElementById('vid-title').innerText=data[0]['folderName'];
    document.getElementById('playingVideo').innerText="• 正在播放："+data[0]['name'];
    document.getElementById('createTime').innerText = "• 发布时间："+data[0]["created_at"];
    document.getElementById('avatar-img').src = data[0]['avatar-img']
    document.getElementById('subscribe').innerText = data[0]['subscribe']
    document.getElementById('achornameChannnel').innerHTML = data[0]["achorname"]
    fristLinkId = data[0]['linkid']
    if(data.length==1)
    {
        OpenSideWin()
    }
    {
        var $jsontip = $("#sidebar1");
        var strHtml = "";//存储数据的变量
        $jsontip.empty();//清空内容
        $.each(data,function(infoIndex,info){
            if(info['folderName'] != '已经删除')
            {
                var playingVideo = " • 正在播放："+info['name'].replaceAll("'",() =>" ");
                var createTime = " • 发布时间："+info["created_at"];
                bgcolor = "<div class='side-video-list side-choose-video-list' onclick='OpenVideo(\""+ info['link'] +"\",\"" + info['linkid'] +"\",\"" + playingVideo +"\",\"" +createTime+ "\")' id='"+info['linkid']+"'>"
                +"<p class='right-box-fileindex'>"+String(infoIndex+1)+"</p>"
                strHtml +=
                bgcolor
                +"<input type='image' img src='"+ info["thumbUrl"] +"' class='box-small-thumbnail'>"
                // +"<a href='" + "play-video.html?v="+info["linkid"]+"'class='small-thumbnail'><img src='"+ info["thumbUrl"] +"'></a>"
                +"<div class='box-vid-info'>"
                    +"<a href='#'>"+info["name"]+"</a>"
                    // +"<input type='text' value="+info["name"]+" onclick={OpenVideo('"+info['linkid']+"')} >"
                    +"<p>"+info["achorname"]+"</p>"
                    +"<p>发布时间："+info["created_at"]+"</p>"
                +"</div>"
                +"</div>";  
            }
            // play-video.html?a=jrKeWMlm2wCz1Vl
            //"<a href='" + info["url"] + "' target='_blank'><img src='" + info["img"] + "' /></a>";
        })
        $jsontip.html(strHtml);//显示处理后的数据
    }
        OpenVideo(data[0]['link'],v,'','')
    })
})
$(function(){
    
$.getJSON('json/index.json',function(data){

var $jsontip = $("#sidebar2");

var strHtml = "";//存储数据的变量

$jsontip.empty();//清空内容
$.each(data,function(infoIndex,info){
    if(info['folderName'] != '已经删除' && fristLinkId != info['linkid'])
        strHtml +=
            "<div class='side-video-list'>"
        // +"<input type='image' img src='"+ info["thumbUrl"] +"' class='small-thumbnail'>"
        +"<a href='" + "play-video.html?v="+info["linkid"]+"'class='small-thumbnail'><img src='"+ info["thumbUrl"] +"'></a>"

        +"<div class='vid-info'>"
            +"<a href='"+ "play-video.html?v="+info["linkid"]+"'>"+info["folderName"]+"</a>"
            // +"<input type='text' value="+info["name"]+" onclick={OpenVideo('"+info['linkid']+"')} >"
            +"<p>"+info["achorname"]+"</p>"
            +"<p>发布时间："+info["created_at"]+"</p>"
        +"</div>"
        +"</div>";
    // play-video.html?a=jrKeWMlm2wCz1Vl
    //"<a href='" + info["url"] + "' target='_blank'><img src='" + info["img"] + "' /></a>";
})

$jsontip.html(strHtml);//显示处理后的数据



})
})
