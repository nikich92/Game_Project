// внутренние переменные
var canvas, ctx;
var backgroundImage;
var iBgShiftX = 0;// смещение фона
var cat;
var st;
var stars = new Array();
var star;
var starX = 600;
var starY;
var catW = 170; // ширина кота
var catH = 80; // высота кота
var iSprPosition = 0; // инициализация спрайтов
//var backgroundMusic;
//var wingsSound;
var bMouseDown = false; // состояние мыши
var iLastMouseX = 0;
var iLastMouseY = 0;
// -------------------------------------------------------------
// использование Math.round() даст неравномерное распределение!
function getRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// объекты :
//function cat(x, y, w, h, image) {
//    this.x = x;
//    this.y = y;
//    this.w = w;
//    this.h = h;
//    this.image = image;
//    //this.bCat = false;
//}

function XD(x1,y1,x2,y2){

    return (((x1>x2-obj2.w/2)&&(x1<x2+obj2.w/2))&&((y1>y2obj2.h/2)&&(y1<y2+obj2.h/2)));

}

function collision(obj1,obj2){
    var XColl=false;
    var YColl=false;

    var catY = obj1.y + obj1.h;
    var starY = obj2.y + obj2.h;

    var catX = obj1.x+obj1.w;
   XColl = ((obj2.y<catY && obj2.y > obj1.y) && (obj2.x<catX && obj2.x>obj1.x)) || ((starY>obj1.y && starY < catY) && (obj2.x<catX && obj2.x>obj1.x));
   // return XD(obj1.x+obj1.w,obj1.y+obj1.h,obj2.x,obj2.y)&&XD(obj1.x,obj1.y,obj2.x+obj2.w,obj2.y+obj2.h)&&
     //   XD(obj1.x+obj1.w,obj2.y,obj2.x,obj2.y+obj2.h)&&XD(obj1.x,obj2.y+obj2.h,obj2.x+obj2.w,obj2.y);
   return XColl;
   // if(((C1X>C2X-obj2.w/2)&&(C1X<C2X+obj2.w/2))&&((C2Y>C2Y-obj2.h/2)&&(C2Y<C2Y+obj2.h/2))); XColl = true;

}
function player (x,y,w,h,image)
{
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.image = image;
}
// -------------------------------------------------------------

// функции отрисовки :
function clear() { // функция очистки canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawScene() { // главная функция отрисовки
    clear(); // очистить canvas

    iBgShiftX += 6;
    if (iBgShiftX >= 480) {
        iBgShiftX = 0;
    }
    ctx.drawImage(backgroundImage, iBgShiftX, 0, 960, 900, 0,0,600,360);
    // обновление позиций спрайтов
    iSprPosition++;
    if (iSprPosition >= 11) {
        iSprPosition = 0;
    }

    // перемещение кота к месту нажатия мыши
    if (bMouseDown) {
        if (iLastMouseX > cat.x) {
            cat.x += 5;
            if (cat.x>ctx.canvas.width/2)
            {
                cat.x=(ctx.canvas.width/2)-1;
            }
        }
//        if (iLastMouseY > cat.y) {
//            cat.y += 5;
//        }
        if (iLastMouseX < cat.x) {
            cat.x -= 5;
        }
//        if (iLastMouseY < cat.y) {
//            cat.y -= 5;
//        }

    }

    for (var i = 0; i<stars.length;i++)
    {
        var shift = getRandomInt(2,5);
        if (stars[i].x<0-stars[i].w)
        {
            stars[i] =new player(getRandomInt(600,1500),getRandomInt(0,360),star.w,star.h,star.image);
        }
        if (collision(cat,stars[i]))
        {
           stars[i] = new player(getRandomInt(600,1500),getRandomInt(0,360),star.w,star.h,star.image);
           // continue;
        }
        ctx.drawImage(star.image,0,0,star.w,star.h,stars[i].x-=shift,stars[i].y,star.w,star.h);
    }

    // отрисовка кота
    ctx.drawImage(cat.image, iSprPosition*cat.w, 0, cat.w, cat.h, cat.x, 180, cat.w, cat.h);
}

// -------------------------------------------------------------

// инициализация
$(function(){
    canvas = document.getElementById('scene');
    ctx = canvas.getContext('2d');

    var width = canvas.width;
    var height = canvas.height;

    // загрузка фонового изображения
    backgroundImage = new Image();
    backgroundImage.src = 'images/space.png';
    backgroundImage.onload = function() {
    }
    backgroundImage.onerror = function() {
        console.log('Error loading the background image.');
    }

    // инициализация кота
    var ocatImage = new Image();
    var starImage = new Image();
    starImage.src = 'images/points_stars.png';
    ocatImage.src = 'images/nyan_cat.png';
    ocatImage.onload = function() {
    }

    star = new player(0,0,51,51,starImage);
    cat = new player(0, ctx.canvas.height/2, catW, catH, ocatImage);
    st = getRandomInt(3,8);
    // starY = getRandomInt(0,360);
    // starX = 780;

    for (var j = 0;j<st;j++)
    {
        stars.push(new player(getRandomInt(600,1500),getRandomInt(0,360),star.w,star.h,star.image))
    }

    $('#scene').mousedown(function(e) { // привязываем событие нажатия мыши(для перетаскивания)
        var mouseX = e.layerX || 0;
        var mouseY = e.layerY || 0;
        if(e.originalEvent.layerX) {
            mouseX = e.originalEvent.layerX;
            mouseY = e.originalEvent.layerY;
        }

        bMouseDown = true;

        if (mouseX > cat.x && mouseX < ctx.canvas.width || mouseX<cat.x &&mouseX < ctx.canvas.width )
        {
            //cat.bCat = true;
            iLastMouseX = mouseX;
        }
    });

    $('#scene').mouseup(function(e) { // привязываем событие отжатия мыши
        cat.bCat = false;
        bMouseDown = false;
    });

    //setTimeout
    setInterval(drawScene, 50); // отрисовка сцены с заданным интервалом
});