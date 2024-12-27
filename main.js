const GameBoard = () => {
  const row = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < row; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const dropToken = (row, column, player) => {
    if (board[row][column].getValue() === 0) {
      board[row][column].addToken(player);
    } else {
      console.log("Yeah lil bro you can't do that");

      return;
    }
  };

  const printBoardConsole = () => {
    const boardWithValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithValues);
  };

  const getBoard = () => {
    return board.map((row) => row.map((cell) => cell.getValue()));
  };

  const clearBoard = () => {
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < columns; j++) {
        board[i][j].clearValue();
      }
    }
  };

  return {
    dropToken,
    printBoardConsole,
    getBoard,
    clearBoard,
  };
};

function Cell() {
  let value = 0;
  const addToken = (player) => {
    value = player;
  };
  const getValue = () => value;
  const clearValue = () => (value = 0);
  return {
    addToken,
    getValue,
    clearValue,
  };
}

function GameMechs(playerOneName = "Player One", playerTwoName = "Player Two") {
  const Players = [
    {
      name: playerOneName,
      token: "1",
    },
    {
      name: playerTwoName,
      token: "2",
    },
  ];

  const board = GameBoard();

  let activePlayer = Players[0];

  let gameFinished = false;

  const switchActivePlayer = () => {
    if (activePlayer === Players[0]) {
      activePlayer = Players[1];
    } else {
      activePlayer = Players[0];
    }
  };

  const getActivePlayer = () => activePlayer;

  const printNewRoundConsole = () => {
    board.printBoardConsole();
    console.log(`${getActivePlayer().name} it's your turn`);
  };

  const restartGame = () => {
    console.log("The game has restarted!!, printing the new board");

    board.clearBoard();
    gameFinished = false;
    activePlayer = Players[0];
    printNewRoundConsole();
  };

  const playRound = (row, column) => {
    if (gameFinished === true) {
      console.log(`The game finished, ${getActivePlayer().name} wins!`);
      return;
    }
    console.log(
      `${
        getActivePlayer().name
      } made his choice in postion row: ${row} and column: ${column}`
    );
    board.dropToken(row, column, getActivePlayer().token);

    const winningCondition = () => {
      let winState = false;
      const Cell = board.getBoard();
      for (let i = 0; i < 3; i++) {
        if (
          Cell[i][0] !== 0 &&
          Cell[i][0] === Cell[i][1] &&
          Cell[i][0] === Cell[i][2]
        ) {
          console.log(`${getActivePlayer().name} hai il pipo in orrizontale`);
          winState = true;
          board.printBoardConsole();
        } else if (
          Cell[0][i] !== 0 &&
          Cell[0][i] === Cell[1][i] &&
          Cell[0][i] === Cell[2][i]
        ) {
          console.log("Hai il pipo in verticale");
          winState = true;
          board.printBoardConsole();
        }
      }
      if (
        (Cell[1][1] !== 0 &&
          Cell[0][0] === Cell[1][1] &&
          Cell[0][0] === Cell[2][2]) ||
        (Cell[1][1] !== 0 &&
          Cell[0][2] === Cell[1][1] &&
          Cell[0][2] === Cell[2][0])
      ) {
        console.log("Hai il pipo in diagonale");
        winState = true;
        board.printBoardConsole();
      }
      const getState = () => winState;
      return { getState };
    };

    const winCheck = winningCondition();
    if (winCheck.getState() === true) {
      return (gameFinished = true);
    }
    switchActivePlayer();
    printNewRoundConsole();
  };
  printNewRoundConsole();

  const checkGame = () => {
    if (gameFinished === true) {
      restartGame();
    }
  };

  return {
    playRound,
    getActivePlayer,
    restartGame,
    checkGame,
  };
}

const gameControls = GameMechs();
const round = gameControls.playRound;

// first example match
round(1, 2);
round(2, 1);
round(1, 1);
round(2, 2);
round(1, 0);

gameControls.checkGame();

// second example match
round(1, 2);
round(2, 1);
round(1, 1);
round(2, 2);
round(1, 0);

gameControls.checkGame();

round(1, 1); // if player make wrong choice dont let him skip the round
