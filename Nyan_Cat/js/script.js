// внутренние переменные
var canvas, ctx;
var backgroundImage;
var startMenu;
var iBgShiftX = 0;// смещение фона
var cat;
var finalBoss;
var catDW;
var catDH;
var boneBoss = new Array();
var bubbleBoss = new Array();
var scaleX = 1;
var scaleY = 1;
var bossDW;
var bossDH;
var st;
var cat_block = 0;
var temp=0;
var center;
var rand;
var b =true;
var withBubble = false;
var speed;
var points = 0;
var stars = new Array();
var bones = new Array();
var star;
var bone;
var starX = 600;
var starY;
var bossW = 170; // ширина кота
var bossH = 116; // высота кота
var catW = 170; // ширина кота
var catH = 80; // высота кота
var iSprPosition = 0; // инициализация спрайтов
var bMouseDown = false; // состояние мыши
var iLastMouseX = 0;
var iLastMouseY = 0;
var cOFF, offset;
var size = false;
var scale = 1;
var interval;
var menuInt;
var paused = true;
var menuStr = 1;
var getStar;
var getBone;
var NyanPlay;
var overMus;
var victoryMus;
var levelNum = 1;
var Xcoeff, Ycoeff;
var starW = 51;
var starH =51;
var boneW = 60;
var boneH =34;
var bubbleScale = false;
var newGame = false;
var catImage = new Image();
var starImage = new Image();
var boneImage = new Image();
var bossImg = new Image();
var bubbleImage = new Image();
var angryCatImage = new Image();
// -------------------------------------------------------------
function getRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// объекты :

function collision(obj1,obj2){
    var XCollFront=false;
    var XCollBack=false;
    var YCollTop=false;
    var YCollBottom=false;
    var XColl = false;
    var YColl = false;
    var YIntersect = false;
    var XIntersect = false;

    var catX = obj1.x+obj1.w;
    var catY = obj1.y + obj1.h;
    var gameObjX = obj2.x + obj2.w;
    var gameObjY = obj2.y + obj2.h;

    XCollFront = obj2.x <= catX && obj2.x >= obj1.x;
    XCollBack = gameObjX >= obj1.x && gameObjX <= catX;

    YCollBottom = obj2.y <= catY && obj2.y >= obj1.y;
    YCollTop = gameObjY >= obj1.y && gameObjY <= catY;

    YIntersect = obj1.y >= obj2.y && catY <= gameObjY;
    XIntersect = obj1.x >= obj2.x && catX <= gameObjX;

    XColl = XCollFront || XCollBack || XIntersect;
    YColl = YCollBottom || YCollTop || YIntersect;

    return XColl && YColl;

}
function player (x,y,w,h,image)
{
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.image = image;
}

function gameObject(speed)
{
    this.speed = speed;
}
gameObject.prototype = player;
// -------------------------------------------------------------

