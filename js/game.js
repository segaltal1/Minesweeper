'use strict'
const MINE = '&#128163'
const FLAG = '🚩'
const EMPTY = ' ';
var gClueCounter = 3;
var isClueMode = false
var gLifeCounter = 1;
var firstClickCounter;
var gSafeClicks = 3;
var gHintsNegs = [];
var gBoard;
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
var gLevel = {
    SIZE: 4,
    MINES: 2
}


function init() {
    firstClickCounter = 0;
    gSafeClicks =3;
    document.querySelector('.safe-click').innerText = 'Safe Clicks: ' + gSafeClicks;
    gLifeCounter = gLevel.MINES > 2 ? 3 : 1;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    setLifesEmoji();
    document.querySelector('.emoji').innerHTML = '&#128512;'
    gGame.score = 0;
    gBoard = buildBoard();
    createMines();
    setNegToCells();
    printMat(gBoard, '.board-container');
    gGame.isOn = true;

}

function buildBoard() {
    var size = gLevel.SIZE;
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++) {
            var cell = {
                minesAroundCount: 0,//gettMinesNegsCount({i:i,j:j}
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell;
        }
    }
    return board;
}

//expand negs or hide them by value isSHOW
function expandNegs(clickedIndex, isShow) {
    console.log(clickedIndex);
    for (var i = clickedIndex.i - 1; i <= clickedIndex.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = clickedIndex.j - 1; j <= clickedIndex.j + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue;
            var currCell = gBoard[i][j]
            if (currCell.isShown) {
                continue;
            }
            currCell.isShown = isShow;
            gHintsNegs.push({ i: i, j: j })
            continue;
        }
    }
    printMat(gBoard, '.board-container');
}

//this function restore all cells that need to be show off
function restoreBoard() {
    for (var i = 0; i < gHintsNegs.length; i++) {
        var curr = gHintsNegs[i];
        gBoard[curr.i][curr.j].isShown = false;
    }
}
//this function expanding 1 random safe Cell
function expandRandomCell() {
    if (!gSafeClicks) return;
    var randomIdx = getRandomEmptyCell();
    gSafeClicks--;
    document.querySelector('.safe-click').innerText = 'Safe Clicks: ' + gSafeClicks;
    console.log(randomIdx);
    var elCell = document.querySelector(`.cell-${randomIdx.i}-${randomIdx.j}`);
    elCell.classList.add('safe')
    console.log(elCell);

}
function getSafeCell() {
    var emptyCells = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) emptyCells.push({ i: i, j: j })

        }
    }
    if (emptyCells.length !== 0) {
        var index = getRandomIntInclusive(0, emptyCells.length - 1)
        return emptyCells[index];
    }
    return null;


}

//set clue to board game by index clicked expand all negs around
function clue(location) {
    //check if user use all clues
    if (!gClueCounter) return;
    //setting the clue light marked border
    var elClue = document.querySelector('.clue-img');
    if (!elClue.classList.contains('clicked')) {
        elClue.classList.add('clicked')
        console.log(elClue.innerText);
        isClueMode = true;
        gClueCounter--;
    }
    //back the clue image to original
    setTimeout(function () {
        isClueMode = false;
        document.querySelector('.clue-count').innerText = gClueCounter
        elClue.classList.remove('clicked');
    }, 1500);
}

//this function set life emoji to board update when bomb clicked
function setLifesEmoji() {
    document.querySelector('.heart').innerHTML = '';
    var HEART = '&#128151';
    for (var i = 0; i < gLifeCounter; i++) {
        document.querySelector('.heart').innerHTML += HEART;
    }
}
//set level by user choose
function changeLevel(elRadio) {
    // gBoard = buildBoard(+elRadio.value);
    gLevel.SIZE = +elRadio.value;
    if (gLevel.SIZE === 4) { gLevel.MINES = 2; }
    if (gLevel.SIZE === 8) gLevel.MINES = 12
    if (gLevel.SIZE === 12) gLevel.MINES = 30
    init();

}
//set to each object on board the minesAroundCount property
function setNegToCells() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (!gBoard[i][j].isMine) {
                gBoard[i][j].minesAroundCount = countMinesAround(gBoard, i, j)
            }
        }
    }
}
function getMinesNegsCount(elCell) {

    var clickedIndex = getCellCoord(elCell.className)
    var minesAround = countMinesAround(gBoard, clickedIndex.i, clickedIndex.j);
    //console.log('Mines Around:', minesAround);
    return minesAround;


}
function createMines() {
    for (var i = 0; i < gLevel.MINES; i++) {
        var index = getRandomEmptyCell();
        if (index) {
            gBoard[index.i][index.j].isMine = true;
            console.log('MINES : ', index);
        }
    }

}
///Random empty position from Board
function getRandomEmptyCell() {
    var emptyCells = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (!gBoard[i][j].isMine || gBoard[i][j] === EMPTY) emptyCells.push({ i: i, j: j })

        }
    }
    if (emptyCells.length !== 0) {
        var index = getRandomIntInclusive(0, emptyCells.length - 1)
        return emptyCells[index];
    }
    return null;
}

