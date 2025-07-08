document.addEventListener("DOMContentLoaded", function () {
    const menuBtn = document.getElementById("menu-btn");
    const menu = document.querySelector("ul");

    menuBtn.addEventListener("click", function () {
        menu.classList.toggle("active");
    });

    // Enable dropdown toggle on mobile
    const dropdowns = document.querySelectorAll("ul li.has-dropdown > a");

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener("click", function (e) {
            e.preventDefault(); // Prevent default link behavior
            this.nextElementSibling.classList.toggle("show-dropdown");
        });
    });
});


//toggleDropdown //


function toggleDropdown(id) {
    // Close any other open dropdowns
    document.querySelectorAll(".dropdown").forEach(menu => {
        if (menu.id !== id) {
            menu.classList.remove("show");
        }
    });

    // Toggle the selected dropdown
    document.getElementById(id).classList.toggle("show");
}

// Close dropdown if clicked outside
document.addEventListener("click", function(event) {
    let isDropdownBtn = event.target.matches(".dropdown-btn") || event.target.closest(".dropdown-btn");
    let isDropdownMenu = event.target.closest(".dropdown");

    if (!isDropdownBtn && !isDropdownMenu) {
        document.querySelectorAll(".dropdown").forEach(menu => {
            menu.classList.remove("show");
        });
    }
});




// script for scroll effect


window.addEventListener("scroll", function() {
    let header = document.querySelector(".header");
    if (window.scrollY > 50) { // Adjust threshold as needed
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});



// footer 

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("currentYear").textContent = new Date().getFullYear();
});



//back to top buttton

document.addEventListener("DOMContentLoaded", function () {
    const backToTop = document.getElementById("backToTop");

    window.addEventListener("scroll", function () {
        if (window.scrollY > 200) { // Show button after scrolling 200px
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }
    });

    backToTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});



// LOADER
// Simulate a loading delay

// window.addEventListener("load", function () {
//     const loader = document.getElementById("loader");
//     const content = document.getElementById("content");

//     if (loader) {
//         loader.style.display = "none";
//     }
    
//     if (content) {
//         content.style.display = "block";
//     }
// });

document.addEventListener("DOMContentLoaded", function () {
    const loader = document.getElementById("loader");
    const content = document.getElementById("content");

    if (loader) {
        loader.style.display = "none";
    }
    
    if (content) {
        content.style.display = "block";
    }
});






  

  






// Tic Tac Toe
let tttBoard = Array(9).fill("");
let currentPlayer = "X";
const tttResult = document.getElementById("tttResult");

function renderTTT() {
  const board = document.getElementById("ticTacToe");
  board.innerHTML = "";
  tttBoard.forEach((cell, i) => {
    const div = document.createElement("div");
    div.textContent = cell;
    div.addEventListener("click", () => handleTTTClick(i));
    board.appendChild(div);
  });
}

function handleTTTClick(index) {
  if (tttBoard[index]) return;
  tttBoard[index] = currentPlayer;
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  renderTTT();
  checkTTTWin();
}

function checkTTTWin() {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let combo of wins) {
    const [a,b,c] = combo;
    if (tttBoard[a] && tttBoard[a] === tttBoard[b] && tttBoard[a] === tttBoard[c]) {
      tttResult.textContent = `${tttBoard[a]} wins!`;
      tttBoard = Array(9).fill("");
      return;
    }
  }
}

renderTTT();

// Memory Game
const memoryIcons = ["🍕", "🍕", "🎈", "🎈", "🎉", "🎉", "🎵", "🎵"];
let shuffledIcons = memoryIcons.sort(() => 0.5 - Math.random());
let flipped = [];
let lock = false;

function renderMemory() {
  const grid = document.getElementById("memoryGame");
  grid.innerHTML = "";
  shuffledIcons.forEach((icon, index) => {
    const div = document.createElement("div");
    div.setAttribute("data-icon", icon);
    div.addEventListener("click", () => flipCard(div));
    grid.appendChild(div);
  });
}

