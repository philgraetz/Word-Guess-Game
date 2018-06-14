// JavaScript for Word Guess Game

// Event function for key press
document.onkeyup = function(event) {
    // Call the callback function in the controller
    wggController.processKeyPress(event.key);
}

// *** Controller ***
// The Controller (wggConroller object) provides an
// interface between the Model (wggModel)
// and the View (index.html).
// It also has the business logic of the game
//
wggController = {
    // Initialize the structures
    // Called when page is first displayed
    initialize: function() {
        this.waitingForStart = true;
        this.displayStatus("If you could just go ahead and press any key, that'd be great...");
        this.model = wggModel;
        this.model.initialize();
    },

    // Display Methods
    displayStatus: function (message) {
        document.getElementById("statusDisplay").innerText = message;
    },
    displayWins: function(wins) {
        var elt = document.getElementById("winsDisplay");
        elt.innerHTML = wins;
    },
    displayCurrentWord: function(currentWord) {
        var elt = document.getElementById("currentWordDisplay");
        s1 = "";
        for (var i in currentWord) {
            if (i > 0) {
                s1 += " "; // Add space between
            }
            if (currentWord[i] === " ") {
                s1 += "_";
            } else {
                s1 += currentWord[i];
            }
        }
        elt.innerHTML = s1;
    },
    displayGuessesLeft: function(guessesLeft) {
        var elt = document.getElementById("guessesLeftDisplay");
        elt.innerHTML = guessesLeft;
    },
    displayGuessedLetters: function(letterArray) {
        // Create a string with letters in order and blanks
        // for letters not yet guessed (and spaces between each position)
        // Requires setting 'innerHTML' (because we're using HTML symbols)
        // and using '&nbsp;' for spaces (otherwise spaces will collapse)
        
        // First create string with spaces
        var s1 = ". ".repeat(25); // 2 spaces for 1st 25 letters
        s1 += " ";                // 1 space for final letter

        // Replace the space with the letter in its appropriate position
        for (var letterIndex in letterArray) {
            var upr = letterArray[letterIndex].toUpperCase();
            var charCode = upr.charCodeAt(0);
            var index = charCode - 65; // since "A" is char code 65
    
            // Replace the appropriate space with this letter
            s1 = s1.slice(0, index*2) + upr + s1.slice(index*2+1);
        }

        // Replace all the spaces with '&nbsp;'
        s1 = s1.replace(/ /g, "&nbsp;");

        // Now we can display it
        var elt = document.getElementById("guessedLettersDisplay");
        elt.innerHTML = s1;
    },

    // Start new game
    // (after player presses ANY key)
    startNewGame: function() {
        this.waitingForStart = false;
        this.displayStatus("Guess a letter");
        this.model.startNewGame();

        // And now we are driven by user input
        // IOW, we will do nothing until a ke is pressed
    },

    // Process the key that was pressed
    // (Callback function from document event)
    processKeyPress: function(key) {
        // A key was pressed - do something

        // If we're waiting to start the game,
        // then someone pressed the ANY key.
        // Start the new game and return.
        if (this.waitingForStart) {
            this.startNewGame();
            return;
        }

        // Ignore "Shift", "Enter", etc
        if (key.length !== 1) {
            return;
        }

        // Check for letters a-z
        patt = /^[a-z]$/i;
        if (!patt.test(key)) {
            var statusMsg = "'" + key + "' is not a letter. What would you say...you do here?";
            this.displayStatus(statusMsg);
            return;
        }

        // Did you already guess this letter?
        if (this.model.isAlreadyGuessed(key)) {
            var statusMsg = "Letter '" + key + "' was already guessed. Did you get the memo?";
            this.displayStatus(statusMsg);
            return;
        }

        // Otherwise this is a letter guess
        this.model.guessThisLetter(key);

        // Is game over?
        if (this.model.checkForDone()) {
            if (this.model.checkForWon()) {
                this.displayStatus("You won! Press ANY key for new game.");
            }
            else {
                this.displayStatus("You lost! Is today the worst day of your life?");
            }
            // Now wait to start a new game 
            // (by pressing the ANY key again)
            this.waitingForStart = true;
        }
        else {
            this.displayStatus("Guess a letter");
        }
    }
};

// *** Model ***
// Data structures and corresponding logic for the game
// Interacts with View through the Controller
wggModel = {
    // Initialize the structues
    initialize: function() {
        this.wins = 0;             // # of wins
        this.wordToGuess = "";     // Word the player is attempting to figure out
        this.currentWord = "";     // current word with blanks for unguessed letters
        this.guessesLeft = 15;     // # of guess left 
        this.guessedLetters = [];  // letters guessed (all letters, right or wrong)
        this.isDone = false;
        this.isWon = false;
        this.ui = wggController;   // interface to the ui
        this.displayAll();
    },
    
    // Display all the "game" displays
    displayAll: function() {
        this.ui.displayWins(this.wins);
        this.ui.displayCurrentWord(this.currentWord);
        this.ui.displayGuessesLeft(this.guessesLeft);
        this.ui.displayGuessedLetters(this.guessedLetters);
    },

    // Start a new game
    startNewGame: function() {
        this.guessesLeft = 15;
        this.guessedLetters = [];
        this.isDone = false;
        this.isWon = false;

        // Pick a word
        this.wordToGuess = this.getWord();

        // Set currentWord to the correct length of blanks.
        this.currentWord = "_".repeat(this.wordToGuess.length);

        // Display refresh
        this.displayAll();
    },

    // Check to see if letter is already guessed
    isAlreadyGuessed: function (key) {
        var upperLetter = key.toUpperCase();
        if (this.guessedLetters.indexOf(upperLetter) >= 0) {
            return true;
        }
        return false;
    },

    // Are we done yet?
    checkForDone: function() {
        return this.isDone;
    },

    // Did we win?
    checkForWon: function() {
        return this.isWon;
    },

    // Is this letter in the word?
    checkGuessedLetter: function(upperLetter) {
        var upperWord = this.wordToGuess.toUpperCase();
        var idx = upperWord.indexOf(upperLetter);

        // Check if we found the letter in the word.
        // Repeat for every instance of this letter.
        while (idx >= 0) {
            // Replace _ at this index with letter from wordToGuess
            this.currentWord = this.currentWord.slice(0,idx) + 
                                this.wordToGuess.slice(idx,idx+1) + 
                               this.currentWord.slice(idx+1);

            // If there's no _'s left, we're done
            if (this.currentWord.indexOf("_") < 0) {
                this.isWon = true;
                this.isDone = true;
                this.wins++;
                break; // From while
            }

            // Check for another instance of this letter
            idx = upperWord.indexOf(upperLetter, idx+1);
        }
    },

    // Called by controller when a letter is guessed
    guessThisLetter: function(key) {
        var upperLetter = key.toUpperCase();
        this.guessesLeft--;

        // Save it in the list of guessed letters
        this.guessedLetters.push(upperLetter);

        // Check the guessed letter against the word
        this.checkGuessedLetter(upperLetter);

        // Are we out of guesses?
        if (this.guessesLeft === 0) {
            this.isDone = true;
        }

        // Refress the display for anything that changed
        this.displayAll();
    },

    // Randomly pick a word to guess from list
    getWord: function() {
        var words = [
            "Stapler",
            "Milton",
            "Peter",
            "Lumbergh",
            "Glitch",
            "Flare",
            "Cake",
            "Conclusions",
            "Mondays"
        ];
        var n = Math.floor(Math.random() * words.length);
        return words[n];
    }
};

wggController.initialize();