function expandShown(board, elCell) {
    var clickedIndex = getCellCoord(elCell.className)
    var currCell = board[clickedIndex.i][clickedIndex.j]
    var currMinesAround = currCell.minesAroundCount;

    //if the player clicked on clue 
    if (isClueMode) {
        //expand negs
        expandNegs(clickedIndex, true);
        //hide them ater 2 sceonds
        setTimeout(function () {
            restoreBoard();
            printMat(gBoard, '.board-container');
        }, 1000);
    }
    if (currCell.isMarked || currCell.isShown) return;
    //if clicked on mine - game over 
    if (board[clickedIndex.i][clickedIndex.j].isMine) {
        gLifeCounter--;
        setLifesEmoji();
        if (gLifeCounter < 0) {
            gGame.isOn = false;
            checkWin()
            gameOver();
            return;
        } else {
            currCell.isShown = true;
            gGame.markedCount++;
            printMat(board, '.board-container');
            return;
        }
    }


    if (currMinesAround > 0) {
        board[clickedIndex.i][clickedIndex.j].isShown = true;
        gGame.shownCount++;
        renderCell(clickedIndex, currMinesAround)
        checkWin()
        return;
    }
    // debugger
    else {

        for (var i = clickedIndex.i - 1; i <= clickedIndex.i + 1; i++) {
            if (i < 0 || i >= board.length) continue;
            for (var j = clickedIndex.j - 1; j <= clickedIndex.j + 1; j++) {
                if (j < 0 || j >= board[0].length) continue;
                //if (i === clickedIndex.i && j === clickedIndex.j) continue;
                var cell = board[i][j];
                if (cell.isMarked) {
                    continue
                }
                //render each cell of neg
                if (!cell.isShown) {
                    cell.isShown = true;
                    if (cell.isMine) {
                        if (cell.isShown) var value = 'MINE'
                        else value = EMPTY
                    }
                    else value = cell.minesAroundCount
                    renderCell({ i: i, j: j }, value)
                    gGame.shownCount++;
                }
            }
        }
    }
    checkWin();
    // printMat(board, '.board-container');

}

//this function checking if the player win 
function checkWin() {
    //checking if all board is show and all bombs is marked
    if (gGame.shownCount + gGame.markedCount === gLevel.SIZE * gLevel.SIZE) {
        // debugger
        gGame.isOn = false;
        document.querySelector('.emoji').innerHTML = '&#129321;'
        stopTimer();
        return;
    }

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j];
            if (currCell.isMine && !currCell.isMarked || !currCell.isShown && !currCell.isMine) return;
        }
    }
    gGame.isOn = false;
    // document.querySelector('h2 ').innerText = 'winner!';
}

function cellClick(elCell) {
    //checking the first click
    if (!firstClickCounter) {
        firstClickCounter++;
        return;
    }
    if (firstClickCounter++ == 1) timerCycle();

    var ev = window.event;
    // Prevents context menu from showing
    window.addEventListener('contextmenu', function (elCell) {
        elCell.preventDefault();
    }, false);

    //left click
    if (ev.which === 1) {

        expandShown(gBoard, elCell)
    }
    //right click
    else if (ev.which === 3) {

        setFlag(elCell)

    }


}

//this function set flag on board 
function setFlag(elCell) {
    var clickedIndex = getCellCoord(elCell.className)
    var currCell = gBoard[clickedIndex.i][clickedIndex.j];
    // if cell exposed - nothing to do
    if (currCell.isShown) return;
    //if flagged set on  mine
    if (currCell.isMine) gGame.markedCount++;
    //if already flag - removeing him
    if (currCell.isMarked) {
        currCell.isMarked = false
        renderCell(clickedIndex, EMPTY);
        return;

    }

    else {

        //update the dom
        currCell.isMarked = true;
        checkWin()
        //update modal
        renderCell(clickedIndex, FLAG);
        console.log(gGame.markedCount);

    }

}
//function check if gamve end 
function gameOver() {
    if (!gGame.isOn) {
        document.querySelector('.emoji').innerHTML = '&#129327;'
        // showAllBoard(gBoard)
        stopTimer();
        gGame.shownCount = 0;
        // document.querySelector('h2 ').innerText = 'Game Over!';
        // elBtn.style.display = 'block'
        showAllBoard(gBoard)
    }

}

function showAllBoard(board) {

    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            var currCell = board[i][j];
            // checking if the cell is mine
            if (currCell.isMine) {
                //  not flaged - expose him 
                if (!currCell.isMarked) {
                    currCell.isShown = true;
                    continue;
                }
                //flagged - bomb -> show flag 
                if (currCell.isMarked) {
                    // currCell.isMarked = false;
                    currCell.isShown = true;
                    continue;
                }
            }
            //flagged cell ->expose neighbers
            else if (currCell.isMarked) {
                currCell.isMarked = false;
                currCell.isShown = true;
                continue
            }
            currCell.isShown = true;
        }
    }
    console.log(board);
    printMat(board, '.board-container');
}

