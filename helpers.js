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
                playerPool[i]['battingOrder'] = batPlayers[n]['battingOrder'];

                break;
            }
        }
    }

    return playerPool;
}

function processPlayer(players, name, position, lineup, playerPool, errors, lineupCheck) {

    if (players.length > 0) {

        for (var i = 0; i < players.length; i++) {

            if (name === players[i].name) {
            
                lineup.players.push(players[i]);

                return errors;
            }
        };  
    } 
        
    var player = new Player(name, position, playerPool, errors, lineupCheck);

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
