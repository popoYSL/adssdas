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
function OpenWinByfilter()
{
    filter = document.getElementById('achornameChannnel').innerHTML
    goUrl = "search.html?s="+filter
    window.open(goUrl,'_self');
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
// ----------------搜索索引-------------------
$(function(){
    $.getJSON('json/index.json',function(data){
    var $jsontip = $("#myUL");
    var strHtml = "";//存储数据的变量
    $jsontip.empty();//清空内容
    $.each(data,function(infoIndex,info){
        strHtml +=
        '<li><a href="'+ "play-video.html?a="+info["linkid"] +"&b="+info["firstLinkId"]+'">'+info["folderName"]+'</a></li>'
    })
    $jsontip.html(strHtml);//显示处理后的数据
    
    })
    
    })