/** Perform a GET request to the database to retrieve the top 5 highest scoring users. */
function retrieveLeaderboard() {
    let xhttp = new XMLHttpRequest();

    xhttp.open("GET", "https://memory-game-db.herokuapp.com/", true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            buildLeaderboard(this.responseText);
        }
    };
}

/**
 * Create a table containing the top 5 highest scoring users. Also displays the current user's name and score.
 * @param {string} leaderboard The top 5 highest scoring users. Their name and score in a JSON String.
 */
function buildLeaderboard(leaderboard) {
    let lb = JSON.parse(leaderboard);
    
    let curr_name = localStorage.getItem(NAME_LS_NAME);
    let curr_score = localStorage.getItem(SCORE_LS_NAME);
    let curr_rank = 0;

    let rank = 1;

    // Assign a 'rank' to each user, based on their score. Highest scoring user has a rank of 1.
    for (let i = 0; i < lb.length; i++) {
        lb[i]['rank'] = rank++;

        if (lb[i]['name'] === curr_name) {
            curr_rank = lb[i]['rank'];
        }
    }
    $('#current-user').append("<tr><td>" + curr_rank + "</td><td>" + curr_name + "</td><td>" + curr_score + "</td></tr>");

    let content = "";
    for (let i = 0; i < lb.length && i < 5; i++) {
        content += "<tr><td>" + lb[i]['rank'] + "</td><td>" + lb[i]['name'] + "</td><td>" + lb[i]['score'] + "</td></tr>";
    }
    $('#all-users').append(content);
}

/** Return the user to the Memorization game. */
$(RESTART_ID_SEL).click(function() {
    window.open(INDEX_PATH,'_self');
});

retrieveLeaderboard();