let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset");
let newGame = document.querySelector("#newbtn");
let msgCont = document.querySelector(".msgContainer");
let msg = document.querySelector("#msg");
let gameModeRadios = document.querySelectorAll('input[name="gameMode"]');
let turnIndicator = document.querySelector("#turnIndicator");

let turnO = true;
let gameMode = "human"; // default game mode

const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

const resetGame = () => {
  turnO = true;
  enableBoxes();
  clearWinningBoxes();
  msgCont.classList.add("hide");
  msgCont.classList.remove("show");
  updateTurnIndicator();
  if (gameMode === "ai" && !turnO) {
    aiMove();
  }
};

const disableBoxes = () => {
  for (let box of boxes) {
    box.disabled = true;
  }
};

const enableBoxes = () => {
  for (let box of boxes) {
    box.disabled = false;
    box.innerText = "";
  }
};

const clearWinningBoxes = () => {
  for (let box of boxes) {
    box.classList.remove("winning-box");
  }
};

const checkWinner = () => {
  for (let pattern of winPatterns) {
    let pos1val = boxes[pattern[0]].innerText;
    let pos2val = boxes[pattern[1]].innerText;
    let pos3val = boxes[pattern[2]].innerText;

    if (pos1val !== "" && pos2val !== "" && pos3val !== "") {
      if (pos1val === pos2val && pos2val === pos3val) {
        highlightWinningBoxes(pattern);
        showWinner(pos1val);
        return pos1val;
      }
    }
  }
  // Check for draw
  if ([...boxes].every((box) => box.innerText !== "")) {
    showWinner("draw");
    return "draw";
  }
  return null;
};

const highlightWinningBoxes = (pattern) => {
  for (let index of pattern) {
    boxes[index].classList.add("winning-box");
  }
};

const showWinner = (winner) => {
  msg.innerText = winner === "draw" ? "It's a draw!" : `Congratulations, winner is ${winner}`;
  msgCont.classList.remove("hide");
  msgCont.classList.add("show");
  disableBoxes();
};

const updateTurnIndicator = () => {
  if (msgCont.classList.contains("hide") === false) {
    turnIndicator.innerText = "";
  } else {
    turnIndicator.innerText = `Turn: ${turnO ? "O" : "X"}`;
  }
};

const minimax = (board, isMaximizing) => {
  let winner = checkWinnerForMinimax(board);
  if (winner !== null) {
    if (winner === "O") return -10;
    else if (winner === "X") return 10;
    else if (winner === "draw") return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "X";
        let score = minimax(board, false);
        board[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "O";
        let score = minimax(board, true);
        board[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};

const checkWinnerForMinimax = (board) => {
  for (let pattern of winPatterns) {
    let pos1val = board[pattern[0]];
    let pos2val = board[pattern[1]];
    let pos3val = board[pattern[2]];

    if (pos1val !== "" && pos2val !== "" && pos3val !== "") {
      if (pos1val === pos2val && pos2val === pos3val) {
        return pos1val;
      }
    }
  }
  if (board.every((cell) => cell !== "")) {
    return "draw";
  }
  return null;
};

const aiMove = () => {
  let board = [...boxes].map((box) => box.innerText);
  let bestScore = -Infinity;
  let move = -1;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = "X";
      let score = minimax(board, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  if (move !== -1) {
    boxes[move].innerText = "X";
    boxes[move].disabled = true;
    turnO = true;
    updateTurnIndicator();
    checkWinner();
  }
};

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (box.innerText !== "" || msgCont.classList.contains("hide") === false) return;

    if (gameMode === "human") {
      if (turnO) {
        box.innerText = "O";
        turnO = false;
      } else {
        box.innerText = "X";
        turnO = true;
      }
      box.disabled = true;
      updateTurnIndicator();
      let winner = checkWinner();
      if (!winner) return;
    } else if (gameMode === "ai") {
      if (turnO) {
        box.innerText = "O";
        box.disabled = true;
        turnO = false;
        updateTurnIndicator();
        let winner = checkWinner();
        if (winner) return;
        aiMove();
      }
    }
  });
});

gameModeRadios.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    gameMode = e.target.value;
    resetGame();
  });
});

newGame.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);
