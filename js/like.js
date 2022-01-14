var canvas1 = Raphael('canvas1', 22, 22);
var canvas2 = Raphael('canvas2', 22, 22);
var YesNormal = "M3,11h3v10H3V11z M18.77,11h-4.23l1.52-4.94C16.38,5.03,15.54,4,14.38,4c-0.58,0-1.14,0.24-1.52,0.65L7,11v10h10.43 c1.06,0,1.98-0.67,2.19-1.61l1.34-6C21.23,12.15,20.18,11,18.77,11z"
var NoNormal = "M18,4h3v10h-3V4z M5.23,14h4.23l-1.52,4.94C7.62,19.97,8.46,21,9.62,21c0.58,0,1.14-0.24,1.52-0.65L17,14V4H6.57 C5.5,4,4.59,4.67,4.38,5.61l-1.34,6C2.77,12.85,3.82,14,5.23,14z";
var path1 = canvas1.path(YesNormal);
var path2 = canvas2.path(NoNormal);
path1.attr({
    'pointer-events': 'none',
});
path2.attr({
    'pointer-events': 'none',
});
var flag1 = true;
var flag2 = true;
function togglePath1(){
    if(flag1 == true)
    {
        path1.attr({
            "fill": "black",
        });
        path2.attr({
            "fill": "none",
        });
        flag1 = false;
        flag2 = true;
    }
    else
    {
        path1.attr({
            "fill": "none",
        });
        flag1 = true;
    }
}
function togglePath2(){
    if(flag2 == true)
    {
        path2.attr({
            "fill": "black",
        });
        path1.attr({
            "fill": "none",
        });
        flag2 = false;
        flag1 = true
    }
    else
    {
        path2.attr({
            "fill": "none",
        });
        flag2 = true;
    }
}