// Global constants for the Memory Game.
const MIN_ROWS = 3;
const MIN_COLS = 3;
const MIN_MEMS = 3;
const MAX_ROWS = 7;
const MAX_COLS = 7;
const PERFECT_BONUS = 5;

// Global variables for the Memory Game.
let grid = new Grid(GRID_ID_SEL);
let score = 0;
let perfectTrial = true;
let rotation = 0;
let refreshAudio = new Audio('./audio/refresh.m4a');

/** Begin the Memory Game. */
function play() {
    prepareTrial(MIN_ROWS, MIN_COLS, MIN_MEMS);
    runTrial();
}

/**
 * Prepare a single Trial for the game. Initialize the Grid and display it on the screen.
 * @param {number} rows     The number of rows for the Grid.
 * @param {number} cols     The number of columns for the Grid.
 * @param {number} memCount The number of memories for the Grid.
 */
function prepareTrial(rows, cols, memCount) {
    // Each Trial is considered perfect until the user makes a mistake.
    perfectTrial = true;

    refreshAudio.play();
    grid.build(rows, cols, memCount);

    showGrid();
    blinkMemories();
    rotateGrid();

    setTimeout( () => {
        setGridActive();
    }, 2000);
}

/**
 * Main function for the Memory Game. Contains the listeners for each Square in the Grid and 
 * the logic for when they are clicked. Also used to determine when a Trial ends.
 */
function runTrial() {
    $(grid.ID).on('click', SQUARE_CLS_SEL, function(event) {
        let square = grid.getSquareByID($(this).attr('id'));

        if (!square.isClicked) {
            if (squareClicked(square)) {

                // Clicked last memory, trial complete
                if (grid.memories.length === 0) {
                    $(this).addClass(CLICKED_CLS_NAME).addClass(CLICKED_MEM_LAST_CLS_NAME).html(CHECK_ICON);
                    $(this).off(event);
                    setGridInactive();
    
                    processTrial();
                }
                // Clicked memory
                else {
                    $(this).addClass(CLICKED_CLS_NAME).addClass(CLICKED_MEM_CLS_NAME);
                }
            }
            // Clicked wrong
            else {
                $(this).addClass(CLICKED_CLS_NAME).addClass(CLICKED_WRONG_CLS_NAME).html(X_ICON);
            }
        }
    });
}

/**
 * Process the results of a Trial. Will determine if the next trial will be harder 
 * or easier, and also if the user has won or lost the game.
 */
function processTrial() {
    let newRows = grid.rows;
    let newCols = grid.cols;

    // Scale up
    if (perfectTrial) {
        score += PERFECT_BONUS;
        updateScore(score);

        switch (Math.floor(Math.random() * 2)) {
            case 0:
                // Rows is not maxed, increase rows
                if ((newRows + 1) <= MAX_ROWS) {
                    newRows++;
                }
                // Rows is maxed but cols is not, increase cols
                else if ((newCols + 1) <= MAX_COLS) {
                    newCols++;
                }
                // Everything is maxed, you win
                else {
                    gameOver();
                } 
                break;
            
            case 1:
                // Cols is not maxed, increase cols
                if ((newCols + 1) <= MAX_COLS) {
                    newCols++;
                }
                // Cols is maxed but rows is not, increase rows
                else if ((newRows + 1) <= MAX_ROWS) {
                    newRows++;
                }
                // Everything is maxed, you win
                else {
                    gameOver();
                }
                break;
        }

        setTimeout( () => {
            prepareTrial(newRows, newCols, calcMemories(newRows, newCols));
            runTrial();
        }, 1000);
    }
    else {
        // Gameover
        if (score <= 0) {
            setTimeout( () => { 
                gameOver();
            }, 1000);
        }
        // Scale down
        else {
            switch (Math.floor(Math.random() * 2)) {
                case 0:
                    // Rows is above min, decrease rows
                    if ((newRows - 1) >= MIN_ROWS) {
                        newRows--;
                    }
                    // Rows is min but cols is not, decrease cols
                    else if ((newCols - 1) >= MIN_COLS) {
                        newCols--;
                    }
                    break;
                
                case 1:
                    // Cols is above min, decrease cols
                    if ((newCols - 1) >= MIN_COLS) {
                        newCols--;
                    }
                    // Cols is min but rows is not, decrease rows
                    else if ((newRows - 1) >= MIN_ROWS) {
                        newRows--;
                    }
                    break;
            }
        }

        setTimeout( () => {
            prepareTrial(newRows, newCols, calcMemories(newRows, newCols));
            runTrial();
        }, 1000);
    }
}

/**
 * Set a square clicked and update the score.
 * @param {square} square The square that has been clicked.
 * @return {boolean} True if the square clicked was a memory, false otherwise.
 */
function squareClicked(square) {
    if (square.isMemory) {
        grid.removeMemory(square);
        grid.setSquareClicked(square);
        updateScore(++score);

        return true;
    }
    else {
        grid.setSquareClicked(square);
        perfectTrial = false;
        updateScore(--score);

        return false;
    }
}

/**
 * Calculate the number of memories to have in the Grid based on it's rows and columns.
 * @param {number} rows The number of rows in the Grid.
 * @param {number} cols The number of columns in the Grid.
 */
function calcMemories(rows, cols) {
    return Math.floor((rows*cols) / 3);
}

/** Display the Grid on the screen. */
function showGrid() {
    $(grid.ID).empty();

    for (let i = 0; i < grid.rows; i++) {
        for (let j = 0; j < grid.cols; j++) {
            $(grid.ID).append(grid.squares[i][j].html);
        }
    }

    $(grid.ID).css("height", grid.height).css("width", grid.width);
}

/** Briefly highlight the memory squares on the screen. */
function blinkMemories() { 
    setTimeout( () => {
        for (let i = 0; i < grid.memories.length; i++) {
            $(grid.memories[i].ID).addClass(MEM_CLS_NAME);
        }
    }, 500);

    setTimeout( () => {
        for (let i = 0; i < grid.memories.length; i++) {
            $(grid.memories[i].ID).removeClass(MEM_CLS_NAME);
        }
    }, 1000);
}

/** Rotate the grid 90 degrees clockwise on the screen. */
function rotateGrid() {
    rotation += 90;
    setTimeout( () => {
        $(grid.ID).css('transform', 'rotate(' + rotation + 'deg)').css('transition', 'transform 500ms ease-in-out');
    }, 1500);

    $(grid.ID).children().css('transform', 'rotate(-' + rotation + 'deg)');
}

/** Allow the user to click on the Grid. */
function setGridActive() {
    $(grid.ID).children().removeClass(INACTIVE_CLS_NAME);
}

/** Stop the user from clicking on the Grid. */
function setGridInactive() {
    $(grid.ID).children().addClass(INACTIVE_CLS_NAME);
}

/** Update the score display. */
function updateScore(score) {
    $(SCORE_ID_SEL).html(score);
}

/** Save the user's score into local storage and direct them to the summary page. */
function gameOver() {
    localStorage.setItem(SCORE_LS_NAME, score);
    window.open(SUMMARY_PATH,'_self');
}

/** Begin the Memory game when the play button is clicked. */
$(PLAY_ID_SEL).click(function() {
    play();
    $(this).remove();
    $(SCORE_LBL_ID_SEL).css('visibility', 'visible');
    $(TERM_ID_SEL).css('visibility', 'visible');
});

/** End the memory game when the terminate button is clicked. */
$(TERM_ID_SEL).click(function() {
    gameOver();
});