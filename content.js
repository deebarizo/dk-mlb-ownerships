// Chrome Storage API is asynchronous
// http://stackoverflow.com/questions/16336367/what-is-the-difference-between-synchronous-and-asynchronous-programming-in-node

chrome.storage.local.get(null, function(items) { // https://developer.chrome.com/extensions/storage#type-StorageArea

    var players = [];

    var lineups = [];

    var lineupBuyIns = items.lineupBuyIns;

    var secondEventStacks = items.secondEventStacks;

    var playerPool = items.playerPool;

    $('div.lineup.upcoming').each(function() {

        var numOfEntries = parseInt($(this).find('div.entries span').text());

        var tbody = $(this).find('table tbody');

        var lineup = new Lineup(numOfEntries);

        tbody.children('tr').each(function() {

            var name = $(this).find('td.p-name a').text().trim();

            var position = $(this).attr('data-pn').trim();

            if (position === 'P') {

                position = 'SP';
            }

            processPlayer(players, name, position, lineup, playerPool);
        });

        lineup.getStack();

        lineup.getBuyIn(secondEventStacks, lineupBuyIns);

        lineups.push(lineup);
    });

    var dailyBuyIn = calculateDailyBuyIn(lineups);

    addPercentagesToPlayers(players, lineups, dailyBuyIn);

    players.sort(function(a,b) {

        return b.percentage - a.percentage;
    });

    chrome.runtime.sendMessage({
     
        method: 'setData',
        data: {

            lineups: lineups, 
            players: players, 
            dailyBuyIn: dailyBuyIn,
            errors: errors
        }
    });
});


/****************************************************************************************
ERRORS
****************************************************************************************/

var errors = [];


/****************************************************************************************
LINEUP
****************************************************************************************/

function Lineup(numOfEntries) {

    this.numOfEntries = numOfEntries;
    this.players = [];
}

Lineup.prototype.getStack = function() {

    var teams = [];
    
    for (var i = 0; i < this.players.length; i++) {
        
        if (this.players[i]['team'] !== '') {

            teams.push(this.players[i]['team']);
        }
    }

    teams = teams.filter(onlyUnique);

    var teamsCount = [];

    for (var i = 0; i < teams.length; i++) {
        
        teamsCount[teams[i]] = 0;
    }

    for (var i = 0; i < this.players.length; i++) {
        
        if (this.players[i]['team'] !== '') {

            teamsCount[this.players[i]['team']]++;

            if (teamsCount[this.players[i]['team']] == 5) {

                this.stack = this.players[i]['team'];

                return;
            }
        }
    }

    this.stack = 'None';

    var error = 'This lineup does not have a stack: ';

    for (var i = 0; i < this.players.length; i++) {

        if (i === this.players.length - 1) {

            error += this.players[i]['name'];

        } else {

            error += this.players[i]['name']+' | ';
        }
    }

    errors.push(error);
};

Lineup.prototype.getBuyIn = function(secondEventStacks, lineupBuyIns) {
    
    for (var i = 0; i < secondEventStacks.length; i++) {
        
        if (secondEventStacks[i]['team'] === this.stack) {

            this.buyIn = lineupBuyIns[1];

            return;
        }
    }

    this.buyIn = lineupBuyIns[0];
};


/****************************************************************************************
PLAYER
****************************************************************************************/

function Player(name, position, playerPool) {

    this.name = name;
    this.position = position;

    this.getMeta(playerPool);
}

Player.prototype.getMeta = function(playerPool) {
    
    for (var i = 0; i < playerPool.length; i++) {
        
        if (this.name === playerPool[i]['Name'] && playerPool[i]['Position'].indexOf(this.position) > -1) {

            this.salary = playerPool[i]['Salary'];
            this.team = playerPool[i]['teamAbbrev'];

            return;
        }
    }

    this.team = 'None';

    var error = 'This player does not have a team: '+this.name;

    errors.push(error);    
};


/****************************************************************************************
HELPERS
****************************************************************************************/

function processPlayer(players, name, position, lineup, playerPool) {

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

    var player = new Player(name, position, playerPool);

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

function onlyUnique(value, index, self) { // http://stackoverflow.com/a/14438954

    return self.indexOf(value) === index;
}
