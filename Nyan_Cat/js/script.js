// внутренние переменные
var canvas, ctx;
var backgroundImage;
var startMenu;
var iBgShiftX = 0;// смещение фона
var cat;
var catDW;
var catDH;
var st;
var speed;
var points = 0;
var stars = new Array();
var bones = new Array();
var star;
var bone;
var starX = 600;
var starY;
var catW = 170; // ширина кота
var catH = 80; // высота кота
var iSprPosition = 0; // инициализация спрайтов
var bMouseDown = false; // состояние мыши
var iLastMouseX = 0;
var iLastMouseY = 0;
var cOFF, offset;
var size;
var scale = 1;
var interval;
var menuInt;
var paused = true;
var menuStr = 'Нажмите Enter для начала игры';
// -------------------------------------------------------------
function getRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// объекты :
function pause()
{
    if (interval!=null)
    clearTimeout(interval);
}
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
    pause();
    clear();
    ctx.drawImage(startMenu, 0, 0, ctx.canvas.width, ctx.canvas.height, 0,0,ctx.canvas.width,ctx.canvas.height);
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.font = '3em calibri';
    ctx.fillText(menuStr,50,70);
    ctx.fill();
    ctx.closePath();
    menuInt = setTimeout(menu,30);
}
function drawScene() { // главная функция отрисовки
    clear(); // очистить canvas
//    if (paused===true)
//    {
//        pause();
//        ctx.drawImage(startMenu, 0, 0, ctx.canvas.width, ctx.canvas.height, 0,0,ctx.canvas.width,ctx.canvas.height);
//       // return;
//    }
points-=1;
    iBgShiftX += 10;
    if (iBgShiftX >= 2495) {
        iBgShiftX = 0;
    }

    ctx.drawImage(backgroundImage, iBgShiftX, 0, 1500, 1000, 0,0,ctx.canvas.width,ctx.canvas.height);
    // обновление позиций спрайтов
    iSprPosition++;
    if (iSprPosition >= 11) {
        iSprPosition = 0;
    }
    currSpr = iSprPosition;
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.font = "bold 24px calibri";
    ctx.fillText(points.toString(),20,30)
    ctx.fill();
    ctx.closePath();
    // перемещение кота к месту нажатия мыши
    if (bMouseDown) {
        if (iLastMouseX > cat.x+cat.w) {
            cat.x += 8;
            if (cat.x>ctx.canvas.width/2)
            {
                cat.x=(ctx.canvas.width/2)-1;
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
    for (var i = 0; i<stars.length;i++)
    {
        if (stars[i].x<0-stars[i].w)
        {
            speed = getRandomInt(4,7);
            var star = new gameObject(speed);
            star.x = getRandomInt(ctx.canvas.width,ctx.canvas.width*2);
            star.y = getRandomInt(0,ctx.canvas.height-stars[i].h);
            star.w = 51;
            star.h = 51;

            star.image = stars[i].image;
            stars[i] = star;
        }
        if (collision(cat,stars[i]))
        {
            speed = getRandomInt(4,7);
            var star = new gameObject(speed);
            star.x = getRandomInt(ctx.canvas.width,ctx.canvas.width*2);
            star.y = getRandomInt(0,ctx.canvas.height-51);
            star.w = 51;
            star.h = 51;

            star.image = stars[i].image;
            stars[i] = star;
            points+=70;
            if (scale<1)
            {
                scale+=0.2;
                size = true;
            }
            if(scale>1) scale=1;
        }
        ctx.drawImage(stars[i].image,0,0,stars[i].w,stars[i].h,stars[i].x-=stars[i].speed,stars[i].y,stars[i].w,stars[i].h);
    }
    for (var i = 0; i<bones.length;i++)
    {
        if (bones[i].x<0-bones[i].w)
        {

            speed = getRandomInt(3,9);
            var bone = new gameObject(speed);
            bone.x = getRandomInt(ctx.canvas.width,ctx.canvas.width*2);
            bone.y = getRandomInt(0,ctx.canvas.height-bones[i].h);
            bone.w = 60;
            bone.h = 34;

            bone.image = bones[i].image;
            bones[i] = bone;
        }
        if (collision(cat,bones[i]))
        {
            var XCollAll=false;
            var YCollTop=false;
            var YCollBottom=false;
            var Coll = false;

            var catX = cat.x + cat.w;
            var catY = cat.y + cat.h;
            var starY = bones[i].y + bones[i].h;

            XCollAll = bones[i].x<catX && bones[i].x>cat.x;
            YCollTop = bones[i].y<catY && bones[i].y > cat.y;
            YCollBottom = starY>cat.y && starY < catY;
            Coll = XCollAll && YCollBottom;
            Coll = XCollAll && YCollTop;

            speed = getRandomInt(3,9);
            var bone = new gameObject(speed);
            bone.x = getRandomInt(ctx.canvas.width,ctx.canvas.width*2);
            bone.y = getRandomInt(0,ctx.canvas.height-34);
            bone.w = 60;
            bone.h = 34;


            bone.image = bones[i].image;
            bones[i] = bone;

            points-=85;
            if (scale>0.4)
            {
                scale-=0.2;
                size = true;
            }
            else
            {
                clearTimeout(interval);
				menuStr = 'GAME OVER';
				menu();
            }
			if (points<=0)
			{
			 clearTimeout(interval);
				menuStr = 'GAME OVER';
				menu();
			}
        }

        ctx.drawImage(bones[i].image,0,0,bones[i].w,bones[i].h,bones[i].x-=bones[i].speed,bones[i].y,bones[i].w,bones[i].h);
    }

    // отрисовка кота
    // cat = new cat(cat.x,cat.y,)
    if (size)
    {
        ctx.drawImage(cat.image, iSprPosition*catDW, 0, catDW, catDH, cat.x, cat.y, catDW*scale, catDH*scale);
        cat = new player(cat.x,cat.y,catDW*scale,catDH*scale,cat.image);
    }
    else
    {
        ctx.drawImage(cat.image, iSprPosition*cat.w, 0, cat.w, cat.h, cat.x, cat.y, cat.w, cat.h);
    }
    interval = setTimeout(drawScene,30);
}

// -------------------------------------------------------------
// инициализация
$(function(){
    points = 1001;
    canvas = document.getElementById('scene');
    ctx = canvas.getContext('2d');
    cOFF = $(canvas);
    offset = cOFF.offset();
    var width = canvas.width;
    var height = canvas.height;

     startMenu = new Image();
    startMenu.src = 'images/MainMenu.png';
    startMenu.onload = function(){}
    // загрузка фонового изображения
    backgroundImage = new Image();
    backgroundImage.src = 'images/spacefinal1.svg';
    backgroundImage.onload = function(){

    }
    backgroundImage.onerror = function() {
        console.log('Error loading the background image.');
    }
    var catImage = new Image();
    var starImage = new Image();
    var boneImage = new Image();
    boneImage.src = 'images/bone.png';
    starImage.src = 'images/points_stars.png';
    catImage.src = 'images/nyan_cat.png';

    catImage.onload = function(){

    }

    cat = new player(0, ctx.canvas.height/2-catH/2, catW, catH, catImage);
    catDW = catW;
    catDH = catH;


    st = getRandomInt(3,7);

    for (var j = 0;j<st;j++)
    {
        speed = getRandomInt(4,7);
        var star = new gameObject(speed);
        star.x = getRandomInt(ctx.canvas.width,ctx.canvas.width*2);
        star.y = getRandomInt(0,ctx.canvas.height-51);
        star.w = 51;
        star.h = 51;

        star.image = starImage;
        stars.push(star);//new player(getRandomInt(600,1500),getRandomInt(0,360),star.w,star.h,star.image)
        //stars.push (new gameObject(4))
    }
    st = getRandomInt(2,5);
    for (var j = 0;j<st;j++)
    {
        speed = getRandomInt(3,9);
        var bone = new gameObject(speed);
        bone.x = getRandomInt(ctx.canvas.width,ctx.canvas.width*2);
        bone.y = getRandomInt(0,ctx.canvas.height-34);
        bone.w = 60;
        bone.h = 34;


        bone.image = boneImage;
        bones.push(bone)//new player(getRandomInt(600,1900),getRandomInt(0,360-34),bone.w,bone.h,bone.image)
    }

    // управление

    $('#scene').bind('mousedown touchstart',function(e) {
        var mouseX = e.layerX || 0;
        var mouseY = e.layerY || 0;

        if(e.originalEvent.layerX) {
            mouseX =  e.pageX-offset.left;
            mouseY = e.pageY-offset.top;
        }

        bMouseDown = true;

        if ((mouseX > cat.x+cat.w && mouseX < ctx.canvas.width) || (mouseX<cat.x && mouseX > 0) )
        {
            //cat.bCat = true;
            iLastMouseX = mouseX;
        }
        if ((mouseY > cat.y+cat.h && mouseY < ctx.canvas.height) || (mouseY<cat.y && mouseY > 0))
        {
            //cat.bCat = true;
            iLastMouseY = mouseY;
        }
    });

    $('#scene').bind('mouseup',function(e){
        cat.bCat = false;
        bMouseDown = false;
    });

    window.addEventListener('keypress', whatkey,true);
    function  whatkey(e)
    {
        if (e.keyCode==13)
        {
            paused = false;
            clearInterval(menuInt);
            drawScene();
            return;
        }
        if (e.keyCode==32)
        {
            menuStr = 'Нажмите Enter, чтобы продолжить';
            paused = true;
           menu();
            return;
        }
    }
    menu();
});