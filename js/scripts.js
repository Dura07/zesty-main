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






  

  



// Dice Game
 function rollDice() {
      const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
      const roll1 = Math.floor(Math.random() * 6);
      const roll2 = Math.floor(Math.random() * 6);

      document.getElementById("player1").textContent = diceFaces[roll1];
      document.getElementById("player2").textContent = diceFaces[roll2];

      const resultText = document.getElementById("resultText");
      if (roll1 > roll2) {
        resultText.textContent = "🏆 Player 1 wins!";
      } else if (roll2 > roll1) {
        resultText.textContent = "🏆 Player 2 wins!";
      } else {
        resultText.textContent = "🤝 It's a tie!";
      }
    }

// Rock Paper Scissors
// function playRPS(playerChoice) {
//   const choices = ["rock", "paper", "scissors"];
//   const compChoice = choices[Math.floor(Math.random() * 3)];

//   let result = "";
//   if (playerChoice === compChoice) result = "It's a tie!";
//   else if (
//     (playerChoice === "rock" && compChoice === "scissors") ||
//     (playerChoice === "paper" && compChoice === "rock") ||
//     (playerChoice === "scissors" && compChoice === "paper")
//   ) result = `You win! Computer chose ${compChoice}`;
//   else result = `You lose! Computer chose ${compChoice}`;

//   document.getElementById("rpsResult").textContent = result;
// }

// Guess the Number
// const secretNumber = Math.floor(Math.random() * 10) + 1;
// function checkGuess() {
//   const guess = Number(document.getElementById("guessInput").value);
//   const result = guess === secretNumber ? "Correct!" : "Try again!";
//   document.getElementById("guessResult").textContent = result;
// }

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

