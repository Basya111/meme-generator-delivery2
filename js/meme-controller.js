'use strict'

// ***** GLOBAL VARIABLES **** //

var gCurrImg;
var gCurrMeme;
var gCanvas;
var gCtx;
var gItemPos;
var gPrevX;
var gPrevY;
var gCurrLine;
var gIsMoveing = false;
var gLineIdx = 0
var gIsFoucs;

function onInit() {
    console.log('Page is ready');
    gCanvas = document.getElementById('meme-canvas')
    gCtx = gCanvas.getContext('2d')
    renderKeyWords()
    renderImgGallery()
}

//***** WINDOW FUNCTIONS *****/

function closeWindow() {
    var elMemeContainer = document.querySelector('.meme-container')
    elMemeContainer.style.display = 'none'
    document.querySelector('.search-bar').style.display = 'flex'
    document.querySelector('.img-gallery').style.display = 'grid'
    document.querySelector('.social-network').style.display = 'flex'
    // var elScreen = document.querySelector('.main-screen')
    // elScreen.classList.remove('open-canvas')
    onClearCnavas()
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

//**** GALLERY FUNCTIONS *****/

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


//***** SEARCH FUNCTIONS *****/

function renderKeyWords() {
    var keywords = getKeyWords()
    var kysObj = getKeysObj()
    var strHTMLs = keywords.map(function (word) {
        return `
        <li class="${word}" onclick="onSetFilter('${word}')" style="font-size: ${kysObj[word]}rem;">${word}</li>`
    })
    document.querySelector('.keywords-list').innerHTML = strHTMLs.join('')
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

function changeWordSize(word) {
    var words = getWordsObj()
    var size = words[word] // size
    var elWord = document.querySelector('.' + word)
    console.log(elWord);
    elWord.style.fontSize = `${size}rem`;

}

function onGetImg(imgId) {
    var img = getImgById(imgId);
    gCurrImg = img;
    document.querySelector('.search-bar').style.display = 'none'
    document.querySelector('.img-gallery').style.display = 'none'
    document.querySelector('.social-network').style.display = 'none'
    var elMemeContainer = document.querySelector('.meme-container')
    elMemeContainer.style.display = 'flex'
    renderCanvas()
}

//***** CANVAS FUNCTIONS ******/

function renderCanvas() {
    // drawImg()
    onGetMeme()
    const meme = gCurrMeme
    const currImg = gCurrImg
    const img = new Image();
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height) //img,x,y,xend,yend    
        meme.lines.map(line => drawText(line))

    }
    img.src = currImg.url;
}

// function renderImgCanvas() {
//     gCanvas = document.getElementById('meme-canvas')
//     gCtx = gCanvas.getContext('2d')
//     onGetMeme()
//     var meme = gCurrMeme
//     var memeLines = meme.lines
//     drawImg(memeLines)
//     // console.log(memeLines.length);

// }


function onGetMeme() {
    gCurrMeme = getMeme()
}

// function drawImg(memeLines, x, y) {
//     var img = new Image();
//     img.src = gCurrImg.url;
//     img.onload = () => {
//         gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height) //img,x,y,xend,yend
//         drawText(memeLines, x, y)

//     }
// }



function drawText(line) {
    gCtx.lineWidth = 4;
    gCtx.strokeStyle = 'black'
    gCtx.fillStyle = `${line.color}`
    gCtx.font = `${line.size}px Impact`
    gCtx.textAlign = line.align
    if (!gIsMoveing) {
        line.posY += line.diff;
    }

    gCtx.fillText(line.txt, line.posX, line.posY)
    gCtx.strokeText(line.txt, line.posX, line.posY)
    gCtx.save()
}


function getCurrLine() {
    var line = getLine();
    // if (!gItemPos) line = 0;
    // else if (gItemPos.posY < (gCanvas.width/ 5)) line = 1;
    // else if (gItemPos.posY < (gCanvas.width/ 2.5)) line = 3;
    // else if (gItemPos.posY > (gCanvas.width/ 1.2)) line = 2;
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

// function drawFocusLine(currLine) {
//     console.log(currLine);
//     var x = currLine.posX
//     var y = currLine.posY
//     drawRect(x, y)
//     renderCanvas()
// }

function onUpdateCanvasWidth() {
    var width = 500;
    if (gCanvas.width === 500) width = 500;
    else if (gCanvas.width === 450) width = 450
    else if (gCanvas.width === 370) width = 370
    updateCanvasWidth(width)
}

function onClearCnavas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
    gItemPos = { posX: gCanvas.width / 2, posY: gCanvas.width / 2 }
    clearMeme()
    renderCanvas()
}



// ********* LINE FUNCTIONS ********* //

function showLine() {
    console.log('show line');
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
    renderCanvas()
    // console.log(gCanvas.width); 
    // console.log(gCanvas.height); 
}


function onMoveLine(diff) {
    var cureLine = getCurrLine()
    moveLine(diff, cureLine)
    renderCanvas()
}

function onDeleteLine() {
    var line = getCurrLine()
    deleteItem(line)
    gCtx.restore()
    renderCanvas()
}


function onChangeFontSize(diff) {
    var line = getCurrLine()
    changeFontSize(diff, line)
    renderCanvas()
}



function onSwitchLine(){
    onGetMeme()
    if(gLineIdx > gCurrMeme.lines.length - 1){
        console.log();
        gLineIdx = 0
    }
    else{
        gCurrLine = gCurrMeme.lines[gLineIdx]
        console.log(gCurrLine);
        var x = gCurrLine.posX
        var y = gCurrLine.posY
        gLineIdx++
        drawRect(x, y)
        renderCanvas()
    }
    // gCanvas.addEventListener('focus', drawBox);
}

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
    var line = getCurrLine()
    textAlign(direction, line);
    renderCanvas()
}


function onChangeColor() {
    let color = document.querySelector('input[name=txt-color]').value
    if (!color) color = 'white'
    let line = getCurrLine()
    chnageColor(color, line)
    renderCanvas()
}

// function changhFont(elFont){
//     gCtx.text = `${elFont}`
//     renderImgCanvas()
// }




// ------------- canvas-------------



function onLinePos(ev) {
    ev.preventDefault()
    var posX = ev.offsetX
    var posY = ev.offsetY
    gItemPos = { posX, posY }
    console.log(gItemPos);
}



function onMoveTxt(ev) {
    // console.log(ev);
    // ev.preventDefault()
    if (!gItemPos) gItemPos = { posX: gCanvas.width / 2, posY: gCanvas.width / 2 }
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
    else if (ev.type === 'mouseup') {
        gIsMoveing = false;
        // updateMoveLine(gItemPos.posX, gItemPos.posY, clickedLine)
    }
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
    renderCanvas()
}







