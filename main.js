(function () {
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

    //* Method to place player marker
    const dropToken = (row, column, player) => {
      if (board[row][column].getValue() === 0) {
        board[row][column].addToken(player);
      }
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

    const checkFilledBoard = () => {
      const boardValues = getBoard();
      const filledBoard = boardValues.every((row) =>
        row.every((cell) => cell !== 0)
      );

      return filledBoard;
    };

    return {
      dropToken,
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

  function GameMechs(playerOneName, playerTwoName) {
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

    let activePlayer; //* Variable to track active player

    const chooseRandomPlayer = () => {
      let randomNumber = Math.floor(Math.random() * 2);
      if (randomNumber >= 1) {
        activePlayer = Players[0];
      } else {
        activePlayer = Players[1];
      }
    };
    chooseRandomPlayer();

    const getActivePlayer = () => activePlayer;

    let gameFinished = false; //* Variable to check the status of the game

    const switchActivePlayer = () => {
      if (activePlayer === Players[0]) {
        activePlayer = Players[1];
      } else {
        activePlayer = Players[0];
      }
    };

    //* Method to get name and points of the players
    const getPlayerInfo = () => {
      const playerOneName = () => Players[0].name;
      const playerTwoName = () => Players[1].name;
      const playerOnePoints = () => Players[0].points;
      const playerTwoPoints = () => Players[1].points;
      return { playerOneName, playerTwoName, playerOnePoints, playerTwoPoints };
    };

    const addPoints = (player) => {
      player.points += 1;
    };

    const restartGame = () => {
      board.clearBoard();
      gameFinished = false;
      chooseRandomPlayer();
      displayLogicDOM();
    };

    const playRound = (row, column) => {
      //* Condition that returns if the selected cell has a value stored already
      if (board.getBoard()[row][column] !== 0) {
        return;
      }
      board.dropToken(row, column, getActivePlayer().token); //* Applies player's marker to selected cell
      const Cell = board.getBoard();
      const DOM = displayLogicDOM();
      DOM;

      const winningCondition = () => {
        let winState = false;

        for (let i = 0; i < 3; i++) {
          //* Horizontal check
          if (
            Cell[i][0] !== 0 &&
            Cell[i][0] === Cell[i][1] &&
            Cell[i][0] === Cell[i][2]
          ) {
            winState = true;
          }
          //* Vertical check
          else if (
            Cell[0][i] !== 0 &&
            Cell[0][i] === Cell[1][i] &&
            Cell[0][i] === Cell[2][i]
          ) {
            winState = true;
          }
        }
        //* Diagonal check
        if (
          (Cell[1][1] !== 0 &&
            Cell[0][0] === Cell[1][1] &&
            Cell[0][0] === Cell[2][2]) ||
          (Cell[1][1] !== 0 &&
            Cell[0][2] === Cell[1][1] &&
            Cell[0][2] === Cell[2][0])
        ) {
          winState = true;
        }
        const getState = () => winState;
        return { getState };
      };

      const winCheck = winningCondition();
      //* Checks if the winning condition is met, if not (board is full) restarts the game
      if (winCheck.getState() === true) {
        gameFinished = true;
        return { gameFinished };
      } else if (board.checkFilledBoard() === true) {
        DOM.createStaleMessage();
        DOM.disableCells();

        function delayedRestart() {
          restartGame();
          DOM.enableResetButton();
          displayLogicDOM();
        }
        setTimeout(delayedRestart, 2000);
      }

      switchActivePlayer();
      DOM.colorMaker();
    };

    //* Checks the state of the game, then restarts
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
      getPlayerInfo,
      getCell,
      getGameStatus,
    };
  }

  let gameControls = GameMechs("PlayerOne", "PlayerTwo"); //* Set initial values to have the methods inside the displayLogic function
  let round = gameControls.playRound;
  let resetListener = null; //* Tracks if the reset button has event listeners

  //* Starts the game when the start button is pressed
  const StartGame = (function () {
    const gameboardDiv = document.querySelector("#gameContainer");
    const inputDiv = document.querySelector("#inputContainer");

    const playerOne = document.querySelector(".input-1");
    const playerTwo = document.querySelector(".input-2");

    const startButton = document.querySelector("#start");
    startButton.addEventListener("click", () => {
      const checkPlayerName = () => {
        if (playerOne.value === "") {
          playerOne.value = "Player One";
        }
        if (playerTwo.value === "") {
          playerTwo.value = "Player Two";
        }
      };
      checkPlayerName();

      gameControls = GameMechs(playerOne.value, playerTwo.value);
      round = gameControls.playRound;
      displayLogicDOM();
      gameboardDiv.removeAttribute("class");
      inputDiv.setAttribute("class", "hidden");
    });
  })();

  const displayLogicDOM = () => {
    const playerInfo = gameControls.getPlayerInfo();

    const boardValues = gameControls.getCell();

    const displayGameBoard = document.querySelector("#gameBoard");
    const playerWrapper = document.querySelector("#player-wrapper");
    const resetButton = document.querySelector("#reset");

    playerWrapper.innerHTML = "";
    displayGameBoard.innerHTML = "";

    //* Creates the board inside the DOM and assigns the corresponding marker
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
              displayCell.setAttribute("sign", "cross");
            } else if (boardValues[i][j] === "2") {
              displayCell.textContent = "O";
              displayCell.setAttribute("sign", "circle");
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

    if (resetListener) {
      resetButton.removeEventListener("click", resetListener);
    }

    resetListener = () => {
      gameControls.restartGame();
    };

    resetButton.addEventListener("click", resetListener);

    //* Method to make the board reactive to the clicks
    const cell = document.querySelectorAll(".cell");
    cell.forEach((item) => {
      item.addEventListener("click", () => {
        const row = item.getAttribute("row");
        const column = item.getAttribute("column");

        round(row, column);
        //* Condition to meet in order to end the round and restart the game
        if (gameControls.getGameStatus() === true) {
          roundWin();
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

    //* Function used to create a message when the board is full
    const createStaleMessage = () => {
      const staleMessage = document.createElement("div");
      const playerTwo = document.querySelector(".player:nth-child(2)");
      staleMessage.textContent = "The game is Stuck! restarting...";
      staleMessage.classList.add("staleMessage");
      playerWrapper.insertBefore(staleMessage, playerTwo);
      resetButton.disabled = true;
    };

    const enableResetButton = () => {
      resetButton.disabled = false;
    };

    const disableCells = () => {
      const cells = document.querySelectorAll(".cell");
      cells.forEach((cell) => {
        cell.disabled = true;
      });
    };

    //* Function used to append the players name to the board when the game starts
    const appendPlayers = () => {
      const playerOneWrapper = document.createElement("div");
      const playerTwoWrapper = document.createElement("div");
      const playerOneSign = document.createElement("p");
      const playerTwoSign = document.createElement("p");
      const playerOne = document.createElement("p");
      const playerTwo = document.createElement("p");
      playerOneSign.textContent = "X";
      playerOneSign.setAttribute("class", "cross");
      playerTwoSign.setAttribute("class", "circle");
      playerTwoSign.textContent = "O";
      playerOneWrapper.classList.add("player");
      playerTwoWrapper.classList.add("player");
      playerOne.textContent = `${playerInfo.playerOneName()}: ${playerInfo.playerOnePoints()}`;
      playerTwo.textContent = `${playerInfo.playerTwoName()}: ${playerInfo.playerTwoPoints()}`;
      playerOneWrapper.appendChild(playerOne);
      playerOneWrapper.appendChild(playerOneSign);
      playerTwoWrapper.appendChild(playerTwo);
      playerTwoWrapper.appendChild(playerTwoSign);
      playerWrapper.appendChild(playerOneWrapper);
      playerWrapper.appendChild(playerTwoWrapper);
    };
    appendPlayers();

    //* Function used to create the winning player's message
    const roundWin = () => {
      const winningMessage = document.createElement("p");
      const playerTwo = document.querySelector(".player:nth-child(2)");
      winningMessage.classList.add("winningMessage");
      winningMessage.textContent = `${
        gameControls.getActivePlayer().name
      } wins the Round!`;
      playerWrapper.insertBefore(winningMessage, playerTwo);
    };

    //* Function used to improve the readability of the active player
    const colorMaker = () => {
      const playerOneSign = document.querySelector(".cross");
      const playerTwoSign = document.querySelector(".circle");
      if (gameControls.getActivePlayer().name === playerInfo.playerOneName()) {
        playerTwoSign.removeAttribute("active");
        playerOneSign.setAttribute("active", "true");
      } else {
        playerOneSign.removeAttribute("active");
        playerTwoSign.setAttribute("active", "true");
      }
    };
    colorMaker();

    return { createStaleMessage, enableResetButton, disableCells, colorMaker };
  };
})();

//* Probably not the right way to use the IIFE but didn't want to have global variables else i would had to recreate the whole DisplayDom function
