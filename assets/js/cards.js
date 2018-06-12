var cards = function(game) {};
var timer,
    timerEvent,
    score,
    text,
    textTimeLeft,
    textTimer,
    textWithScoreLine,
    scoreText,
    minOfEquals,
    previousCard,
    openedCards,
    cardsEnabled;

cards.prototype = {
  create: function() {
    this.game.boardWidth = 3;
    this.game.boardHeight = 3;
    this.game.widthOfCard = 120;
    this.game.heightOfCard = 120;
    this.game.board = this.game.add.group();
    this.game.board.x = (this.game.width - this.game.boardWidth * this.game.widthOfCard) / 2;
    this.game.board.y = (this.game.height - this.game.boardHeight * this.game.heightOfCard) / 2;
    text = this.game.add.text(this.game.board.x - 60, this.game.board.y / 2, "let's find 3 equal cards bro!", {
      boundsAlignH: "center",
      boundsAlignV: "middle",
      fill: "black"
    });
    text.setTextBounds(0, 0, this.game.board.x + 150, this.game.y);
    textTimeLeft = this.game.add.text(this.game.board.x + 450, this.game.board.y / 2 - 30, "Time left:", {
      fill: "black"
    });
    textTimer = this.game.add.text(this.game.board.x + 500, this.game.board.y / 2, "01:00", {
      fill: "red"
    });
    score = 0;
    textWithScoreLine = this.game.add.text(100, this.game.board.y / 2 - 30, "Score: ", {
      fill: "black"
    });
    scoreText = this.game.add.text(100, this.game.board.y / 2, score, {
      fill: "green"
    });
    minOfEquals = 3;
    previousCard = -1;
    openedCards = 0;
    cardsEnabled = true;
    timer = this.game.time.create();
    timerEvent = timer.add(Phaser.Timer.SECOND * 60, this.endTimer, this);
    this.placeCards();
    timer.start();
    this.play();
  },

  render: function(){
    if (timer.running) {
      textTimer.setText(this.formatTime(Math.round((timerEvent.delay - timer.ms) / 1000)));
    }
    else {
      textTimer.setText("Time's up!");
      this.gameOver();
    }
  },

  formatTime: function(s) {
    var minutes = "0" + Math.floor(s / 60);
    var seconds = "0" + (s - minutes * 60);
    return minutes.substr(-2) + ":" + seconds.substr(-2);
  },

  gameOver: function() {
    this.game.board.forEach(function(card) {
      card.inputEnabled = false;
    });
  },

  endTimer: function(){
    timer.stop();
  },

  placeCards: function() {
    var len = this.game.boardWidth * this.game.boardHeight;
    var x = 0;
    var y = 0;
    var card = null;

    for (var i = 0; i < len; i++) {
      x = i % this.game.boardWidth;
      y = Math.floor(i / this.game.boardWidth);
      card = this.game.add.sprite(x * 120, y * 120, 'cards', 10);
      card.posX = x;
      card.posY = y;
      card.index = -1;
      card.pushed = false;
      card.hasPic = false;
      card.inputEnabled = true;
      card.events.onInputDown.add(this.onClick, this);
      this.game.board.add(card);
    }
  },

  play: function(){
      this.placePics();
  },

  placePics: function() {
    var card = null;
    var equalPic = Math.floor(Math.random() * 10);
    var equalPicsToPlace = minOfEquals;
    do {
      card = this.game.board.getRandom();
        if (card.hasPic === false) {
          card.index = equalPic;
          card.hasPic = true;
          equalPicsToPlace--;
        }
    } while (equalPicsToPlace > 0);
    var otherPicsToPlace = this.game.boardWidth * this.game.boardHeight - minOfEquals;
    do {
      card = this.game.board.getRandom();
        if (card.hasPic === false) {
          card.index = Math.floor(Math.random() * 10);
          card.hasPic = true;
          otherPicsToPlace--;
        }
    } while (otherPicsToPlace > 0);
  },

  onClick: function(card) {
    if (cardsEnabled) {
      if (openedCards < 3) { //не все карты открыты
        if ((previousCard === -1 || previousCard === card.index) && card.pushed == false) { //правильная карта
          card.frame = card.index;
          openedCards++;
          card.pushed = true;
          previousCard = card.index;
          this.updateGood();
        } else if (card.pushed != true) { // неправильная карта
          cardsEnabled = false;
          card.frame = card.index;
          this.game.time.events.add(Phaser.Timer.SECOND * 0.75, this.closeCards, this);
          openedCards = 0;
          previousCard = -1;
          this.updateBad();
        }
      }
      if (openedCards == 3 && previousCard != -1) { //все карты открыты
          this.game.time.events.add(Phaser.Timer.SECOND * 0.75, this.finish, this);
      }
    }
  },

  updateGood: function() {
    var left =  minOfEquals - openedCards;
    text.setText("great bro " + left + " left");
  },

  updateBad: function() {
    text.setText("really???");
  },

  finish: function() {
    this.unpushAllCards();
    this.updateScore();
    openedCards = 0;
    previousCard = -1;
    this.placeCards();
    this.play();
  },

  unpushAllCards: function() {
    this.game.board.forEach(function(card) {
      card.pushed = false;
    });
  },

  updateScore: function() {
    score++;
    scoreText.setText(score);
  },

  closeCards: function() {
    this.unpushAllCards();
    this.game.board.forEach(function(card) {
      card.frame = 10;
    });
    text.setText("let's find 3 equal cards bro!");
    cardsEnabled = true;
  }
};
