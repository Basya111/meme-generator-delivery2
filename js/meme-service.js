'use strict'

const KEY = 'memesDB'
const gKeywords = ['man', 'kids', 'woman', 'animals', 'cute', 'funny', 'all']

var gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['man', 'funny'] },
    { id: 2, url: 'img/2.jpg', keywords: ['cute', 'animals'] },
    { id: 3, url: 'img/3.jpg', keywords: ['cute', 'animals', 'kids'] },
    { id: 4, url: 'img/4.jpg', keywords: ['cute', 'animals'] },
    { id: 5, url: 'img/5.jpg', keywords: ['funny', 'kids'] },
    { id: 6, url: 'img/6.jpg', keywords: ['man'] },
    { id: 7, url: 'img/7.jpg', keywords: ['kids'] },
    { id: 8, url: 'img/8.jpg', keywords: ['man'] },
    { id: 9, url: 'img/9.jpg', keywords: ['kids'] },
    { id: 10, url: 'img/10.jpg', keywords: ['man'] },
    { id: 11, url: 'img/11.jpg', keywords: ['man', 'funny'] },
    { id: 12, url: 'img/12.jpg', keywords: ['man'] },
    { id: 13, url: 'img/13.jpg', keywords: ['man'] },
    { id: 14, url: 'img/14.jpg', keywords: ['man'] },
    { id: 15, url: 'img/15.jpg', keywords: ['man'] },
    { id: 16, url: 'img/16.jpg', keywords: ['man'] },
    { id: 17, url: 'img/17.jpg', keywords: ['man'] },
    { id: 18, url: 'img/18.jpg', keywords: ['kids'] },
    { id: 19, url: 'img/19.jpg', keywords: ['woman'] },
    { id: 20, url: 'img/20.jpg', keywords: ['woman'] },
    { id: 21, url: 'img/21.jpg', keywords: ['woman', 'funny'] },
];
var gKeywordsObj = { 'man': 1, 'kids': 1, 'woman': 1, 'animals': 1, 'cute': 1, 'funny': 1, 'all': 1 }

var gNumLine = 0;
var gCurrLine = gNumLine;
var gFilterBy;
var gFilterByLetters;
var gCanvas = { width: 500, heigth: 500 }
// var gCurrPos = {posX: 100, posY:100}

var gMeme;
var gMemes;

_createMeme()

function getImgsForDisplay() {
    var imgs;
    if (gFilterBy === 'all' || !gFilterBy) return gImgs;
    imgs = gImgs.filter(img => {
        return img.keywords.find(word => {
            return word.includes(gFilterBy)
        })
    })
    return imgs
}

function getImgById(imgId) {
    var img = gImgs.find(function (img) {
        return img.id === +imgId;
    })
    gMeme.selectedImgId = imgId
    return img
}

function getMeme() {
    return gMeme
}

function _createMeme() {
    var meme = {
        selectedImgId: 1,
        selectedLineIdx: 0,
        lines: []
    }
    gMeme = meme
}


function addLine(txt) {
    var newLine;
    if (!gMeme.selectedLineIdx) {
        newLine = {
            txt: txt,
            size: 60,
            align: 'center',
            color: 'white',
            posX: gCanvas.width / 2,
            posY: 100,
            diff: 0
        }
    }
    else if (gMeme.selectedLineIdx === 1) {
        newLine = {
            txt: txt,
            size: 60,
            align: 'center',
            color: 'white',
            posX: gCanvas.width / 2,
            posY: 400,
            diff: 0
        }
    }
    else if (gMeme.selectedLineIdx >= 2) {
        newLine = {
            txt: txt,
            size: 60,
            align: 'center',
            color: 'white',
            posX: gCanvas.width / 2,
            posY: 250,
            diff: 0
        }
    }
    gMeme.selectedLineIdx++
    gMeme.lines[gMeme.selectedLineIdx] = newLine;

}

function getLine(){
    return (gMeme.selectedLineIdx)
}


function moveLine(diffMove, currLine) {
    var line = gMeme.lines[currLine];
    line.diff = diffMove
}

function updateMoveLine(x, y, currLine) {
    var line = gMeme.lines[currLine];
    line.posX = x;
    line.posY = y;
    console.log(line.posX, line.posY);
}

function deleteItem(deleteLineIdx) {
    gMeme.lines.splice(deleteLineIdx, 1)
    console.log(deleteLineIdx);
}


function changeFontSize(diff, currLine) {
    var line = gMeme.lines[currLine];
    line.size += diff;
}

function textAlign(direction, currLine) {
    var line = gMeme.lines[currLine]
    line.align = direction;
}

function chnageColor(color, currLine) {
    var line = gMeme.lines[currLine]
    line.color = color;
}


function clearMeme() {
    _createMeme()
    // gNumLine = 0
}

// function getLineById(clickedLine) {
//     return gMemes.lines[gMemes.selectedLineIdx];
// }

function getKeyWords() {
    return gKeywords
}

function getKeysObj() {
    return gKeywordsObj
}

function setFilter(filter) {
    gFilterBy = filter;
}

function search(filter) {
    gFilterBy = filter;
}


function setWordSize(filter) {
    gKeywordsObj[filter] += 0.5;
}

function getWordsObj() {
    return gKeywordsObj
}

function _saveMemessToStorage() {
    saveToStorage(KEY, gMemes)
}

function createMemes() {
    console.log('saving...');
    var meme = gMeme
    var memes = loadFromStorage(KEY)
    if (!memes || !memes.length) {
        memes = []
        memes.unshift(meme)
    }
    gMemes = memes;
    _saveMemessToStorage()
}

function updateCanvasWidth(width) {
    gCanvas.width = width;
    gCanvas.heigth = width;
}