// функции отрисовки :
function clear() { // функция очистки canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
function menu(){
    if (paused == true)
    {
        $('#shell').css("display","none");
        if (interval!=null)
            clearTimeout(interval);
        clear();
        //ctx.drawImage(startMenu, 0, 0, ctx.canvas.width, ctx.canvas.height, 0,0,ctx.canvas.width,ctx.canvas.height);
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.font = '3em calibri';
        switch (menuStr)
        {
            case 5:
                victoryMus.play();
                $("#shell").css("z-index","0");
                $("#btnPause").css("visibility","hidden");
                $("#scene").css(
                    {
                        visibility:'hidden',
                        zIndex: 1
                    }
                ) ;
                $('#wrapper').css(
                    {
                        zIndex:999
                    }
                );
                $("#pointsCount").text(points);
                $("#gameEnd").css("display","block");
                $("#win").text("Ну ты красава, ваще!!!");
                $("#win").css("font-size","300%");
                $('#wrapper').fadeIn("slow");
                $("#results").css("display","block");
                $('#menu').css('display','none');
                break;
            case -1:
                overMus.play();
                $("#btnPause").css("visibility","hidden");
                $("#scene").css(
                    {
                        visibility:'hidden',
                        zIndex: 1
                    }
                ) ;
                $('#wrapper').css(
                    {
                        zIndex:999
                    }
                );
                $("#pointsCount").text(points);
                $('#wrapper').fadeIn("slow");
                $("#results").css("display","block");
                $('#menu').css('display','none');

                break;
            case 1:
                // $('#wrapper').css("visibility","visible");
                // $('#menu').css("visibility",'visible');
                $('#wrapper').fadeIn("slow");
                $('#menu').css("display",'block');
                $('#start').text('Новая игра');
                $('#rec').css('visibility','visible');
                $('#quit').css("display","none");
                break;
            case 2:
                $('#wrapper').css(
                    {
                        zIndex:999
                    }
                );
                $('#wrapper').fadeIn("slow");
                $('#menu').css('display','block');
                $('#start').text('Продолжить');
                $('#start').css('visibility','visible');
                $('#quit').css('visibility','visible');
                $('#quit').css('display','inline-block');
                $('#rec').css('visibility','hidden');
                break;
            case 3:
                $("#tblRec").fadeIn('slow');
                var tbl = $("#recTable");
                var data = getFromDB();
                var temp = "<table id=\"recTable\" class=\"tableRec\"> <tr><td>Имя</td><td>Очки</td></tr>";
                for(var i = 0;i<data.length;i++)
                {
                    temp+="<tr><td>"+data[i].split(',')[1]+"</td><td>"+data[i].split(',')[0]+"</td></tr>";
                }
                tbl[0].innerHTML =temp+"</table>";
                break;
            case 4:
                $("#win").text("");
                $("#results").css("z-index",'0');
                $("#results").fadeOut('slow');
                $("#menu").fadeIn("slow");
                $('#start').text('Новая игра');
                $('#start').css('display','inline-block');
                $('#start').css('visibility','visible');
                $('#rec').css('visibility','visible');
                $('#quit').css('visibility','hidden');
                $('#quit').css('display','none');
                menuStr = -1;
                break;
        }
        ctx.fill();
        ctx.closePath();
    }
    else return;
}



function getFromDB()
{
    var recs = [];
    for(var i = 0;;i++)
    {
        if (localStorage[i.toString()]!=undefined)
        {
            recs.push(localStorage[i.toString()]);
        }
        else
        {
            break;
        }
    }
    if (recs.length>0)
    {
        var newArr = [];
        var namePoints;
        for(var j = 0;j<recs.length;j++)
        {
            namePoints = JSON.parse(recs[j]);
            namePoints = namePoints.Record+","+namePoints.Name;
            newArr.push(namePoints);
        }
        newArr = newArr.reverse();
        return newArr;
    }
    else
    {
        return "";
    }
}

//Надавай наглой шавке по морде
function boss()
{
    iSprPosition++;
    if (iSprPosition >= 11) {
        iSprPosition = 0;
    }
    ctx.drawImage(backgroundImage, iBgShiftX, 0, 1500, 1000, 0,0,ctx.canvas.width,ctx.canvas.height);
    if (finalBoss.x>canvas.width-finalBoss.w)
    {
        finalBoss.x-=2;
    }
    else
    {
        if (b)
        {
            if(finalBoss.y>=rand&&rand<=center)
            {
                finalBoss.y-=3;
            }
            else
            {
                rand = getRandomInt(center, canvas.height - finalBoss.h);
                b=false;
            }
        }
        else
        {
            if(finalBoss.y<=rand&&rand>=center)
            {
                finalBoss.y+=3;
            }
            else
            {
                rand = getRandomInt(0, center);
                b=true;
            }
        }
        if(getRandomInt(0,100)>98)
        {
            var boneBos = new gameObject(getRandomInt(3,7));
            boneBos.x = finalBoss.x-170;
            boneBos.y = finalBoss.y;
            boneBos.w = 60*Xcoeff;
            boneBos.h = 34*Ycoeff;
            boneBos.b = false;
            boneBos.image = boneImage;

            boneBoss.push(boneBos);
        }
        var th = getRandomInt(0,1000);
        if(th>90&&th<94)
        {
            var bubbleBos = new gameObject(getRandomInt(2,5));
            bubbleBos.x = finalBoss.x-60;
            bubbleBos.y = finalBoss.y;
            bubbleBos.w = 51*Xcoeff;
            bubbleBos.h = 41*Ycoeff;
            bubbleBos.image = bubbleImage;

            bubbleBoss.push(bubbleBos);
        }
    }
    if (boneBoss!= null)
        for(var i=0;i<boneBoss.length;i++)
        {
            if(boneBoss[i].x>canvas.width*3||boneBoss[i].x<0)
            {
                boneBoss.splice(i,1);
            }
            else
            if(collision(finalBoss, boneBoss[i]))
            {
                scaleX-=0.08;
                scaleY-=0.08;
                points+=40;
                finalBoss.w=bossW*scaleX;
                finalBoss.h=bossH*scaleY;
                boneBoss.splice(i,1);
            }
            else
            if(boneBoss[i].b)
            {
                ctx.drawImage(boneBoss[i].image, 0, 0, 60, 34,
                    boneBoss[i].x+=boneBoss[i].speed, boneBoss[i].y, boneBoss[i].w, boneBoss[i].h);
            }

            else
            if(collision(cat,boneBoss[i])){
                getBone.play();
                if(!withBubble)
                {
                    if (scale>0.4)
                    {
                        points-=55;
                        scale-=0.2;
                        size = true;
                        boneBoss.splice(i,1);
                    }
                }
                else
                {
                    cat_block--;
                    size = false;
                    boneBoss[i].b = true;
                    for (var j=0;j<cat.h;j+=cat.h/7)
                    {
                        collis(cat.x,j, boneBoss[i].x, boneBoss[i].y);
                    }
                }
            }
            else
            {
                ctx.drawImage(boneBoss[i].image, 0, 0, 60, 34,
                    boneBoss[i].x-=boneBoss[i].speed, boneBoss[i].y, boneBoss[i].w, boneBoss[i].h);
            }
        }
    if(bubbleBoss!=null)
        for(var i=0;i<bubbleBoss.length;i++)
        {
            if(bubbleBoss[i].x>canvas.width*3||bubbleBoss[i].x<0)
            {
                bubbleBoss.splice(i,1);
            }
            else
            if(collision(cat,bubbleBoss[i])){
                getBone.play();
                bubbleBoss.splice(i,1);
                cat_block+=2;
                if (scale<1 && bubbleScale===false)
                {
                    scale+=0.1;
                    size = true;
                    bubbleScale = true;
                }
                withBubble = true;
            }
            else
                ctx.drawImage(bubbleBoss[i].image, 0, 0, 51,41,
                    bubbleBoss[i].x-=bubbleBoss[i].speed, bubbleBoss[i].y, bubbleBoss[i].w, bubbleBoss[i].h);
        }
    if (cat_block==0)
    {
        withBubble = false;
        bubbleScale = false;
    }

    ctx.drawImage(finalBoss.image, 0, 0, 170, 116, finalBoss.x, finalBoss.y, finalBoss.w, finalBoss.h);
    finalBoss = new player(finalBoss.x,finalBoss.y, finalBoss.w, finalBoss.h,finalBoss.image);
    $('#shell').css("display","block");
    $('#shellA').text("Количество отбиваний "+cat_block);
}

function moveObj(levelSpeed)
{
    points-=1;
    iBgShiftX += 10*levelSpeed;
    if (iBgShiftX >= 2495) {
        iBgShiftX = 0;
    }

    ctx.drawImage(backgroundImage, iBgShiftX, 0, 1500, 1000, 0,0,ctx.canvas.width,ctx.canvas.height);
    // обновление позиций спрайтов
    iSprPosition++;
    if (iSprPosition >= 11) {
        iSprPosition = 0;
    }
    var currSpr = iSprPosition;

    //Измененное движение костей
    if (bones!= null)
        for(var i=0;i<bones.length;i++)
        {
            if(collision(cat,bones[i])){
                getBone.play();
                points-=88;
                if (scale>0.4)
                {
                    scale-=0.2;
                    size = true;
                }
                bones.splice(i,1);
            }
            else
                ctx.drawImage(bones[i].image, 0, 0, 60, 34,
                    bones[i].x-=bones[i].speed*levelSpeed, bones[i].y, bones[i].w, bones[i].h);
        }
    //Измененное движение звезд
    if(stars!=null)
        for(var i=0;i<stars.length;i++)
        {
            if(collision(cat,stars[i]))
            {
                getStar.play();
                points+=80;
                if (scale<1)
                {
                    scale+=0.1;
                    size = true;
                }
                if(scale>1) scale=1;
                stars.splice(i,1);
            }
            else
                ctx.drawImage(stars[i].image, 0, 0, 51, 51,
                    stars[i].x-=stars[i].speed*levelSpeed, stars[i].y, stars[i].w, stars[i].h);

        }
}

function collis(c1, c2, o1, o2)
{
    var XCollFront=false;
    var XCollBack=false;
    var YCollTop=false;
    var YCollBottom=false;
    var XColl = false;
    var YColl = false;
    var YIntersect = false;
    var XIntersect = false;

    var catX = c1 + 60;
    var catY = c2 + cat.w/7;
    var gameObjX = o1 + 60;
    var gameObjY = o2 + 34;

    XCollFront = o1 <= catX && o1 >= c1;
    XCollBack = gameObjX >= c1 && gameObjX <= catX;

    YCollBottom = o2 <= catY && o2 >= c2;
    YCollTop = gameObjY >= c2 && gameObjY <= catY;

    YIntersect = c2 >= c2 && catY <= gameObjY;
    XIntersect = o1 >= o1 && catX <= gameObjX;

    XColl = XCollFront || XCollBack || XIntersect;
    YColl = YCollBottom || YCollTop || YIntersect;

    return XColl && YColl;
}


function drawScene() { // главная функция отрисовки
    if (NyanPlay.ended)
    {
        NyanPlay.currentTime = 3.97;
        NyanPlay.play();
    }
    clear(); // очистить canvas
    // перемещение кота к месту нажатия мыши
    if (bMouseDown) {
        if (iLastMouseX > cat.x+cat.w) {
            cat.x += 8;
            if (cat.x>(ctx.canvas.width-offset.left)/2)
            {
                cat.x=((ctx.canvas.width-offset.left)/2)-1;
            }
        }
        if (iLastMouseY > cat.y+cat.h) {
            cat.y += 8;
        }
        if (iLastMouseX < cat.x) {
            cat.x -= 8;
        }
        if (iLastMouseY < cat.y) {
            cat.y -= 8;
        }
    }
    if (points>2700)
    {
        if (levelNum!="boss")
        {
            levelNum = 2;
        }
    }
    if (points>3500)
    {
        levelNum = "boss";
    }
    switch (levelNum)
    {
        case 1:
            moveObj(1);
            break;
        case 2:
            moveObj(3);
            break;
        case "boss":
            boss();
            break;
    }
    if (points<=0||scale<0.4)
    {
        clearTimeout(interval);
        menuStr = -1;
        paused = true;
        overMus.volume = 0.8;
        NyanPlay.pause();
        menu();
        return;
    }
    if(scaleX<0.4)
    {
        clearTimeout(interval);
        menuStr = 5;
        paused = true;
        victoryMus.volume = 0.8;
        NyanPlay.pause();
        menu();
        return;
    }

    //Измененная генерация костей
    if(getRandomInt(0,110)>106)
    {
        speed = getRandomInt(5,8)
        var bone = new gameObject(speed);
        bone.x = getRandomInt(canvas.width, canvas.width*2);
        bone.y = getRandomInt(0, canvas.height - 34*Ycoeff);
        bone.w = 60*Xcoeff;
        bone.h = 34*Ycoeff;
        bone.image = boneImage;
        bones.push(bone);
    }
    //Измененная генерация звезд
    if(getRandomInt(0,105)>102)
    {
        speed = getRandomInt(4,6)
        var star = new gameObject(speed);
        star.x = getRandomInt(canvas.width, canvas.width*2);
        star.y = getRandomInt(0, canvas.height - 51*Xcoeff);
        star.w = 51*Xcoeff;
        star.h = 51*Xcoeff;
        star.image = starImage;
        stars.push(star);
    }
    // отрисовка кота
    if (size)
    {
        if(!withBubble)
        {
            ctx.drawImage(catImage, iSprPosition*170, 0, 170, 80, cat.x, cat.y, catDW*scale, catDH*scale);
            cat = new player(cat.x,cat.y,catDW*scale,catDH*scale,catImage);
        }
        else
        {
            ctx.drawImage(angryCatImage, iSprPosition*170, 0, 170, 80, cat.x, cat.y, catDW*scale, catDH*scale);
            cat = new player(cat.x,cat.y,catDW*scale,catDH*scale,angryCatImage);
        }
    }
    else
    {
        if(!withBubble)
        {
            ctx.drawImage(catImage, iSprPosition*170, 0, 170, 80, cat.x, cat.y, cat.w, cat.h);
            cat = new player(cat.x,cat.y,cat.w, cat.h,catImage);
        }
        else
        {
            ctx.drawImage(angryCatImage, iSprPosition*170, 0, 170, 80, cat.x, cat.y, cat.w, cat.h);
            cat = new player(cat.x,cat.y,cat.w, cat.h,angryCatImage);
        }
    }

    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.font = "bold 2em calibri";
    ctx.fillText(points.toString().split('.')[0],ctx.canvas.width/40,ctx.canvas.height/20)
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.font = "bold 2em calibri";
    ctx.fillText("Level "+levelNum,ctx.canvas.width/40,ctx.canvas.height-(ctx.canvas.height/25))
    ctx.fill();
    ctx.closePath();
    interval = setTimeout(drawScene,30);
}

function getLastID()
{
    var recs = [];
    for(var i = 0;;i++)
    {
        if (localStorage[i.toString()]!=undefined)
        {
            recs.push(localStorage[i.toString()]);
        }
        else
        {
            break;
        }
    }
    if (recs.length>0)
    {
        recs = recs.reverse();
        var id = JSON.parse(recs[0])
        id  = parseInt(id.Uid);
        return id;
    }
    else
    {
        return false;
    }
}

// -------------------------------------------------------------
// инициализация
$(document).ready(function init(){

    $('#shell').css("display","none");
    getStar = document.getElementById("getstar");
    getBone =  document.getElementById("getbone");
    overMus = document.getElementById("over");
     victoryMus = document.getElementById("victory");
    menuStr = 1;
    paused = true;
    points = 2001;
    canvas = document.getElementById('scene');
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    //canvas.width = 800;
  //  canvas.height = 480;
//    $("body").css({
//        width: canvas.width+"px",
//        height: canvas.height+"px",
//        position: 'absolute'
//    });
    $("#all").css({
        width: canvas.width+"px",
        height: canvas.height+"px"
    });
    $("#wrapper").css({
        width: canvas.width+"px",
        height: canvas.height+"px"
    });

    Xcoeff = canvas.width/800;
    Ycoeff = canvas.height/480;
    bossW = bossW*Xcoeff;
    bossH = bossH*Ycoeff;
    catW = catW*Xcoeff;
    catH = catH*Ycoeff;
    ctx = canvas.getContext('2d');
    cOFF = $(canvas);
    offset = cOFF.offset();
    NyanPlay = document.getElementById("backMusic");
    $("#imgSize").width(64*Xcoeff);
    $("#imgSize").height(64*Xcoeff);
    $("#btnPause").css(
        {
            position:'absolute',
            width: 64*Xcoeff,
            height: 64*Xcoeff,
            marginTop:5+"%",
            //   left:canvas.width-canvas.width/10+'px',
            marginLeft:90+"%",
            visibility:'hidden',
            zIndex:1500
        }
    );
    startMenu = new Image();
    center = canvas.height/2;
    rand = getRandomInt(0,center);
    backgroundImage = new Image();
    backgroundImage.src = 'images/space.png';

    bossImg.src = 'images/mad_dog.png';
    boneImage.src = 'images/bone.png';
    starImage.src = 'images/points_stars.png';
    catImage.src = 'images/nyan_cat.png';
    bubbleImage.src = 'images/bubble.png';
    angryCatImage.src = 'images/nyan_cat_with_bubble.png';

    cat = new player(0, ctx.canvas.height/2-catH/2, catW, catH, catImage);
    finalBoss = new player(canvas.width+bossW, canvas.height/2-bossH/2,bossW,bossH,bossImg);
    catDW = catW;
    catDH = catH;



    ////-------------------------------------УПРАВЛЕНИЕ--------------------------////

    $('#scene').bind('touchstart',function(event)
    {
        var touchX = event.touches[0].pageX || 0;
        var touchY = event.touches[0].pageY || 0;
        if(event.originalEvent.layerX) {
            touchX =  event.pageX-offset.left;
            touchY = event.pageY-offset.top;
        }
        bMouseDown = true;
        if ((touchX > cat.x+cat.w && touchX < ctx.canvas.width) || (touchX<cat.x && touchX > 0) )
        {
            iLastMouseX = touchX;
        }
        if ((touchY > cat.y+cat.h && touchY < ctx.canvas.height) || (touchY<cat.y && touchY > 0))
        {
            iLastMouseY = touchY;
        }
        event.preventDefault();
    });

    $('#scene').bind('touchend',function(event)
    {
        cat.bCat = false;
        bMouseDown = false;
        event.preventDefault();
    });

///////////////ПАУЗА////////////////
    $('#btnPause').bind('tap',function(e)
    {

        $('#shell').css("display","none");
        $('#btnPause').css('visibility','hidden');
        paused = true;
        menuStr = 2;
        menu();
        e.preventDefault();
    });
/////////////////Рекорды////////////////
    $('#rec').bind('tap',function(e)
    {
        //e.preventDefault();
        $('#btnPause').css('visibility','hidden');
        $('#menu').fadeOut('slow');
        menuStr = 3;
        menu();
        e.preventDefault();
    });

    $('#back').bind('tap',function(e)
    {
       // e.preventDefault();
        $('#btnPause').css('visibility','hidden');
        $("#tblRec").fadeOut('slow');
        $('#menu').fadeIn('slow');
        menuStr = 4;
        menu();
        e.preventDefault();
    });
//////Выход//////
    $('#quit').bind('tap',function(e)
    {
       // e.preventDefault();
        $('#btnPause').css('visibility','hidden');
        $('#menu').fadeIn('slow');
        NyanPlay.pause();
        NyanPlay.currentTime = 0;
        menuStr = 1;
        menu();
        // clearGame();
        menuStr = -1;
        newGame = true;
        paused = true;
        e.preventDefault();
        return;
    });

    /////////////Запись очков////////////
    $('#done').bind('tap',function(e)
    {
        //e.preventDefault();
        var name, record;
        name = $("#name")[0].value;
        record = $("#pointsCount").text();

        var localResp = getLastID();

        if (localResp===false)
        {
            var user = {
                "Uid":"0",
                "Name":name,
                "Record":record
            }
            localStorage["0"] = JSON.stringify(user);
        }
        else
        {
            var user = {
                "Uid":(localResp+1).toString(),
                "Name":name,
                "Record":record
            }
            localStorage[(localResp+1).toString()] = JSON.stringify(user);
        }
        menuStr = 4;
        menu();
        e.preventDefault();
    });

///////////////Продолжить/НАЧАТЬ/////////
    $('#start').bind('tap', function(e)
    {
        //e.preventDefault();
        if (menuStr == -1)
        {
            //clearGame();
            initialize();
            paused = false;
            $("#btnPause").css('visibility','visible');
            $("#quit").css('visibility','visible');
            $('#quit').css('display','block');
            $("#wrapper").css("z-index","0");
            $("#wrapper").fadeOut("slow");
            $("#scene").css(
                {
                    visibility:'visible',
                    zIndex: '999'
                }
            );
            NyanPlay.volume = 0.4;
            NyanPlay.play();
            drawScene();

            return;
        }
        if (menuStr == 2)
        {
            paused = false;
            if (levelNum=="boss")
            {
                $('#shell').css("display","block");
            }
            $("#btnPause").css('visibility','visible');
            $("#quit").css('visibility','visible');
            $('#quit').css('display','block');
            $("#wrapper").css("z-index","0");
            $("#wrapper").fadeOut("slow");
            drawScene();
            return;
        }
        if (menuStr==1)
        {
            $("#btnPause").css('visibility','visible');
            $("#menu").css('visibility','hidden');
            NyanPlay.volume = 0.4;
            NyanPlay.play();
            paused = false;
            $("#scene").css(
                {
                    visibility:'visible',
                    zIndex: '999'
                }
            );
            $('#wrapper').fadeOut("slow");
            drawScene();
            e.preventDefault();
            return;
        }
    });

    //////////НАЧАЛО ИГРЫ/////////
    menu();
});

function initialize()
{

    bubbleImage = new Image();
    angryCatImage = new Image();
    boneBoss = new Array();
    bubbleBoss = new Array();
    cat_block = 0;
    temp=0;
    b =true;
    withBubble = false;
    iBgShiftX = 0;// смещение фона
    stars = new Array();
    bones = new Array();
    starX = 51;
    starY = 51;
    bossW = 170; // ширина кота
    bossH = 116; // высота кота
    catW = 170; // ширина кота
    catH = 80; // высота кота
    iSprPosition = 0; // инициализация спрайтов
    bMouseDown = false; // состояние мыши
    iLastMouseX = 0;
    iLastMouseY = 0;
    scale = 1;
    levelNum = 1;
    starW = 51;
    starH =51;
    boneW = 60;
    boneH =34;


    $('#shell').css("display","none");
    getStar = document.getElementById("getstar");
    getBone =  document.getElementById("getbone");
    overMus = document.getElementById("over");
    victoryMus = document.getElementById("victory");
    menuStr = 1;
    paused = true;
    points = 2001;
    canvas = document.getElementById('scene');
    canvas.width = screen.width;
    canvas.height = screen.height;
   // canvas.width = 800;
   // canvas.height = 480;
    $("body").css({
        width: canvas.width+"px",
        height: canvas.height+"px",
        position: 'absolute'
    });
    $("#all").css({
        width: canvas.width+"px",
        height: canvas.height+"px"
    });
    $("#wrapper").css({
        width: canvas.width+"px",
        height: canvas.height+"px"
    });

    Xcoeff = canvas.width/800;
    Ycoeff = canvas.height/480;
    bossW = bossW*Xcoeff;
    bossH = bossH*Ycoeff;
    catW = catW*Xcoeff;
    catH = catH*Ycoeff;
    ctx = canvas.getContext('2d');
    cOFF = $(canvas);
    offset = cOFF.offset();
    NyanPlay = document.getElementById("backMusic");
    $("#imgSize").width(64*Xcoeff);
    $("#imgSize").height(64*Xcoeff);
    $("#btnPause").css(
        {
            position:'absolute',
            width: 64*Xcoeff,
            height: 64*Xcoeff,
            marginTop:5+"%",
            //   left:canvas.width-canvas.width/10+'px',
            marginLeft:90+"%",
            visibility:'hidden',
            zIndex:1500
        }
    );
    startMenu = new Image();
    center = canvas.height/2;
    rand = getRandomInt(0,center);
    backgroundImage = new Image();
    backgroundImage.src = 'images/space.png';

    bossImg.src = 'images/mad_dog.png';
    boneImage.src = 'images/bone.png';
    starImage.src = 'images/points_stars.png';
    catImage.src = 'images/nyan_cat.png';
    bubbleImage.src = 'images/bubble.png';
    angryCatImage.src = 'images/nyan_cat_with_bubble.png';

    cat = new player(0, ctx.canvas.height/2-catH/2, catW, catH, catImage);
    finalBoss = new player(canvas.width+bossW, canvas.height/2-bossH/2,bossW,bossH,bossImg);
    catDW = catW;
    catDH = catH;
}