/** Class representing a Grid of Squares. */
class Grid {

    /**
     * Create a empty Grid.
     * @param {string} ID The ID of the Grid. Used for CSS Selection.
     */
    constructor(ID) {
        this.ID = ID;
        this.rows = 0;
        this.cols = 0;
        this.numMemories = 0;
        this.height = 0;
        this.width = 0;

        // Contains all Squares in the Grid.
        this.squares = [];

        // Contains only the Squares that the user will have to memorize and click.
        this.memories = [];
    }

    /**
     * Get the size of the Grid.
     * @return {number} The size, calculated by multiplying the Grid's rows and columns.
     */
    get size() {
        return this.rows*this.cols;
    }

    /**
     * Calculate a single side of the Grid in px.
     * @param {number} num The number of Squares along one side of the Grid.
     * @return {number} The length of one side of the Grid in px.
     */
    calcSide(num) {
        return num*Square.margin + Square.margin + num*Square.size;
    }

    /**
     * Build a new array based off of the memories array, excluding the specified square.
     * @param {square} square The square to be excluded from the new memories array.
     */
    removeMemory(square) {
        let newMemories = [];
        for (let i = 0; i < this.memories.length; i++) {
            if (!this.memories[i].equals(square)) {
                newMemories.push(this.memories[i]);
            }
        }
        this.memories = newMemories;
    }

    /**
     * Create an array of randomly generated Square IDs that will be used as memories.
     * @param {number} num The number of randomly generated Square IDs to create.
     * @return {array[string]} The array of randomly generated Square IDs
     */
    createMemories(num) {
        let randInt = Math.floor((Math.random()) * this.size + 1);
        let memorySquareIDs = [Square.toSquareID(randInt)];

        for (let i = 0; i < num; i++) {
            randInt = Math.floor(Math.random() * this.size + 1);
            let unique = !memorySquareIDs.includes(Square.toSquareID(randInt));

            // Ensures there are no duplicate IDs in the array.
            while (!unique) {
                randInt = Math.floor(Math.random() * this.size + 1);
                unique = !memorySquareIDs.includes(Square.toSquareID(randInt));
            }
            memorySquareIDs[i] = Square.toSquareID(randInt);
        }
        return memorySquareIDs;
    }

    /**
     * Calculate the size of the Grid, determine which Squares will be memories, then populate the Grid with Squares.
     * @param {number} rows        The number of rows in the Grid.
     * @param {number} cols        The number of columns in the Grid.
     * @param {number} numMemories The number of memories in the Grid.
     */
    build(rows, cols, numMemories) {
        this.rows = rows;
        this.cols = cols;
        this.numMemories = numMemories;
        this.height = this.calcSide(this.rows);
        this.width = this.calcSide(this.cols);

        let memoryIDs = this.createMemories(this.numMemories)
        let count = 0;

        // Populates the Grid with Squares
        for (let i = 0; i < this.rows; i++) {
            this.squares[i] = [];
            for (let j = 0; j < this.cols; j++) {
                let square = new Square(++count);

                if (memoryIDs.includes(square.ID)) {
                    square.isMemory = true;
                    this.memories.push(square);
                }
                this.squares[i][j] = square;
            }
        }
    }

    /**
     * Search the Grid for the specified Square and then set that Square to 'clicked'.
     * @param {Square} square The Square to be set to 'clicked'. 
     */
    setSquareClicked(square) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.squares[i][j].equals(square)) {
                    this.squares[i][j].isClicked = true;
                    return;
                }
            }
        }
    }

    /**
     * Search the Grid to find any squares that are mistakes.
     * @return {boolean} True is there is a Square that is a mistake, False otherwise.
     */
    containsMistakes() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.squares[i][j].isMistake) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Search the Grid to find a Square matching the given ID and return it.
     * @param {string} ID The Square ID to find.
     * @return {square} The Square that matches the ID.
     */
    getSquareByID(ID) {
        let square;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                square = this.squares[i][j];
                if (square.equalsID(ID)) {
                    return square;
                }
            }
        }
    }
}

/** Represents a Square that will reside in a Grid */
class Square {

    // Size and margin static values are used for CSS and are in px.
    static size = 50;
    static margin = 1;

    /**
     * Create a Square.
     * @param {number} num The number of Square when counting from left to right on the Grid.
     */
    constructor(num) {
        this.ID = Square.toSquareID(num);
        this.isMemory = false;
        this.isClicked = false;
        this.html = '<div class="square unselectable inactive" id="s' + num + '">&nbsp;</div>';
    }

    /**
     * Get whether the Square is mistake or not.
     * @return {boolean} True if the Square is not a memory and is clicked, False otherwise.
     */
    get isMistake() {
        return !this.isMemory && this.isClicked;
    }

    /**
     * Determine if both squares are equal.
     * @param {square} square The other square being compared.
     * @return {boolean} True if this object and the square passed in have the same ID, False otherwise.
     */
    equals(square) {
        return this.ID === square.ID || this.ID === ('#' + square.ID);
    }

    /**
     * Determine if this square's ID and the ID passed in are equal.
     * @param {string} ID The other ID being compared.
     * @return {boolean} True if the IDs are equal, false otherwise.
     */
    equalsID(ID) {
        return this.ID === ID || this.ID === ('#' + ID);
    }

    /**
     * Create a Square ID. Used for CSS Selection.
     * @param {number} num The number of Square when counting from left to right on the Grid.
     * @return {string} A number concatenated to a string of '#s'.
     */
    static toSquareID(num) {
        return '#s' + num
    }
}