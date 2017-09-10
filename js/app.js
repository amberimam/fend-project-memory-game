 /* 8 pairs of cards, 16 total cards */
 let cards = ['fa-diamond', 'fa-diamond',
              'fa-paper-plane-o', 'fa-paper-plane-o',
              'fa-anchor', 'fa-anchor',
              'fa-bolt', 'fa-bolt',
              'fa-cube', 'fa-cube',
              'fa-leaf', 'fa-leaf',
              'fa-bicycle', 'fa-bicycle',
              'fa-birthday-cake', 'fa-birthday-cake'];
let openCards = [];
let numMoves = 0;
let totalSeconds = 0;
let timer;

setupGame();

/**
 * @description Sets up the game: Shuffles the cards, draws them on the page,
 *              sets up the event listeners on the cards, the event listener
 *              for the restart button and setup the timer to fire every second.
 */
function setupGame() {
  /* Shuffle the list of cards */
  cards = shuffle(cards);

  /* If game is restarted, remove all previous cards */
  $('.deck').empty();

  /* Loop through each card and create its HTML */
  /* Add each card's HTML to the page */
  cards.forEach(function(card, index) {
   $('.deck').append(`<li class="card" card-id=${index} symbol=${card}><i class="fa ${card}" ></i></li>`);
  });

  /* set up the event listener for a card. */
  $('.card').click(handleCardClick);

  /* setup the restart button */
  $('.restart').click(handleRestart);

  /* setup the timer */
  timer = setInterval(countTimer, 1000);
}

/**
 * @description Pads a number to two digits. Pad function and timer function from
 *              https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript
 * @param {number} val
 * @param {string} padded value to two digits
 */
function pad(val) {
  return val > 9 ? val : "0" + val;
}

/**
 * @description Increments the number of seconds and updates the timer on the
 *              page.
 */
function countTimer() {
   ++totalSeconds;
   let minutes = pad(Math.floor(totalSeconds/60));
   let seconds = pad(totalSeconds % 60);

   $(".timer").html(`${minutes}:${seconds}`);
}

/**
 * @description Restarts the game. Closes the cards, clears the timer,
 *              shuffles the cards, and starts the game.
 */
function handleRestart () {
  totalSeconds = 0;
  numMoves = 0;
  $('.moves').text('0');
  $('.card').removeClass('open show match');
  clearInterval(timer);
  $(".timer").html('00:00');
  setupGame();
}

/**
 * @description Handles the game logic when a card is clicked.
 *              If a card is clicked:
 *              - display the card's symbol
 *              - add the card to a *list* of "open" cards
 *              - if the list already has another card, check to see if the two cards match
 *              + if the cards do match, lock the cards in the open position
 *              + if the cards do not match, remove the cards from the list and hide the card's symbol
 *              + increment the move counter and display it on the page
 *              + if all cards have matched, display a message with the final score
 *
 * @param event
 */
function handleCardClick (event) {
  openCards.push({id: $(this).attr('card-id'),
                  symbol: $(this).attr('symbol')});

  /* open the card that was clicked on */
  $(this).addClass('open show');

  if (openCards.length === 2) {
    if ((openCards[0].id == openCards[1].id) &&
        (openCards[0].symbol == openCards[1].symbol)) {
      /* the same exact card was clicked on multiple times so ignore this click */
      openCards.splice(1, 1);
    } else if (cardsMatch()) {
      lockOpenCards();

      openCards = [];
      incrementNumMoves();
      checkGameWon();
    } else {
      let card1 = openCards[0];
      let card2 = openCards[1];

      /* Wait 3/4 of a second before hiding the nonmatching cards */
      setTimeout(function () {
        hideNonmatchingCards(card1, card2);
      }, 750);

      openCards = [];
      incrementNumMoves();
    }
  }
}

/**
 * @description Checks if the cards in the openCards variable have the same
 *              symbol
 * @returns {boolen} True if cards match and false if they don't.
 */
function cardsMatch () {
  if ((openCards[0].id !== openCards[1].id) &&
      (openCards[0].symbol === openCards[1].symbol)) {
    return true;
  } else {
    return false;
  }
}

/**
 * @description Lock currently open cards in the open position because they're
 *              matching.
 */
function lockOpenCards () {
  $('.card').filter(function (index) {
    return $(this).attr('symbol') === openCards[0].symbol;
  }).addClass('match');
}

/**
 * @description Hide the cards that the player just guessed because they do not
 *              match.
 */
function hideNonmatchingCards (card1, card2) {
  $('.card').filter(function (index) {
    return $(this).attr('symbol') === card1.symbol;
  }).removeClass('open show');

  $('.card').filter(function (index) {
    return $(this).attr('symbol') === card2.symbol;
  }).removeClass('open show');
}

/**
 * @description Remove a star from the object with the class that was passed in
 * @param {string} className
 */
function removeStar (className) {
  $(`.${className}`).removeClass('fa-star').addClass('fa-star-o');
}

/**
 * @description Increment the number of moves and remove a star if player has
 *              crossed the threshold for removing a star.
 */
function incrementNumMoves () {
  numMoves += 1;
  $('.moves').text(numMoves);

  if (numMoves > 20) {
    removeStar('second-star');
  } else if (numMoves > 10) {
    removeStar('third-star');
  }
}

/**
 * @description Check if the game was won. If it was won clear the timer and
 *              display a congratulations modal with the number of moves it took
 *              to win the game and the amount of time it took to win the game.
 */
function checkGameWon() {
  if ($('.match').length === 16) {
    clearInterval(timer);

    let minutes = Math.floor(totalSeconds/60);
    let seconds = totalSeconds % 60;
    let numStars = 1;

    if (numMoves <= 10) {
      numStars = 3;
    } else if (numMoves <= 20) {
      numStars = 2;
    }

    /* display congratulations message */
    $('.game-won-text').html(`You won the game in ${minutes} minute(s) and ${seconds} seconds! <br> You earned ${numStars} star(s)! <br><br> Would you like to play again?`);
    $('.modal').modal('show');
  }
}

/**
 * @description Shuffles the cards. Shuffle function from
 *              http://stackoverflow.com/a/2450976
 * @param {array} array
 */
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
