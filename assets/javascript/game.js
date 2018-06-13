// JavaScript for Word Guess Game

// *** Controller ***
// The controller provides an interface between the Model and the View
//
wggController = {
    displayWins: function(wins) {
        elt = document.getElementById("winsDisplay");
        elt.innerHTML = wins;
    },
    displayCurrentWord: function(currentWord) {
        elt = document.getElementById("currentWordDisplay");
        elt.innerHTML = currentWord;
    },
    displayGuessesLeft: function(guessesLeft) {
        elt = document.getElementById("guessesLeftDisplay");
        elt.innerHTML = guessesLeft;
    },
    displayLettersGuessed: function(lettersGuessed) {
        elt = document.getElementById("lettersGuessedDisplay");
        elt.innerHTML = lettersGuessed;
    }
};

// *** Model ***
// Data structures and corresponding logic for the game
// Interacts with View through the Controller
wggModel = {
    wins : 0,               // # of wins
    currentWord: "yoyo",    // current word with blanks for (as of yet) unguessed letters
    guessesLeft: 14,        // # of guess left 
    lettersGuessed: [],     // letters guessed (all letters, right or wrong)
    initialize: function() {
        this.wins = 0;
        this.currentWord = "NoWordYet";
        this.guessesLeft = 15;
        this.lettersGuessed = [];
        this.ui = wggController;
        this.displayAll();
    },
    displayAll: function() {
        this.ui.displayWins(this.wins);
        this.ui.displayCurrentWord(this.currentWord);
        this.ui.displayGuessesLeft(this.guessesLeft);
        this.ui.displayLettersGuessed(this.lettersGuessed);
    },
};

wggModel.initialize();