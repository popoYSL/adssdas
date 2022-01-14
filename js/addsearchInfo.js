var filter = UrlParam.paramValues("s");
        $(function(){
        
        $.getJSON('json/index.json',function(data){
        
        var $jsontip = $("#vidlist");
        
        var strHtml = "";//存储数据的变量
        
        $jsontip.empty();//清空内容
        $.each(data,function(infoIndex,info){
            if(info['folderName'].toUpperCase().indexOf(filter) > -1 && filter!='')
            {
                strHtml +=
                "<div class='vid-list'>"
            +"<a href='play-video.html?a="+info['linkid']+"&b="+info["firstLinkId"]+"'><img src='"+info['thumbUrl']+"' class='thumbnail'></a>"
            +"<div class='flex-div'>"
                +"<img src="+info['avatar-img']+">"
                +"<div class='vid-info'>"
                    +"<a href='play-video.html?a="+info['linkid']+"'>"+info['folderName']+"</a>"
                    +"<p>"+info["achorname"]+"</p>"
                    +"<p>"+info["created_at"]+"</p>"
                    +"</div>"
                    +"</div>"
                    +"</div>"
            }
            
            // play-video.html?a=jrKeWMlm2wCz1Vl
            //"<a href='" + info["url"] + "' target='_blank'><img src='" + info["img"] + "' /></a>";
        })
        if(strHtml == '')
        {
            strHtml += '<h1>找不到内容</h1>'
        }
        $jsontip.html(strHtml);//显示处理后的数据
        
        })
        
        })