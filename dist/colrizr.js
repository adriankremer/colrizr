$(function () {
    var canvas = document.getElementById('picker');
    var ctx = canvas.getContext('2d');
    var image = new Image();

    image.onload = function () {
        ctx.drawImage(image, 0, 0, image.width, image.height); // draw the image on the canvas
    };

    image.src = '../src/assets/skala.png';

    var clrzCanvas = document.getElementById('hidden-canvas');
    var clrzCtx = clrzCanvas.getContext('2d');
    var clrzImg = new Image();
    var originalPixels = null;
    var currentPixels = null;
    clrzImg.src = $('#colrizr').attr('src');
    clrzImg.onload = function () {
        clrzCanvas.width = clrzImg.width;
        clrzCanvas.height = clrzImg.height;
        clrzCtx.drawImage(clrzImg, 0, 0, clrzImg.width, clrzImg.height);
        originalPixels = clrzCtx.getImageData(0, 0, clrzImg.width, clrzImg.height);
        currentPixels = clrzCtx.getImageData(0, 0, clrzImg.width, clrzImg.height);

    };
    var theColor;
    var pixel;
    var picker = $('#picker');
    picker.click(function (e) {

        var canvasOffset = $(canvas).offset();
        var canvasX = Math.floor(e.pageX - canvasOffset.left);
        var canvasY = Math.floor(e.pageY - canvasOffset.top);


        var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
        pixel = imageData.data;

        $('.active-color').css({'background-color': 'rgb(' + pixel[0] + ',' + pixel[1] + ',' + pixel[2] + ')'});

        theColor = 'rgb(' + pixel[0] + ',' + pixel[1] + ',' + pixel[2] + ')';
        $('#picker').mouseleave(function (e) {
            console.log(theColor);
            $('.active-color').css({'background-color': theColor});

        });


    });
    var endX = 0;
    var endY = 0;
    picker.on('touchstart', function (e) {
    });
    picker.on('touchmove', function (e) {
        e.preventDefault();
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        var canvasOffset = $(canvas).offset();
        var canvasX = Math.floor(touch.pageX - canvasOffset.left);
        var canvasY = Math.floor(touch.pageY - canvasOffset.top);
        endX = e.originalEvent.touches[0].pageX;
        endY = e.originalEvent.touches[0].pageY;

        var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
        pixel = imageData.data;


        var elm = $(canvas).offset();
        var x = touch.pageX - elm.left;
        var y = touch.pageY - elm.top;
        if (x < $(canvas).width() && x > 0) {
            if (y < $(canvas).height() && y > 0) {

                $('.active-color').css({'background-color': 'rgb(' + pixel[0] + ',' + pixel[1] + ',' + pixel[2] + ')'});
            }
        }
        theColor = 'rgb(' + pixel[0] + ',' + pixel[1] + ',' + pixel[2] + ')';

    });


    picker.mousemove(function (e) {
        var canvasOffset = $(canvas).offset();
        var canvasX = Math.floor(e.pageX - canvasOffset.left);
        var canvasY = Math.floor(e.pageY - canvasOffset.top);


        var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
        var pixel = imageData.data;
        $('.active-color').css({'background-color': 'rgb(' + pixel[0] + ',' + pixel[1] + ',' + pixel[2] + ')'});

    });

    $('.active-color a').on('click', function () {
        for (var I = 0, L = originalPixels.data.length; I < L; I += 4) {
            if (currentPixels.data[I + 3] > 0) {
                //rot
                currentPixels.data[I] = originalPixels.data[I] / 255 * pixel[0];
                //gruen
                currentPixels.data[I + 1] = originalPixels.data[I + 1] / 255 * pixel[1];
                //blau
                currentPixels.data[I + 2] = originalPixels.data[I + 2] / 255 * pixel[2];
            }
        }
        clrzCtx.putImageData(currentPixels, 0, 0);
        document.getElementById('colrizr').setAttribute('src', clrzCanvas.toDataURL());
    });


});

	