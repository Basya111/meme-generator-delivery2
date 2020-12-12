'use strict'

var gCurrImg;
var gCurrMeme;
var gCanvas;
var gCtx;
var gItemPos;
var gPrevX;
var gPrevY;
var gCurrLine;
var gIsMoveing = false;
var gIsFoucs;

function onInit() {
    console.log('Page is ready');
    renderKeyWords()
    renderImgGallery()
}

function renderImgGallery() {
    var imgs = getImgsForDisplay()
    var strHtmls = imgs.map(function (img) {
        return `
        <div class="img-preview" onclick="onGetImg('${img.id}')">
            <img class="card-img" src="${img.url}">
        </div> 
        `
    })
    document.querySelector('.img-gallery').innerHTML = strHtmls.join('')
}

function renderKeyWords() {
    var keywords = getKeyWords()
    var kysObj = getKeysObj()
    var strHTMLs = keywords.map(function (word) {
        return `
        <li class="${word}" onclick="onSetFilter('${word}')" style="font-size: ${kysObj[word]}rem;">${word}</li>`
    })
    document.querySelector('.keywords-list').innerHTML = strHTMLs.join('')
}

function onGetImg(imgId) {
    var img = getImgById(imgId);
    gCurrImg = img;
    document.querySelector('.search-bar').style.display = 'none'
    document.querySelector('.img-gallery').style.display = 'none'
    document.querySelector('.social-network').style.display = 'none'
    var elMemeContainer = document.querySelector('.meme-container')
    elMemeContainer.style.display = 'flex'
    renderImgCanvas()
}

function getCanvas() {
    return gCanvas
}

function onSetFilter(elFilter) {
    console.log('filter by', elFilter);
    setFilter(elFilter)
    setWordSize(elFilter)
    changeWordSize(elFilter)
    renderImgGallery()
    renderKeyWords()
}

function onSearch(elFilter) {
    search(elFilter);
    renderImgGallery()
}


function showLine() {
    var line = document.querySelector('input[name=line]').value;
    gCtx.lineWidth = '1.5'
    gCtx.strokeStyle = 'black'
    gCtx.fillStyle = 'white'
    gCtx.font = '40px Impact'
    gCtx.fillText(line, 250, 250)
    gCtx.strokeText(line, 250, 250)

}


function onAddLine() {
    var line = document.querySelector('input[name=line]').value;
    if (!line) return
    gCanvas.addEventListener('input', showLine);
    addLine(line)
    document.querySelector('input[name=line]').value = '';
    renderImgCanvas()
    // console.log(gCanvas.width); 
    // console.log(gCanvas.height); 
}


function onMoveLine(diff) {
    var clickedLine = getCurrLine()
    moveLine(diff, clickedLine)
    renderImgCanvas()
}

function onDelete() {
    var line = getCurrLine()
    deleteItem(line)
    gCtx.restore()
    renderImgCanvas()
}

function onChangeFontSize(diff) {
    var clickedLine = getCurrLine()
    changeFontSize(diff, clickedLine)
    renderImgCanvas()
}

function changeWordSize(word) {
    var words = getWordsObj()
    var size = words[word] // size
    var elWord = document.querySelector('.' + word)
    console.log(elWord);
    elWord.style.fontSize = `${size}rem`;

}

// function onSwitchLine(){
//     var line = getCurrLine()
//     var linePos = gItemPos
//     gCanvas.addEventListener('focus', drawBox);
//     renderImgCanvas() 
// }

// function drawBox(){
//     console.log('hey');
//     gCtx.beginPath()
//     gCtx.strokeStyle = 'black'
//     gCtx.rect(linePos.posX, linePos.posY, 50, 350) // x,y,widht,height
//     gCtx.stroke() 
//     gCtx.fillStyle = 'orange'
//     gCtx.fillRect(linePos.posX, linePos.posY, 75, 150)
//     gCtx.focus()

// }

function onTextAlign(direction) {
    var clickedLine = getCurrLine()
    textAlign(direction, clickedLine);
    renderImgCanvas()
}

function closeWindow() {
    var elMemeContainer = document.querySelector('.meme-container')
    elMemeContainer.style.display = 'none'
    document.querySelector('.search-bar').style.display = 'flex'
    document.querySelector('.img-gallery').style.display = 'grid'
    document.querySelector('.social-network').style.display = 'block'
    // var elScreen = document.querySelector('.main-screen')
    // elScreen.classList.remove('open-canvas')
    onClearCnavas()
}

function onChangeColor() {
    let color = document.querySelector('input[name=txt-color]').value
    if (!color) color = 'white'
    let clickedLine = getCurrLine()
    chnageColor(color, clickedLine)
    renderImgCanvas()
}

// function changhFont(elFont){
//     gCtx.text = `${elFont}`
//     renderImgCanvas()
// }




// ------------- canvas-------------

