/*<
 * Create a list that holds all of your cards
 */

 // 8 pairs of cards, 16 total cards
 var cards = ['fa-diamond', 'fa-diamond',
              'fa-paper-plane-o', 'fa-paper-plane-o',
              'fa-anchor', 'fa-anchor',
              'fa-bolt', 'fa-bolt',
              'fa-cube', 'fa-cube',
              'fa-leaf', 'fa-leaf',
              'fa-bicycle', 'fa-bicycle',
              'fa-birthday-cake', 'fa-birthday-cake'];
var openCards = [];
var numMoves = 0;

drawCards();

/*
 * Display the cards on the page
 */
function drawCards () {
  /* Shuffle the list of cards */
   cards = shuffle(cards);
   console.log(cards);

   /* Loop through each card and create its HTML */
   /* Add each card's HTML to the page */
   cards.forEach(function(card, index) {
     console.log(card);
     console.log(index);
     $('.deck').append(`<li class="card" card-id=${index} symbol=${card}><i class="fa ${card}" ></i></li>`);
   });

   /* set up the event listener for a card. */
   $('.card').click(handleCardClick);
}

/*If a card is clicked:
*  - display the card's symbol (put this functionality in another function that you call from this one)
*  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
*  - if the list already has another card, check to see if the two cards match
*    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
*    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
*    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
*    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
*/
function handleCardClick (event) {
  openCards.push({id: $(this).attr('card-id'),
                    symbol: $(this).attr('symbol')});
  console.log(openCards);

  //open the card that was clicked on
  $(this).addClass('open show');

  if (openCards.length === 2) {
    if (cardsMatch()) {
      lockOpenCards();
    } else {
      var card1 = openCards[0];
      var card2 = openCards[1];

      /* Wait half a second before hikind the nonmatching cards */
      setTimeout(function () {
        hideNonmatchingCards(card1, card2);
      }, 500);
    }

    // clear out the list of open cards
    openCards = [];

    // increment the move counter and display it on the page
    incrementNumMoves();
  }

  //if the number of open cards is 16 the game is over
  checkGameWon();
};

function cardsMatch () {
  if ((openCards[0].id !== openCards[1].id) &&
      (openCards[0].symbol === openCards[1].symbol)) {
    return true;
  } else {
    return false;
  }
};

function lockOpenCards () {
  // + if the cards do match, lock the cards in the open position (put this
  //functionality in another function that you call from this one)
  $('.card').filter(function (index) {
    return $(this).attr('symbol') === openCards[0].symbol;
  }).addClass('match');
};

function hideNonmatchingCards (card1, card2) {
  /* if the cards do not match, remove the cards from the list and hide the
   * card's symbol
   */
  $('.card').filter(function (index) {
    return $(this).attr('symbol') === card1.symbol;
  }).removeClass('open show');

  $('.card').filter(function (index) {
    return $(this).attr('symbol') === card2.symbol;
  }).removeClass('open show');
};

function incrementNumMoves () {
  numMoves += 1;
  $('.moves').text(numMoves);
}

function checkGameWon() {
  if ($('.card.open').length === 16) {
    //display congratulations message
    $('.message').text(`Congratulations! You won the game in ${numMoves} moves!`);
  }
};

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
