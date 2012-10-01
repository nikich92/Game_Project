// внутренние переменные
var canvas, ctx;
var backgroundImage;
var iBgShiftX = 10;// смещение фона
var cat;
var catW = 170; // ширина кота
var catH = 80; // высота кота
var iSprPosition = 0; // инициализация спрайтов
var iSprDirection = 6; // начальное направление кота
//var backgroundMusic;
//var wingsSound;
var bMouseDown = false; // состояние мыши
var iLastMouseX = 0;
var iLastMouseY = 0;
// -------------------------------------------------------------

// объекты :
function cat(x, y, w, h, image) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.image = image;
    //this.bCat = false;
}
// -------------------------------------------------------------

// функции отрисовки :
function clear() { // функция очистки canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawScene() { // главная функция отрисовки
    clear(); // очистить canvas

    iBgShiftX -= 2;
    if (iBgShiftX <= 0) {
        iBgShiftX = 50;
    }
    //ctx.drawImage(backgroundImage, 0 + iBgShiftX, 0, 1000, 940, 0, 0, 1000, 600);
ctx.drawImage(backgroundImage, iBgShiftX, 0, 400, 360, 0,0,600,360);
    // обновление позиций спрайтов
    iSprPosition++;
    if (iSprPosition >= 11) {
        iSprPosition = 0;
    }

    // перемещение кота к месту нажатия мыши
    if (bMouseDown) {
        if (iLastMouseX > cat.x) {
            cat.x += 5;
        }
        if (iLastMouseY > cat.y) {
            cat.y += 5;
        }
        if (iLastMouseX < cat.x) {
            cat.x -= 5;
        }
        if (iLastMouseY < cat.y) {
            cat.y -= 5;
        }
    }

    // отрисовка кота
    ctx.drawImage(cat.image, iSprPosition*cat.w, 0, cat.w, cat.h, cat.x, 180, cat.w, cat.h);
    //ctx.drawImage(cat.image, 0,0, cat.w, cat.h, 0, 180, cat.w, cat.h);
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
    ocatImage.src = 'images/nyan_cat.png';
    ocatImage.onload = function() {
    }
    cat = new cat(0, ctx.canvas.height/2, catW, catH, ocatImage);

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

//    $('#scene').mousemove(function(e) { // привязываем событие движения мыши
//        var mouseX = e.layerX || 0;
//        var mouseY = e.layerY || 0;
//        if(e.originalEvent.layerX) {
//            mouseX = e.originalEvent.layerX;
//            mouseY = e.originalEvent.layerY;
//        }
//
//        // сохраняем последние координаты
//        iLastMouseX = mouseX;
//        iLastMouseY = mouseY;
//
//        // перетаскиваем кота
//        if (cat.bCat) {
//            cat.x = mouseX;
//            cat.y = mouseY;
//        }
//
//        }
//    });

    $('#scene').mouseup(function(e) { // привязываем событие отжатия мыши
        cat.bCat = false;
        bMouseDown = false;
    });

    setInterval(drawScene, 50); // отрисовка сцены с заданным интервалом
});