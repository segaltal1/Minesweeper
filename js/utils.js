function printMat(mat, selector) {
  var strHTML = '<table border="0"><tbody>';
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      if(mat[i][j].isMarked)cell = FLAG
      else {
        var inputCell = mat[i][j].isShown ? mat[i][j].minesAroundCount : EMPTY
        var cell = mat[i][j].isMine &&  mat[i][j].isShown ? MINE : inputCell;
      }

      var className = 'cell cell' + '-' + i + '-' + j;
      strHTML += `<td class="${className}" onmousedown="cellClick(this)">${cell}</td>`
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}
// Gets a string such as:  'cell-2-7' and returns {i:2, j:7}
function getCellCoord(strCellId) {
  var firstParts = strCellId.split(' ');
  var parts = firstParts[1].split('-')
  var coord = { i: +parts[1], j: +parts[2] };
  return coord;
}

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
  elCell.innerHTML = value;
}

function countMinesAround(mat, rowIdx, colIdx) {
  var minesCounter = 0
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i > mat.length - 1) continue
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j > mat[0].length - 1) continue
      if (i === rowIdx && j === colIdx) continue
      // console.log('hi')
      var cell = mat[i][j];
      if (cell.isMine) minesCounter++
    }
  }
  return minesCounter
}

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
