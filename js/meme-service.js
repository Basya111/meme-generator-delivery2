'use strict'

var gKeywords;
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

var gKeywords = ['man', 'kids', 'woman', 'animals', 'cute', 'funny', 'all']
var gKeywordsObj = { 'man': 1, 'kids': 1, 'woman': 1, 'animals': 1, 'cute': 1, 'funny': 1 }

var gNumLine = 0;
var gCurrLine = gNumLine;
var gFilterBy;

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [
        // {
        //     number: gNumLine++,
        //     txt: 'I never eat Falafel',
        //     size: 20,
        //     align: 'left',
        //     color: 'red'
        //     posX: 100;
        //     posY: 250;
        // }
    ]
}

function getImgsForDisplay() {
    if (gFilterBy === 'all' || !gFilterBy) return gImgs;
    var imgs = gImgs.filter(img => {
        return img.keywords.includes(gFilterBy)
    })
    return imgs
}

function getImgById(imgId) {
    var img = gImgs.find(function (img) {
        return img.id === +imgId;
    })
    return img
}

function getMeme() {
    return gMeme
}

function addLine(line) {
    var newLine = { numLine: gNumLine++, txt: line, size: 60, align: 'center', color: 'red', diff: 0 }
    switch (gNumLine) {
        case 1:
            newLine.posX = 250
            newLine.posY = 100
            break;
        case 2:
            newLine.posX = 250
            newLine.posY = 400
            break;
        case 3:
            newLine.posX = 250
            newLine.posY = 250
    }
    gMeme.lines.push(newLine)
    console.log(gMeme.lines);
    return gNumLine
}

function moveLine(diffMove, currLine = gCurrLine) {
    var txtLine = gMeme.lines.find(function (line) {
        return line.numLine === currLine;
    }
    )
    txtLine.diff += diffMove
}

function updateMoveLine(x, y, clickedLine){
    var txtLine = gMeme.lines.find(function (line) {
        return line.numLine === clickedLine;
    })
    txtLine.posX = x;
    txtLine.posY = y;
    console.log(txtLine.posX, txtLine.posY);
}

function deleteItem(deleteLine) {
    var lineIdx = gMeme.lines.findIndex(function (line) {
        return line.numLine === deleteLine
    })
    gMeme.lines.splice(lineIdx, 1)
}


function changeFontSize(diff, clickedLine) {
    var txtLine = getLineByLineNum(clickedLine)
    txtLine.size += diff;
}

function textAlign(direction, clickedLine) {
    var txtLine = getLineByLineNum(clickedLine)
    txtLine.align = direction
}

function clearMeme() {
    gMeme.lines = [];
}

function getLineByLineNum(clickedLine) {
    var txtLine = gMeme.lines.find(line => {
        return line.numLine === clickedLine;
    })
    return txtLine;
}

// function updateKeywords(){
//     var gKeywordsObj = getKeyWords.map(function(key){

//     })
// }

function getKeyWords() {
    return gKeywords
}

function getKeysObj(){
    return gKeywordsObj
}

function setFilter(filter) {
    gFilterBy = filter;
}

function search(search) {
    gFilterBy = search;
}

function setWordSize(filter) {
    gKeywordsObj[filter]++;
}

function getWordsObj() {
    return gKeywordsObj
}


