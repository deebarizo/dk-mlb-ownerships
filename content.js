var contentPort = chrome.runtime.connect({name: "contentPort"});

chrome.runtime.onConnect.addListener(function(port) {

    port.onMessage.addListener(function(message) {

        if (message.method == 'getData' && port.name == 'contentPort') {

            chrome.storage.local.get(null, function(items) { // https://developer.chrome.com/extensions/storage#type-StorageArea

                var batPlayers = items.batPlayers;

                var lineups = [];

                var players = [];

                var stacks = [];

                var errors = [];

                var lineupBuyIns = items.lineupBuyIns;

                var secondEventStacks = items.secondEventStacks;

                var selectorForLineupsToShow = getSelectorForLineupsToShow(items.lineupsToShow);

                var playerPool = items.playerPool;
                playerPool = addFptsToPlayerPool(playerPool, batPlayers);

                console.log(playerPool);
                console.log(batPlayers);

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

                    if (lineup.stack.teams.length === 1) {

                        $(this).find('div.pmr span').text(lineup.stack.teams[0]);   
                    
                    } else {

                        var twoTeamStack = lineup.stack.teams[0]+'/'+lineup.stack.teams[1];

                        $(this).find('div.pmr span').text(twoTeamStack); 
                    }

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

    this.stack = new Stack([ 'None' ]);

    var numFourPlayerStacks = 0;

    for (var i = 0; i < this.players.length; i++) {
        
        if (this.players[i]['team'] !== '') {

            teamsCount[this.players[i]['team']]++;

            if (teamsCount[this.players[i]['team']] == 5) {

                this.stack = new Stack([ this.players[i]['team'] ]);

                return errors;
            }

            if (teamsCount[this.players[i]['team']] == 4 && this.stack.teams[0] == 'None' ) {

                numFourPlayerStacks++;

                this.stack = new Stack([ this.players[i]['team'] ]);

                continue;
            }

            if (teamsCount[this.players[i]['team']] == 4 && this.stack[0] !== 'None' ) {

                this.stack.teams.push(this.players[i]['team']);

                return errors;
            }
        }
    }

    if (numFourPlayerStacks < 2) {

        this.stack = new Stack([ 'None' ]);
    }

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
        
        if (secondEventStacks[i]['team'] === this.stack.teams[0]) { // To qualify as a second event stack, the stack must be only one team.

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

Player.prototype.getMeta = function(playerPool) {
    
    for (var i = 0; i < playerPool.length; i++) {
        
        if (this.name === playerPool[i]['Name'] && playerPool[i]['Position'].indexOf(this.position) > -1) {

            this.salary = playerPool[i]['Salary'];
            this.team = playerPool[i]['teamAbbrev'];

            if (playerPool[i].hasOwnProperty('fpts')) {

                this.fpts = playerPool[i]['fpts'];

            } else {

                var error = 'This player does not have BAT fpts: '+this.name;

                this.errors.push(error);                   
            }

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

function Stack(teams) { // 1-2 teams, can have 2 teams with 4 players on each team

    this.teams = teams;
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

function addFptsToPlayerPool(playerPool, batPlayers) {

    for (var i = 0; i < playerPool.length; i++) {

        for (var n = 0; n < batPlayers.length; n++) {

            var name = fixBatName(batPlayers[n]['name']);

            var teamAbbrev = fixTeamName(playerPool[i]['teamAbbrev'].toUpperCase());
            
            if (playerPool[i]['Name'] == name && 
                playerPool[i]['Position'].search(batPlayers[n]['position']) > -1 &&
                teamAbbrev == batPlayers[n]['teamAbbrev'].toUpperCase()) {

                playerPool[i]['fpts'] = batPlayers[n]['fpts'];

                break;
            }
        }
    }

    return playerPool;
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

    if (lineup.stack.teams.length === 1) {

        if (stacks.length > 0) {

            for (var i = 0; i < stacks.length; i++) {

                if (lineup.stack.teams[0] === stacks[i]['teams'][0]) {

                    stacks[i]['buyIn'] += lineup['buyIn'] * lineup['numOfEntries'];
                    stacks[i]['numOfEntries'] += lineup['numOfEntries'];

                    return;
                }
            }
        } 

        var stack = new Stack([ lineup.stack.teams[0] ]);

        stack['buyIn'] += lineup['buyIn'] * lineup['numOfEntries'];
        stack['numOfEntries'] += lineup['numOfEntries'];

        stacks.push(stack);

        return;
    }

    var teamsAccountedFor = [];

    if (stacks.length > 0) {

        for (var i = 0; i < stacks.length; i++) {

            for (var n = 0; n < lineup.stack.teams.length; n++) {
                
                if (lineup.stack.teams[n] === stacks[i]['team']) {
                
                    stacks[i]['buyIn'] += lineup['buyIn'] * lineup['numOfEntries'] * 0.5;
                    stacks[i]['numOfEntries'] += lineup['numOfEntries'] * 0.5;

                    teamsAccountedFor.push(stacks[i]['team']);
                }
            }
        } 
    } 

    if (teamsAccountedFor.length === 2) {

        return;
    }

    var teamInStacks = false;

    for (var i = 0; i < lineup.stack.teams.length; i++) {
        
        for (var n = 0; n < teamsAccountedFor.length; n++) {

            if (lineup.stack.teams[i] == teamsAccountedFor[i]) {

                teamInStacks = true;
            }
        }

        if (teamInStacks) {

            continue;
        }

        var stack = new Stack([ lineup.stack.teams[i] ]);

        stack['buyIn'] += lineup['buyIn'] * lineup['numOfEntries'] * 0.5;
        stack['numOfEntries'] += lineup['numOfEntries'] * 0.5;

        stacks.push(stack);
    }  
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