function flipCard(card) {
  if (lock || card.classList.contains("flipped")) return;

  card.classList.add("flipped");
  card.textContent = card.dataset.icon;
  flipped.push(card);

  if (flipped.length === 2) {
    lock = true;
    setTimeout(() => {
      if (flipped[0].dataset.icon === flipped[1].dataset.icon) {
        flipped = [];
      } else {
        flipped.forEach(card => {
          card.classList.remove("flipped");
          card.textContent = "";
        });
        flipped = [];
      }
      lock = false;
    }, 800);
  }
}

renderMemory();


// Wheel of Fortune
const wheelCanvas = document.getElementById('wheelCanvas');
const ctx = wheelCanvas.getContext('2d');
const segments = ['Drink Beer', 'Dance Off', 'Soft Drink', 'Double Entry', 'Shots Only', 'Drink Liqour'];
const segmentCount = segments.length;
const anglePerSegment = (2 * Math.PI) / segmentCount;
let currentAngle = 0;
let spinning = false;

function drawWheel() {
  const radius = wheelCanvas.width / 2;
  for (let i = 0; i < segmentCount; i++) {
    const startAngle = i * anglePerSegment;
    const endAngle = startAngle + anglePerSegment;
    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, startAngle, endAngle);
    ctx.fillStyle = i % 2 === 0 ? '#800080' : '#9b30ff';
    ctx.fill();
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(startAngle + anglePerSegment / 2);
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.fillText(segments[i], radius / 2.5, 5);
    ctx.restore();
  }
  // Draw arrow
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.moveTo(radius - 10, 10);
  ctx.lineTo(radius + 10, 10);
  ctx.lineTo(radius, 30);
  ctx.closePath();
  ctx.fill();
}

drawWheel();

function spinWheel() {
  if (spinning) return;
  spinning = true;
  const spins = Math.random() * 3 + 4; // Random spins between 4 and 7
  const finalAngle = spins * 2 * Math.PI;
  const duration = 3000;
  const startTime = performance.now();

  function animateSpin(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // Ease out
    currentAngle = finalAngle * eased;

    ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
    ctx.save();
    ctx.translate(wheelCanvas.width / 2, wheelCanvas.height / 2);
    ctx.rotate(currentAngle);
    ctx.translate(-wheelCanvas.width / 2, -wheelCanvas.height / 2);
    drawWheel();
    ctx.restore();

    if (progress < 1) {
      requestAnimationFrame(animateSpin);
    } else {
      const segmentIndex = Math.floor(((2 * Math.PI - (currentAngle % (2 * Math.PI))) % (2 * Math.PI)) / anglePerSegment);
      document.getElementById('wheelResult').textContent = `You got: ${segments[segmentIndex]}!`;
      spinning = false;
    }
  }

  requestAnimationFrame(animateSpin);
}


function tossCoin() {
  const result = Math.random() < 0.5 ? 'Heads 🟤' : 'Tails ⚫';
  document.getElementById('coinResult').textContent = `Result: ${result}`;
}

// Scroll Trigger Animation
window.addEventListener("scroll", function () {
  const reveals = document.querySelectorAll(".reveal");

  for (let i = 0; i < reveals.length; i++) {
    const windowHeight = window.innerHeight;
    const elementTop = reveals[i].getBoundingClientRect().top;
    const elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    } else {
      reveals[i].classList.remove("active");
    }
  }
});



//sudoku games//

const originalPuzzle = [
  [5, 3, "", "", 7, "", "", "", ""],
  [6, "", "", 1, 9, 5, "", "", ""],
  ["", 9, 8, "", "", "", "", 6, ""],
  [8, "", "", "", 6, "", "", "", 3],
  [4, "", "", 8, "", 3, "", "", 1],
  [7, "", "", "", 2, "", "", "", 6],
  ["", 6, "", "", "", "", 2, 8, ""],
  ["", "", "", 4, 1, 9, "", "", 5],
  ["", "", "", "", 8, "", "", 7, 9]
];

