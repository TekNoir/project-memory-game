// Create game variables used globally.
let deck = [
  "fa-anchor",
  "fa-anchor",
  "fa-bicycle",
  "fa-bicycle",
  "fa-bolt",
  "fa-bolt",
  "fa-bomb",
  "fa-bomb",
  "fa-cube",
  "fa-cube",
  "fa-diamond",
  "fa-diamond",
  "fa-leaf",
  "fa-leaf",
  "fa-paper-plane-o",
  "fa-paper-plane-o"
];
let openCards = [];
let matches = 0;
const board = $(".deck");
const stars = $(".fa-star");
let starCount = 3;
const movesText = $(".moves");
let moves = 0;
const timerText = $(".timer");
let seconds = 60;
let gameTimer = undefined;
const restartButton = $(".restart");

// Reset the playing board by shuffling the deck, clearing the board, and repopulating the board.
function reset() {
  deck = shuffle(deck);
  openCards.length = 0;
  matches = 0;
  board.empty();
  stars.addClass("filled");
  starCount = 3;
  movesText.text("0");
  moves = 0;
  seconds = 60;
  timerText.text(seconds);
  for (let card of deck) {
    let deal = `<li class="card"><i class="fa ${card}"></i></li>`;
    board.append(deal);
  }
  gameTimer = setInterval(subtractTime, 1000);
}

// Timekeeping
function subtractTime() {
  seconds--;
  timerText.text(seconds);
  if (seconds === 0) {
    clearInterval(gameTimer);
    lose("You've run out of time!");
  }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Animate card flipping.
function flipCard(card) {
  card.addClass("open show");
  openCards.push(card);
  if (openCards.length === 2) {
    compareCards();
  }
}

// Compare two cards.
function compareCards() {
  if (openCards[0].html() === openCards[1].html()) {
    matchedCards();
  } else {
    mismatchedCards();
  }
}

// Handle matched pairs.
function matchedCards() {
  for (let card of openCards) {
    card.addClass("match animated bounce");
    setTimeout(function() {
      card.removeClass("open show animated bounce");
    }, 600);
    matches++;
  }
  cleanUp();
}

// Handle mismatched pairs.
function mismatchedCards() {
  for (let card of openCards) {
    card.addClass("wrong animated tada");
    setTimeout(function() {
      card.removeClass("open show wrong animated tada");
    }, 600);
  }
  cleanUp();
}

// 12 moves = 3 stars, 16 moves = 2 stars, 20 moves = 1 star, 24 moves = lose
function tallyStars() {
  if (moves === 25) {
    lose("You've used up all your moves!");
  } else if (moves === 21) {
    stars.eq(0).removeClass("filled");
    starCount--;
  } else if (moves === 17) {
    stars.eq(1).removeClass("filled");
    starCount--;
  } else if (moves === 13) {
    stars.eq(2).removeClass("filled");
    starCount--;
  }
}

// Clean up after a move is made.
function cleanUp() {
  openCards.length = 0;
  moves++;
  movesText.text(moves);
  tallyStars();
  if (matches === deck.length) {
    win();
  }
}

function win() {
  clearInterval(gameTimer);
  setTimeout(function() {
    alert(`You won in ${60 - seconds} seconds!\nYou have ${starCount} stars!`);
    playAgain();
  }, 600);
}

function lose(message) {
  clearInterval(gameTimer);
  setTimeout(function() {
    alert(`You lost this time!\n${message}`);
    playAgain();
  }, 600);
}

// Play again?
function playAgain() {
  if (confirm("Would you like to play again?")) {
    reset();
  }
}

// Start the game
$(document).ready(function() {
  // Handle clicking on cards. Disable on open and matched cards.
  board.on("click", "li:not(.open, .match)", function() {
    flipCard($(this));
  });
  // Handle clicking on the restart button.
  restartButton.click(reset);
  // Initialize the board.
  reset();
});
