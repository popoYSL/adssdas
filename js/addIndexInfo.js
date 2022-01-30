$(function(){
        
    $.getJSON('json/index.json',function(data){
    var $jsontip = $("#vidlist");
    
    var strHtml = "";//存储数据的变量
    
    $jsontip.empty();//清空内容
    $.each(data,function(infoIndex,info){
        if(info['folderName'] != '已经删除')
            strHtml +=
            "<div class='vid-list'>"
                +"<a href='play-video.html?v="+info['linkid']+"'><img src='"+info['thumbUrl']+"' class='thumbnail'></a>"
                +"<div class='flex-div'>"
                    +"<img src="+info['avatar-img']+">"
                    +"<div class='vid-info'>"
                        +"<a href='play-video.html?v="+info['linkid']+"'>"+info['folderName']+"</a>"
                        +"<p>"+info["achorname"]+"</p>"
                        +"<p>"+info["created_at"]+"</p>"
                        +"</div>"
                        +"</div>"
                        +"</div>"
        // play-video.html?a=jrKeWMlm2wCz1Vl
        //"<a href='" + info["url"] + "' target='_blank'><img src='" + info["img"] + "' /></a>";
    })
    
    $jsontip.html(strHtml);//显示处理后的数据
    
    })
    
    })