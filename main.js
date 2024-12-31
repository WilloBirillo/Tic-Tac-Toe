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

  //* Method to place marker
  const dropToken = (row, column, player) => {
    if (board[row][column].getValue() === 0) {
      board[row][column].addToken(player);
    }
  };

  const printBoardConsole = () => {
    const boardWithValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithValues);
  };

  //* Method to get the board with the values in the every cell
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

  //! usa un filtro poi usi una costante se il filtro esce che non c' niente o fai un check con un array o direttamente sul filtro setti quella variabile true
  const checkFilledBoard = () => {
    const boardValues = getBoard();
    const filledBoard = boardValues.every((row) =>
      row.every((cell) => cell !== 0)
    );
    if (filledBoard) {
      console.log("stocazzo");
    }
    return filledBoard;
  };

  return {
    dropToken,
    printBoardConsole,
    getBoard,
    clearBoard,
    checkFilledBoard,
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
      points: 0,
    },
    {
      name: playerTwoName,
      token: "2",
      points: 0,
    },
  ];

  const board = GameBoard();

  let activePlayer = Players[0]; //* Starting player is Player ONE

  let gameFinished = false; //* Variable to check the status of the game

  const switchActivePlayer = () => {
    if (activePlayer === Players[0]) {
      activePlayer = Players[1];
    } else {
      activePlayer = Players[0];
    }
  };

  const getActivePlayer = () => activePlayer;

  //* Method to log player points
  const getPlayerPoints = () => {
    for (let i = 0; i < 2; i++) {
      console.log(Players[i].name, Players[i].points);
    }
  };

  const addPoints = (player) => {
    player.points += 1;
  };

  const printNewRoundConsole = () => {
    board.printBoardConsole();
    console.log(`${getActivePlayer().name} it's your turn`);
  };

  const restartGame = () => {
    console.log("The game has restarted!!, printing the new board");
    displayLogicDOM();
    board.clearBoard();
    gameFinished = false;
    activePlayer = Players[0];
    printNewRoundConsole();
  };

  const playRound = (row, column) => {
    console.log(
      `${
        getActivePlayer().name
      } made his choice in postion row: ${row} and column: ${column}`
    );

    if (board.getBoard()[row][column] !== 0) {
      return;
    }
    board.dropToken(row, column, getActivePlayer().token); //* Applies player's marker to selected cell

    const Cell = board.getBoard();
    displayLogicDOM();

    const winningCondition = () => {
      let winState = false;

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
          console.log(`${getActivePlayer().name}Hai il pipo in verticale`);
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
        console.log(`${getActivePlayer().name}Hai il pipo in diagonale`);
        winState = true;
        board.printBoardConsole();
      }
      const getState = () => winState;
      return { getState };
    };

    const winCheck = winningCondition();
    //* Checks if the winning condition is met
    if (winCheck.getState() === true) {
      gameFinished = true;
      return { gameFinished };
    } else if (board.checkFilledBoard() === true) {
      displayLogicDOM().createStaleMessage();
      function delayedRestart() {
        restartGame();
        displayLogicDOM().removeStaleMessage();
        displayLogicDOM();
      }
      setTimeout(delayedRestart, 2000);
    }

    switchActivePlayer();
    printNewRoundConsole();
  };
  printNewRoundConsole();

  //* Method to restart the game in the global scope
  const checkGame = () => {
    if (gameFinished === true) {
      addPoints(activePlayer);

      restartGame();
      displayLogicDOM();
    }
  };
  board.checkFilledBoard();

  const getCell = () => board.getBoard();
  const getGameStatus = () => gameFinished;
  return {
    playRound,
    getActivePlayer,
    restartGame,
    checkGame,
    getPlayerPoints,
    getCell,
    getGameStatus,
  };
}

const gameControls = GameMechs();

const round = gameControls.playRound;

const displayLogicDOM = () => {
  const boardValues = gameControls.getCell();

  const displayGameBoard = document.querySelector("#gameBoard");
  const headerContainer = document.querySelector("#errorMessage");

  displayGameBoard.innerHTML = "";

  const createBoardDOM = () => {
    for (let i = 0; i < 3; i++) {
      const displayRow = document.createElement("div");
      displayRow.classList.add("row");
      for (let j = 0; j < 3; j++) {
        const displayCell = document.createElement("button");

        displayCell.setAttribute("row", i);
        displayCell.setAttribute("column", j);

        const assignSymbols = () => {
          if (boardValues[i][j] === "1") {
            displayCell.textContent = "X";
          } else if (boardValues[i][j] === "2") {
            displayCell.textContent = "O";
          } else {
            displayCell.textContent = "";
          }
        };
        assignSymbols();

        displayCell.classList.add("cell");
        displayRow.appendChild(displayCell);
      }
      displayGameBoard.appendChild(displayRow);
    }
  };
  createBoardDOM();

  const resetButton = document.querySelector("#reset");
  resetButton.addEventListener("click", () => {
    gameControls.restartGame();
  });

  const cell = document.querySelectorAll(".cell");
  cell.forEach((item) => {
    item.addEventListener("click", () => {
      const row = item.getAttribute("row");
      const column = item.getAttribute("column");

      round(row, column);
      if (gameControls.getGameStatus() === true) {
        resetButton.disabled = true;
        disableCells();
        function delayedCheckGame() {
          gameControls.checkGame();
          resetButton.disabled = false;
        }
        setTimeout(delayedCheckGame, 1500);
      }
    });
  });

  const createStaleMessage = () => {
    const staleMessage = document.createElement("div");
    staleMessage.textContent = "The game is Stuck! restarting...";
    staleMessage.classList.add("staleMessage");
    headerContainer.appendChild(staleMessage);
    resetButton.disabled = true;
  };

  const removeStaleMessage = () => {
    const staleMessage = document.querySelector(".staleMessage");
    staleMessage.remove();
    resetButton.disabled = false;
  };

  const disableCells = () => {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.disabled = true;
    });
  };

  const createPlayers = () => {
    const playerOne = document.createElement("p");
    const playerTwo = document.createElement("p");
    playerOne.classList.add("player");
    playerTwo.classList.add("player");
  };
  return { createStaleMessage, removeStaleMessage };
};
displayLogicDOM();