let board = document.getElementById("board");
let timerDisplay = document.getElementById("timer");
let scoreDisplay = document.getElementById("score");
let message = document.getElementById("message");

let startTime, timerInterval, attemptCount = 0;

function createBoard(puzzle) {
  board.innerHTML = "";
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = 1;
      input.className = "cell";

      if (puzzle[row][col] !== "") {
        input.value = puzzle[row][col];
        input.disabled = true;
        input.classList.add("fixed");
      }

      if (col % 3 === 0) input.style.borderLeftWidth = "2px";
      if (row % 3 === 0) input.style.borderTopWidth = "2px";
      if (col === 8) input.style.borderRightWidth = "2px";
      if (row === 8) input.style.borderBottomWidth = "2px";

      input.dataset.row = row;
      input.dataset.col = col;
      board.appendChild(input);
    }
  }
}

function getBoardValues() {
  const inputs = board.querySelectorAll(".cell");
  const values = Array.from({ length: 9 }, () => Array(9).fill(""));

  inputs.forEach(input => {
    const row = parseInt(input.dataset.row);
    const col = parseInt(input.dataset.col);
    values[row][col] = input.value;
  });

  return values;
}

function isValidSudoku(board) {
  const rows = Array.from({ length: 9 }, () => new Set());
  const cols = Array.from({ length: 9 }, () => new Set());
  const boxes = Array.from({ length: 9 }, () => new Set());

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = board[r][c];
      if (val === "") return false;

      const num = parseInt(val);
      if (isNaN(num) || num < 1 || num > 9) return false;

      const boxIndex = Math.floor(r / 3) * 3 + Math.floor(c / 3);

      if (rows[r].has(num) || cols[c].has(num) || boxes[boxIndex].has(num)) {
        return false;
      }

      rows[r].add(num);
      cols[c].add(num);
      boxes[boxIndex].add(num);
    }
  }

  return true;
}

function checkSolution() {
  attemptCount++;
  const boardValues = getBoardValues();
  const isValid = isValidSudoku(boardValues);

  if (isValid) {
    stopTimer();
    message.textContent = `🎉 Correct! Sudoku Solved in ${formatTime()} with ${attemptCount} attempt(s)!`;
    message.style.color = "green";
    updateScore();
  } else {
    message.textContent = `❌ Incorrect. Try again! Attempt #${attemptCount}`;
    message.style.color = "red";
  }
}

function resetBoard() {
  clearInterval(timerInterval);
  startTimer();
  createBoard(originalPuzzle);
  message.textContent = "";
  attemptCount = 0;
  scoreDisplay.textContent = "Score: 0";
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    timerDisplay.textContent = "Time: " + formatTime();
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function formatTime() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const seconds = String(elapsed % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function updateScore() {
  const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
  const score = Math.max(1000 - (elapsedSeconds * 2 + attemptCount * 10), 0);
  scoreDisplay.textContent = `Score: ${score}`;
}

window.onload = () => {
  createBoard(originalPuzzle);
  startTimer();
};


// dice game

function rollDice() {
  const dice1 = document.getElementById("dice1");
  const dice2 = document.getElementById("dice2");
  const result = document.getElementById("result");

  // Apply roll animation
  dice1.classList.add("roll");
  dice2.classList.add("roll");

  setTimeout(() => {
    dice1.classList.remove("roll");
    dice2.classList.remove("roll");

    const roll1 = Math.floor(Math.random() * 6) + 1;
    const roll2 = Math.floor(Math.random() * 6) + 1;

    dice1.src = `images/dice${roll1}.png`;
    dice2.src = `images/dice${roll2}.png`;

    if (roll1 > roll2) {
      result.textContent = "🎉 Player 1 wins!";
    } else if (roll2 > roll1) {
      result.textContent = "🎉 Player 2 wins!";
    } else {
      result.textContent = "🤝 It's a draw!";
    }
  }, 500);
}


// flappy bird clone



