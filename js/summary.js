/**
 * Send the user's name and score to the database in the form of a POST request.
 * @param {string} name  The user's name.
 * @param {number} score The user's final score from the game.
 */
function postResults(name, score) {
    let xhttp = new XMLHttpRequest();

    xhttp.open("POST", "https://memory-game-db.herokuapp.com/?name=" + name + "&score=" + score, true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
        } else {
            console.log('error')
        }
    };
}

/** Return the user to the Memorization game. */
$(RESTART_ID_SEL).click(function() {
    window.open(INDEX_PATH,'_self');
});

/** Submit the user's score to the database, then direct the user to leaderboard page. */
$(SUBMIT_ID_SEL).click(function() {
    let name = $(USERNAME_ID_SEL).val();
    localStorage.setItem(NAME_LS_NAME, name);
    let score = localStorage.getItem(SCORE_LS_NAME);

    postResults(name, score);

    setTimeout( () => {
        window.open(LEADERBOARD_PATH,'_self');
    }, 20);
});