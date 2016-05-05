var contentPort = chrome.runtime.connect({name: "contentPort"});

chrome.runtime.onConnect.addListener(function(port){

    port.onMessage.addListener(function(message) {

        if (message.method == 'getData' && port.name == 'contentPort') {

            chrome.storage.local.get(null, function(items) { // https://developer.chrome.com/extensions/storage#type-StorageArea

                var lineups = [];

                var players = [];

                var stacks = [];

                var errors = [];

                var lineupBuyIns = items.lineupBuyIns;

                var secondEventStacks = items.secondEventStacks;

                var selectorForLineupsToShow = getSelectorForLineupsToShow(items.lineupsToShow);

                var playerPool = items.playerPool;

                $(selectorForLineupsToShow).each(function() {

                    var numOfEntries = parseInt($(this).find('div.entries span').text());

                    var tbody = $(this).find('table tbody');

                    var lineup = new Lineup(numOfEntries);

                    tbody.children('tr').each(function() {

                        var name = $(this).find('td.p-name a').text().trim();

                        name = fixName(name);

                        var position = $(this).attr('data-pn').trim();

                        if (position === 'P') {

                            position = 'SP';
                        }

                        errors = processPlayer(players, name, position, lineup, playerPool, errors);
                    });

                    errors = lineup.getStack(errors);

                    $(this).find('div.pmr span').text(lineup.stack.team);

                    lineup.getBuyIn(secondEventStacks, lineupBuyIns);

                    processStack(stacks, lineup);

                    lineups.push(lineup);
                });

                var dailyBuyIn = calculateDailyBuyIn(lineups);

                addPercentagesToPlayers(players, lineups, dailyBuyIn);

                players.sort(function(a,b) {

                    return b.percentage - a.percentage;
                });

                addPercentagesToStacks(stacks, dailyBuyIn);

                stacks.sort(function(a,b) {

                    return b.percentage - a.percentage;
                });

                if (dailyBuyIn != items.dailyBuyInTarget) {

                    errors.push('The daily buy in, $'+dailyBuyIn+', does not match the target, $'+items.dailyBuyInTarget+'.');
                }

                contentPort.postMessage({ 

                    method: 'sendData', 
                    data: {

                        lineups: lineups, 
                        players: players, 
                        stacks: stacks,
                        dailyBuyIn: dailyBuyIn,
                        errors: errors
                    }
                });
            });
        }
    });
});


/****************************************************************************************
LINEUP
****************************************************************************************/

function Lineup(numOfEntries) {

    this.numOfEntries = numOfEntries;
    this.players = [];
}

Lineup.prototype.getStack = function(errors) {

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

                this.stack = new Stack(this.players[i]['team']);

                return errors;
            }
        }
    }

    this.stack = new Stack('None');

    var error = 'This lineup does not have a stack: ';

    for (var i = 0; i < this.players.length; i++) {

        if (i === this.players.length - 1) {

            error += this.players[i]['name'];

        } else {

            error += this.players[i]['name']+' | ';
        }
    }

    errors.push(error); 

    return errors;
};

Lineup.prototype.getBuyIn = function(secondEventStacks, lineupBuyIns) {
    
    for (var i = 0; i < secondEventStacks.length; i++) {
        
        if (secondEventStacks[i]['team'] === this.stack['team']) {

            this.buyIn = lineupBuyIns[1];

            return;
        }
    }

    this.buyIn = lineupBuyIns[0];
};


/****************************************************************************************
PLAYER
****************************************************************************************/

function Player(name, position, playerPool, errors) {

    this.name = name;
    this.position = position;
    this.errors = errors;

    this.getMeta(playerPool);
}

Player.prototype.getMeta = function(playerPool, errors) {
    
    for (var i = 0; i < playerPool.length; i++) {
        
        if (this.name === playerPool[i]['Name'] && playerPool[i]['Position'].indexOf(this.position) > -1) {

            this.salary = playerPool[i]['Salary'];
            this.team = playerPool[i]['teamAbbrev'];

            return;
        }
    }

    this.team = 'None';

    var error = 'This player does not have a team: '+this.name;

    this.errors.push(error);   

    return; 
};


/****************************************************************************************
STACK
****************************************************************************************/

function Stack(team) {

    this.team = team;
    this.buyIn = 0;
    this.numOfEntries = 0;
}


/****************************************************************************************
HELPERS
****************************************************************************************/

function getSelectorForLineupsToShow(lineupsToShow) {

    if (lineupsToShow === 'upcoming-and-live') {

        return 'div.lineup.live, div.lineup.upcoming';
    }

    if (lineupsToShow === 'upcoming') {

        return 'div.lineup.upcoming';
    }

    if (lineupsToShow === 'live') {

        return 'div.lineup.live';
    }

    if (lineupsToShow === 'complete') {

        return 'div.lineup.complete';
    }
}

function processPlayer(players, name, position, lineup, playerPool, errors) {

    if (players.length > 0) {

        for (var i = 0; i < players.length; i++) {

            if (name === players[i].name) {
            
                lineup.players.push(players[i]);

                return errors;
            }
        };  
    } 
        
    var player = new Player(name, position, playerPool, errors);

    players.push(player);

    lineup.players.push(player);

    return player.errors;
}

function processStack(stacks, lineup) {

    if (stacks.length > 0) {

        for (var i = 0; i < stacks.length; i++) {

            if (lineup['stack']['team'] === stacks[i]['team']) {
            
                stacks[i]['buyIn'] += lineup['buyIn'] * lineup['numOfEntries'];
                stacks[i]['numOfEntries'] += lineup['numOfEntries'];

                return;
            }
        };  
    } 
        
    var stack = new Stack(lineup['stack']['team']);

    stack['buyIn'] += lineup['buyIn'] * lineup['numOfEntries'];
    stack['numOfEntries'] += lineup['numOfEntries'];

    stacks.push(stack);
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

function addPercentagesToStacks(stacks, dailyBuyIn) {

    for (var i = 0; i < stacks.length; i++) {
        
        stacks[i]['percentage'] = stacks[i]['buyIn'] / dailyBuyIn * 100;
        stacks[i]['percentage'] = stacks[i]['percentage'].toFixed(2);
    }
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
