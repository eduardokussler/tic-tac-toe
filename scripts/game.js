function make2dArray(columns, rows ) {
  let arr = new Array(columns);
  for(let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

let gameBoard = (() => {
  let gameState = make2dArray(3, 3);
  let currentPlayer = 'X';
  
  function _checkBoard(currentTestPlayer) {
    let result = {
      status: 'resume',
      outcome: ''
    }
    // testing if player won by completing columns
    for(let i = 0; i < gameState.length; i++) { 
      let positions = 0;
      for(let j = 0; j < gameState[0].length; j++) {
        if(gameState[i][j] === currentTestPlayer) {
          positions++;
        }
      }
      if(positions >= 3) {
        result.status = 'finished';
        result.outcome = 'win';
        return result;
      }
    }
    // testing if player won by completing rows
    for(let i = 0; i < gameState.length; i++) { 
      let positions = 0;
      for(let j = 0; j < gameState[0].length; j++) {
        if(gameState[j][i] === currentTestPlayer) {
          positions++;
        }
      }
      if(positions >= 3) {
        result.status = 'finished';
        result.outcome = 'win';
        return result;
      }
    }
    // testing if player won by completing diagonals
    let positions = 0;
    for(let i = 0; i < gameState.length; i++) {
      if(gameState[i][i] === currentTestPlayer) {
        positions++;
      }
    }
    if(positions >= 3) {
      result.status = 'finished';
      result.outcome = 'win';
      return result;
    }
    
    positions = 0;
    for(let i = 0; i < gameState.length; i++) {
      if(gameState[gameState.length-1-i][i] === currentTestPlayer) {
        positions++;
      }
    }
    if(positions >= 3) {
      result.status = 'finished';
      result.outcome = 'win';
      return result;
    }
    // test if board is full
    positions = 0;
    for(let i = 0; i < gameState.length; i++) {
      for(let j = 0; j < gameState[0].lenght; j++) {
        if(gameState[i][j] !== '') {
          positions++
        }
      }
    }
    if(positions >= 9) {
      result.status = 'finished';
      result.outcome = 'tie';
      return result;
    }
    result.status = 'resume';
    result.outcome = '';
    return result;
  }
  function _makePlay(event) {
    let target = event.target;
    if(target.innerText === '') {
      let row = target.getAttribute('data-index-row');
      let col = target.getAttribute('data-index-col');
      gameState[col][row] = currentPlayer;
      target.innerText = currentPlayer;
      let result = _checkBoard(currentPlayer);
      if(result.status === 'finished') {
        _endGame(result, currentPlayer);
      }
      currentPlayer = (currentPlayer === 'X' ? 'O' : 'X')
    } else {
      alert('INVALID MOVE, TRY OTHER POSITION');
    }
  };

  function _endGame(result, currentPlayer) {
    let cells = document.querySelectorAll('td');
    cells.forEach((cell) => {
      cell.removeEventListener('click', _makePlay);
    })
    if(result.outcome === 'tie') {
      alert('GAME ENDED IN A TIE');
    } else {
      alert(`GAME ENDED! ${currentPlayer} PLAYER WON!`)
    }
  }
  function initGame() {
    let grid = document.querySelector('table');
    for(let j = 0; j < gameState.length; j++) {
      let newRow = document.createElement('tr');
      for(let i = 0; i < gameState[0].length; i++) {
        let newCell = newRow.insertCell();
        newCell.setAttribute('data-index-col', j);
        newCell.setAttribute('data-index-row', i);
        newCell.addEventListener('click', _makePlay);
      }
      grid.appendChild(newRow);
    }
  };
  return {
    initGame,
    gameState,
  }
})();

gameBoard.initGame();