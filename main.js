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

  return {
    dropToken,
    printBoardConsole,
  };
};

function Cell() {
  let value = 0;
  const addToken = (player) => {
    value = player;
  };
  const getValue = () => value;
  return {
    addToken,
    getValue,
  };
}

function Playes(playerOneName = "Player One", playerTwoName = "Player Two") {
  const Players = [
    {
      name: playerOneName,
      token: "X",
    },
    {
      name: playerTwoName,
      token: "O",
    },
  ];

  const board = GameBoard();

  let activePlayer = Players[0];

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

  const playRound = (row, column) => {
    console.log(
      `${
        getActivePlayer().name
      } made his choice in postion row: ${row} and column: ${column}`
    );
    board.dropToken(row, column, getActivePlayer().token);

    switchActivePlayer();
    printNewRoundConsole();
  };
  printNewRoundConsole();

  return {
    playRound,
    getActivePlayer,
  };
}

const gameControls = Playes();
const round = gameControls.playRound;
round(1, 2);
round(1, 1);
round(1, 1);