function renderImgCanvas() {
    gCanvas = document.getElementById('meme-canvas')
    gCtx = gCanvas.getContext('2d')
    onGetMeme()
    var meme = gCurrMeme
    var memeLines = meme.lines
    drawImg(memeLines)
    // console.log(memeLines.length);

}


function onGetMeme() {
    gCurrMeme = getMeme()
}

function drawImg(memeLines, x, y) {
    var img = new Image();
    img.src = gCurrImg.url;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height) //img,x,y,xend,yend
        drawText(memeLines, x, y)

    }
}


function drawText(lines, x = 250, y = 250) {
    lines.forEach(line => {
        var text = line.txt
        gCtx.lineWidth = 4;
        gCtx.strokeStyle = 'black'
        gCtx.fillStyle = `${line.color}`
        gCtx.font = `${line.size}px Impact`
        // gCtx.font = 'larger 900 40px Impact'
        gCtx.textAlign = line.align
        if (!gIsMoveing) {
            if (line.numLine === 0) {
                y = line.posY + line.diff
            } else if (line.numLine === 1) {
                y = line.posY + line.diff
            }
            else {
                y = line.posY + line.diff
            }
        }
        else if (gIsMoveing) {
            x = line.posX;
            y = line.posY;
        }
        gCtx.fillText(text, x, y)
        gCtx.strokeText(text, x, y)
        gCtx.save()
    })
}

function onLinePos(ev) {
    ev.preventDefault()
    var posX = ev.offsetX
    var posY = ev.offsetY
    gItemPos = { posX, posY }
    console.log(gItemPos);
}

function getCurrLine() {
    var line;
    if (!gItemPos) line = 0;
    else if (gItemPos.posY < (gCanvas.width/ 5)) line = 1;
    else if (gItemPos.posY < (gCanvas.width/ 2.5)) line = 3;
    else if (gItemPos.posY > (gCanvas.width/ 1.2)) line = 2;
    gCurrLine = line;
    return gCurrLine
}

function drawRect(x, y) {
    gCtx.beginPath()
    gCtx.strokeStyle = 'black'
    gCtx.shadowBlur = 0;
    gCtx.rect(x, y, 300, 100) // x,y,widht,height
    gCtx.stroke()
}

// function drawFocusLine() {
//     console.log('hey');
//     if (!clickedLine) return
//     var x = gItemPos.posX
//     var y = gItemPos.posY
//     //     // drawAllTxt()
//     drawRect(x, y)
//     renderImgCanvas()
// }

function onMoveTxt(ev) {
    // console.log(ev);
    // ev.preventDefault()
    if(!gItemPos) gItemPos = {posX: gCanvas.width/2, posY: gCanvas.width/2}
    if (ev.type === 'mousedown') {
        gIsMoveing = true;
        gItemPos.posX = ev.offsetX;
        gItemPos.posY = ev.offsetY;
    }
    else if (ev.type === 'mousemove') {
        if (!gIsMoveing) return
        gPrevX = gItemPos.posX;
        gPrevY = gItemPos.posY;
        gItemPos.posX = ev.offsetX;
        gItemPos.posY = ev.offsetY;
        moveTxt(gItemPos.posX, gItemPos.posY)

    }
    else if (ev.type === 'mouseup') gIsMoveing = false;
}


function moveByTouch(ev) {
    ev.preventDefault()
    var clickedLine = getCurrLine()
    var touch = ev.touches[0];
    var posX;
    var posY;
    if (ev.type === 'touchstart') {
        posX = touch.pageX
        posY = touch.pageY
        gItemPos = { posX, posY }
        gIsMoveing = true;
        gItemPos.posX = touch.pageX;
        gItemPos.posY = touch.pageY;
    }
    else if (ev.type === 'touchmove') {
        if (!gIsMoveing) return
        gPrevX = gItemPos.posX
        gPrevY = gItemPos.posY
        gItemPos.posX = touch.pageX;
        gItemPos.posY = touch.pageY;
        // console.log(gItemPos.posX, gItemPos.posY);
        moveTxt(gItemPos.posX, gItemPos.posY)

    }
    else if (ev.type === 'touchend') gIsMoveing = false;
}


function moveTxt(x, y) {
    var clickedLine = getCurrLine()
    // console.log('x:', x, 'y:', y, clickedLine);
    updateMoveLine(x, y, clickedLine)
    renderImgCanvas()
}

function onClearCnavas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
    gItemPos = {posX: gCanvas.width/2, posY: gCanvas.width/2}
    clearMeme()
    renderImgCanvas()
}

function downloadCanvas(elLink) {
    const data = gCanvas.toDataURL();
    console.log(data)
    elLink.href = data;
    elLink.download = 'my-canvas.jpg';
}



function onSaveToStorage() {
    createMemes()
}

function toggleMenu() {
    document.body.classList.toggle('open-menu');
}

function onUpdateCanvasWidth() {
    var width = 500;
    if (gCanvas.width === 500) width = 500;
    else if (gCanvas.width === 450) width = 450
    else if (gCanvas.width === 370) width = 370
    updateCanvasWidth(width)
}

