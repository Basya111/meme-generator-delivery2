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

function onInit() {
    console.log('Page is ready');
    gCanvas = document.getElementById('meme-canvas')
    gCtx = gCanvas.getContext('2d')
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
        console.log(kysObj[word]);
        return `
        <li class="${word}" onclick="onSetFilter('${word}')" style="font-size: ${kysObj[word]}rem;">${word}</li>`
    })
    document.querySelector('.keywords-list').innerHTML = strHTMLs.join('')
}

function onGetImg(imgId) {
    var img = getImgById(imgId);
    gCurrImg = img;
    console.log(gCurrImg);
    var elMemeContainer = document.querySelector('.meme-container')
    elMemeContainer.style.display = 'flex'
    renderImgCanvas()
}

function onSetFilter(elFilter) {
    console.log('filter by', elFilter);
    setFilter(elFilter)
    setWordSize(elFilter)
    changeWordSize(elFilter)
    renderImgGallery()
    renderKeyWords()
}

function onSearch(elSearch) {
    console.log('search by', elSearch);
    search(elSearch);
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
    onClearCnavas()
}

function onChangeColor(){
    let color = document.querySelector('input[name=txt-color]').value
    if(!color) color = 'white'
    let clickedLine = getCurrLine()
    chnageColor(color, clickedLine)
    renderImgCanvas()
}




// ------------- canvas-------------

function renderImgCanvas() {
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
        gCtx.lineWidth = '1.5'
        gCtx.strokeStyle = 'black 2px'
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
        else if(gIsMoveing){
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
    else if (gItemPos.posY < 150) line = 0;
    else if (gItemPos.posY < 300) line = 2;
    else if (gItemPos.posY > 300) line = 1;
    gCurrLine = line;
    return gCurrLine
}

function onMoveTxt(ev) {
    // console.log(ev);
    ev.preventDefault()
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

function moveTxt(x, y){
    var clickedLine = getCurrLine()
    updateMoveLine(x, y, clickedLine)
    renderImgCanvas()
}

function onClearCnavas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
    clearMeme()
    renderImgCanvas()
}

function downloadCanvas(elLink) {
    const data = gCanvas.toDataURL();
    console.log(data)
    elLink.href = data;
    elLink.download = 'my-canvas.jpg';
}

function onSaveToStorage(){
    saveToStorage()
}

