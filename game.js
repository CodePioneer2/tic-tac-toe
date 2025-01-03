const Player = (name, symbol, score) => {
  const increaseScore = () => {
    score++;
  };
  const getScore = () => score;
  return { name, symbol, increaseScore, getScore };
};

const Gameboard = (() => {
  const board = new Array(9);

  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const getBoard = () => board;

  const resetBoard = () => board.fill('');

  const placeSymbol = (symbol, index) => {
    if (board[index] !== '') {
      return false;
    }
    board[index] = symbol;
  };

  const checkWin = () => {
    for (const row of winPatterns) {
      const [a, b, c] = row;
      if (board[a] && board[a] === board[b] && board[b] === board[c]) {
        return true;
      }
    }
  };

  const checkTie = () => {
    if (!board.includes('')) {
      return true;
    }
  };

  return { getBoard, placeSymbol, checkWin, checkTie, resetBoard };
})();

const Game = (() => {
  let player1 = null;
  let player2 = null;
  let currentPlayer = null;
  let isGameOver = false;
  player1 = Player('Player1', 'X', 0);
  player2 = Player('Player2', 'O', 0);

  const startGame = () => {
    currentPlayer = player1;
    isGameOver = false;

    Gameboard.resetBoard();
    RenderDOM.renderBoard();
  };

  const playTurn = (index) => {
    if (isGameOver) {
      return;
    }
    RenderDOM.displayTurn(currentPlayer.name, currentPlayer.symbol);
    if (Gameboard.placeSymbol(currentPlayer.symbol, index) === false) {
      return;
    }
    RenderDOM.renderBoard();
    if (Gameboard.checkTie()) {
      isGameOver = gameOver();
      return;
    }
    if (Gameboard.checkWin()) {
      currentPlayer.increaseScore();
      isGameOver = gameOver();
      return;
    }
    switchPlayer();
    RenderDOM.displayTurn(currentPlayer.name, currentPlayer.symbol);
  };

  const gameOver = () => {
    RenderDOM.gameOver(player1, player2, currentPlayer);
    return true;
  };

  const switchPlayer = () =>
    (currentPlayer = currentPlayer === player1 ? player2 : player1);

  return { startGame, playTurn };
})();

const RenderDOM = (() => {
  const gameboard = document.getElementById('gameboard');
  const turn = document.getElementById('turn');
  const startBtn = document.getElementById('start-btn');

  startBtn.addEventListener('click', () => {
    turn.textContent = "New game started";
    Game.startGame();
  });

  // display currentPlayer information
  const displayTurn = (playerName, playerSymbol) => {
    turn.textContent = `${playerName}'s (${playerSymbol})  turn`;
  };

  // render board and add class and event
  const renderBoard = () => {
    gameboard.innerHTML = '';

    const board = Gameboard.getBoard();

    board.forEach((value, index) => {
      const squareEl = document.createElement('div');

      squareEl.className = 'square';
      squareEl.textContent = value;

      squareEl.addEventListener('click', () => {
        Game.playTurn(index);
      });
      gameboard.appendChild(squareEl);
    });
  };

  const gameOver = (player1, player2, currentPlayer) => {
    const player1Score = document.getElementById('player1-score');
    const player2Score = document.getElementById('player2-score');
    const board = Gameboard.getBoard();
    const turn = document.getElementById('turn');
    const tie = false;

    // display restart button
    startBtn.textContent = 'Play again';

    if (tie) {
      turn.textContent = 'TIE!';
      return;
    }
    turn.textContent = `${currentPlayer.name} wins!`;

    // display results
    player1Score.textContent = player1.getScore();
    player2Score.textContent = player2.getScore();

    // remove eventlistener from board and add classes
    gameboard.innerHTML = '';
    board.forEach((value) => {
      // Create squares and append to gameboard
      const squareEl = document.createElement('div');
      squareEl.className = 'gameOverSquare';
      if (value === currentPlayer.symbol) {
        squareEl.classList.add('winningSquare');
      } else {
        squareEl.classList.add('losingSquare');
      }
      squareEl.textContent = value;
      gameboard.appendChild(squareEl);
    });
  };

  return { renderBoard, displayTurn, gameOver };
})();

Game.startGame();
