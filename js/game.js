'use strict'
const MINE = '&#128163'
const FLAG = '🚩'
const EMPTY = ' ';
var SIZE = 4;
var firstClickCounter;
var gBoard;
var elBtn = document.querySelector('button');
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
var gLevel = {
    SIZE: 4,
    MINES: SIZE
}


function init() {
    firstClickCounter = 0;
    document.querySelector('h2 ').innerText = 'Lets Play!';
    elBtn.style.display = 'none'
    gGame.score = 0;
    gBoard = buildBoard(SIZE);
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
function changeLevel(elRadio) {
    // gBoard = buildBoard(+elRadio.value);
    gLevel.SIZE = +elRadio.value;
    gLevel.MINES = gLevel.SIZE
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
    //update the dom
    gBoard[clickedIndex.i][clickedIndex.j] = minesAround;
    //update modal
    renderCell(clickedIndex, minesAround);

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

    if (currCell.isMarked || currCell.isShown) return;
    //if clicked on mine - game over 
    if (board[clickedIndex.i][clickedIndex.j].isMine) {
        gGame.isOn = false;
        checkWin()
        gameOver();
        return;
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
                if (cell === FLAG) {
                    continue
                }
                if (!cell.isShown) {
                    cell.isShown = true;
                    gGame.shownCount++;
                }
            }
        }
    }
    checkWin();
    printMat(board, '.board-container');

}

//this function checking if the player win 
function checkWin() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j];
            if (currCell.isMine && !currCell.isMarked || !currCell.isShown && !currCell.isMine) return;
        }
    }
    gGame.isOn = false;
    document.querySelector('h2 ').innerText = 'winner!';
}

function cellClick(elCell) {
    //checking the first click
    if (!firstClickCounter) {
        firstClickCounter++;
        return;
    }

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
    //if already flag - removeing him
    if (currCell.isMarked) {
        currCell.isMarked = false
        renderCell(clickedIndex, EMPTY);
        gGame.markedCount--;
        console.log(gGame.markedCount);
        return;

    }

    else {
        gGame.markedCount++;
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
        // showAllBoard(gBoard)
        gGame.shownCount = 0;
        document.querySelector('h2 ').innerText = 'Game Over!';
        elBtn.style.display = 'block'
        showAllBoard(gBoard)
    }

}

function showAllBoard(board) {

    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            var currCell = board[i][j];
            if (currCell.isMine) {
                if (currCell.isShown === false && currCell.isMarked === false) {
                    currCell.isShown = true;
                    continue;
                }

                if (currCell.isShown === false && currCell.isMarked === true) {
                    currCell.isMarked = false;
                    continue;
                }
                if (currCell.isShown === true && currCell.isMarked === true) {
                    currCell.isMarked = false;
                    continue;
                }


            }
            if (currCell.isMarked) {
                currCell.isMarked = false
                currCell.isShown ==true;
                continue;
            }
            currCell.isShown = true;


        }
    }
    console.log(board);
    printMat(board, '.board-container');
}

