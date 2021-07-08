function make2dArray(columns, rows ) {
  let arr = new Array(columns);
  for(let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}



function createPlayer() {
  let Player = {
    name: '',
    marker: '',
    init: function(playerName, playerMarker) {
      this.name = playerName;
      this.marker = playerMarker;
      return this;
    }
  }
  let playerName = prompt('Player Name: ');
  let playerMarker = prompt('With which marker will you play with? ');
  let newPlayer = Object.create(Player).init(playerName, playerMarker);
  return newPlayer;
}




let game = (() => {
  let gameBoard = make2dArray(3, 3);
  let players = [];
  let currentPlayer = 0;
  
  function _checkBoard(currentTestPlayer) {
    let result = {
      status: 'resume',
      outcome: ''
    };
    // testing if player won by completing columns
    for(let i = 0; i < gameBoard.length; i++) { 
      let positions = 0;
      for(let j = 0; j < gameBoard[0].length; j++) {
        if(gameBoard[i][j] === currentTestPlayer) {
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
    for(let i = 0; i < gameBoard.length; i++) { 
      let positions = 0;
      for(let j = 0; j < gameBoard[0].length; j++) {
        if(gameBoard[j][i] === currentTestPlayer) {
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
    for(let i = 0; i < gameBoard.length; i++) {
      if(gameBoard[i][i] === currentTestPlayer) {
        positions++;
      }
    }
    if(positions >= 3) {
      result.status = 'finished';
      result.outcome = 'win';
      return result;
    }
    
    positions = 0;
    for(let i = 0; i < gameBoard.length; i++) {
      if(gameBoard[gameBoard.length-1-i][i] === currentTestPlayer) {
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
    for(let i = 0; i < gameBoard.length; i++) {
      for(let j = 0; j < gameBoard[0].length; j++) {
        if(gameBoard[i][j] === players[0].marker || gameBoard[i][j] === players[1].marker) {
          positions++;
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
      gameBoard[col][row] = players[currentPlayer].marker;
      target.innerText = players[currentPlayer].marker;
      let result = _checkBoard(players[currentPlayer].marker);
      if(result.status === 'finished') {
        _endGame(result, players[currentPlayer]);
      }
      currentPlayer = (currentPlayer === 0 ? 1 : 0)
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
      alert(`GAME ENDED! ${currentPlayer.name} WON!`);
      let winnerDiv = document.querySelector('.winner');
      winnerDiv.innerText = `The WINNER is: ${currentPlayer.name}`;
    }
  }

  
  function _cleanGameBoard() {
    for(let i = 0; i < gameBoard.length; i++) {
      for(let j = 0; j < gameBoard[0].length; j++) {
        gameBoard[i][j] = '';
      }
    }
  }

  function _cleanWinnerDiv() {
    let winnerDiv = document.querySelector('#winner');
    winnerDiv.innerText = '';
  }

  function _cleanTable() {
    let table = document.querySelector('table');
    while(table.lastChild) {
      table.lastChild.remove();
    }
  };

  function _cleanDivs(){
    let player1Div = document.querySelector('#player1');
    let player2Div = document.querySelector('#player2');
    player1Div.innerText = '';
    player2Div.innerText = '';
  }
  function _resetGame(){
    _cleanTable();
    _cleanDivs();
    _removeButtons();
    players.splice(0,2);
    _cleanWinnerDiv();
    _cleanGameBoard();
  }

  function _setButtons() {
    let restartButton = document.createElement('button');
    restartButton.innerText = 'Restart';
    restartButton.addEventListener('click', () => {
      _cleanTable();
      _cleanGameBoard();
      _cleanWinnerDiv();
      _initGame();
    });
    let controlDiv = document.querySelector('.controls');
    controlDiv.appendChild(restartButton);

    let resetButton = document.createElement('button');
    resetButton.innerText = 'Reset';
    resetButton.addEventListener('click', () => {
      _resetGame();
      init();
    });
    controlDiv.appendChild(resetButton);
  }

  function _removeButtons() {
    let controlDiv = document.querySelector('.controls');
    while(controlDiv.lastChild) {
      controlDiv.lastChild.remove();
    }
  }

  function _initGame() {
    let grid = document.querySelector('table');
    let colgroup = document.createElement('colgroup');
    colgroup.setAttribute('span', 3);
    grid.appendChild(colgroup);
    for(let j = 0; j < gameBoard.length; j++) {
      let newRow = document.createElement('tr');
      for(let i = 0; i < gameBoard[0].length; i++) {
        let newCell = newRow.insertCell();
        newCell.setAttribute('data-index-col', j);
        newCell.setAttribute('data-index-row', i);
        newCell.addEventListener('click', _makePlay);
      }
      grid.appendChild(newRow);
    }
  };

  function init() {
    players.push(createPlayer());
    players.push(createPlayer());
    let player1Div = document.querySelector('#player1');
    let player2Div = document.querySelector('#player2');
    player1Div.innerText = `${players[0].name}
    Marker: ${players[0].marker}`;
    player2Div.innerText = `${players[1].name}
    Marker: ${players[1].marker}`;
    _initGame();
    _setButtons();

  }
  return {
    init,
  }
})();
game.init();

