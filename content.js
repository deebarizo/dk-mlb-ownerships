// Chrome Storage API is asynchronous
// http://stackoverflow.com/questions/16336367/what-is-the-difference-between-synchronous-and-asynchronous-programming-in-node

chrome.storage.local.get(null, function(items) { // https://developer.chrome.com/extensions/storage#type-StorageArea

    var players = [];

    var lineups = [];

    var lineupBuyIns = items.lineupBuyIns;

    var secondEventStacks = items.secondEventStacks;

    $('div.lineup').each(function() {

        var numOfEntries = parseInt($(this).find('div.entries span').text());

        var tbody = $(this).find('table tbody');

        var lineup = new Lineup(numOfEntries);

        tbody.children('tr').each(function() {

            var name = $(this).find('td.p-name').text().trim();

            processPlayer(players, name, lineup);
        });

        lineup.checkForSecondEventStack(secondEventStacks, lineupBuyIns);

        lineups.push(lineup);
    });

    var dailyBuyIn = calculateDailyBuyIn(lineups);

    addPercentagesToPlayers(players, lineups, dailyBuyIn);

    players.sort(function(a,b) {

        return b.percentage - a.percentage;
    });

    chrome.runtime.sendMessage({
     
        method: 'setPlayers',
        players: players
    });
});


/****************************************************************************************
LINEUP
****************************************************************************************/

function Lineup(numOfEntries) {

    this.numOfEntries = numOfEntries;
    this.players = [];
}

Lineup.prototype.checkForSecondEventStack = function(secondEventStacks, lineupBuyIns) {

    this.playerMatches = 0;

    for (var i = 0; i < secondEventStacks.length; i++) {

        for (var n = 0; n < secondEventStacks[i]['players'].length; n++) {

            this.playerMatches += this.checkForPlayerMatch(secondEventStacks[i]['players'][n], this.players);
        }
    }

    if (this.playerMatches == 5) {

        this.buyIn = lineupBuyIns[1];
    
    } else {

        this.buyIn = lineupBuyIns[0];
    }
};

Lineup.prototype.checkForPlayerMatch = function(playerInStack, playersInLineup) {

    for (var i = 0; i < playersInLineup.length; i++) {

        if (playerInStack['name'] === playersInLineup[i]['name']) {

            return 1;
        }
    }

    return 0;
};


/****************************************************************************************
PLAYER
****************************************************************************************/

function Player(name) {

    this.name = name;
}


/****************************************************************************************
HELPERS
****************************************************************************************/

function processPlayer(players, name, lineup) {

    var playerProcessed = false;

    if (players.length > 0) {

        for (var i = 0; i < players.length; i++) {

            if (name === players[i].name) {
            
                lineup.players.push(players[i]);

                playerProcessed = true;

                break;
            }

            if (playerProcessed) {
                
                break;
            }
        };  

    } 
        
    if (playerProcessed) {

        return;
    }

    var player = new Player(name);

    players.push(player);

    lineup.players.push(player);
}

function calculateDailyBuyIn(lineups) {

    var dailyBuyIn = 0;
    
    for (var i = 0; i < lineups.length; i++) {
        
        dailyBuyIn += lineups[i]['buyIn'] * lineups[i]['numOfEntries'];
    }

    return dailyBuyIn;
}

function addPercentagesToPlayers(players, lineups, dailyBuyIn) {
    
    for (var i = 0; i < players.length; i++) {
    
        players[i].buyIn = getPlayerBuyIn(players[i], lineups);

        players[i].percentage = players[i].buyIn / dailyBuyIn * 100;
        players[i].percentage = players[i].percentage.toFixed(2);
    };
}

function getPlayerBuyIn(player, lineups) {

    var playerBuyIn = 0;

    for (var i = 0; i < lineups.length; i++) {
        
        for (var n = 0; n < lineups[i]['players'].length; n++) {
            
            if (lineups[i]['players'][n]['name'] === player['name']) {

                playerBuyIn += lineups[i]['buyIn'] * lineups[i]['numOfEntries'];
            }
        }
    }

    return playerBuyIn;
}
