var b = String(UrlParam.paramValues("b"));
new Valine({
    // AV 对象来自上面引入av-min.js(老司机们不要开车➳♡゛扎心了老铁)
    av: AV, 
    el: '.comment',
    app_id: 'Sh9WJSSlJ7GDl7UiMqTw0cjl-MdYXbMMI',
    app_key: 'IV9kwKDy7QR310zoOv8O7HAe',
    placeholder: '发表公开评论…',
    serverURLs: 'https://sh9wjssl.api.lncldglobal.com',
    master: 'fa760d96c17bd34f310dcef9cc060722',
    path:b,
    meta:['nick','mail']
});
//可以与 valine 的配置 js 文件放一起，或放置到公共 js 文件中
$("#veditor").focus(function(){$(this).css("background-image","none");});
$("#veditor").blur(function(){
    $(this).css("background-image","url(https://cdn.jsdelivr.net/gh/drew233/cdn/20200409110727.webp)");
});