/****************************************************************************************
LINEUP
****************************************************************************************/

function Lineup(numOfEntries) {

    this.numOfEntries = numOfEntries;

    this.players = [];
    this.stacks = [];
}

Lineup.prototype.getStacks = function(errors) {

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
        
        if (this.players[i]['team'] !== '' && this.players[i]['position'] !== 'SP' && this.players[i]['position'] !== 'RP') {

            teamsCount[this.players[i]['team']]++;

            if (teamsCount[this.players[i]['team']] === 4) {

                this.stacks.push(new Stack(this.players[i]['team'], 4));
            }

            if (teamsCount[this.players[i]['team']] === 5) {

                this.stacks = [];

                this.stacks.push(new Stack(this.players[i]['team'], 5));
            }
        }
    }

    var stackBreakdown = [undefined, undefined];

    for (var i = 0; i < this.stacks.length; i++) {
        
        stackBreakdown[i] = this.stacks[i].numOfPlayers;
    }

    if (stackBreakdown[0] === 5 || stackBreakdown[1] === 5) {

        return errors;
    }

    if (stackBreakdown[0] === 4 && stackBreakdown[1] === 4) {

        return errors;
    }

    this.stacks = [];

    this.stacks.push(new Stack('None', 0));

    for (var i = 0; i < errors.length; i++) {
        
        if (errors[i] = 'There is at least one lineup without a stack. Search for "None".') {

            return errors;
        }
    }

    var error = 'There is at least one lineup without a stack. Search for "None".';

    errors.push(error); 

    return errors;
};

Lineup.prototype.getFpts = function() {

    this.fpts = 0;
    
    for (var i = 0; i < this.players.length; i++) {

        if (this.players[i].hasOwnProperty('fpts')) {
            
            this.fpts += this.players[i]['fpts'];
        }
    }

    this.fpts = parseFloat(this.fpts.toFixed(2));
};

Lineup.prototype.getBuyIn = function(secondEventStacks, lineupBuyIns) {
    
    for (var i = 0; i < secondEventStacks.length; i++) {
        
        if (secondEventStacks[i]['team'] === this.stacks[0].team) { // To qualify as a second event stack, the stack must be only one team.

            this.buyIn = lineupBuyIns[1];

            return;
        }
    }

    this.buyIn = lineupBuyIns[0];
};


/****************************************************************************************
PLAYER
****************************************************************************************/

function Player(name, position, playerPool, errors, lineupCheck) {

    this.name = name;
    this.position = position;

    this.errors = errors;

    this.getMeta(playerPool, lineupCheck);
}

Player.prototype.getMeta = function(playerPool, lineupCheck) {

    for (var i = 0; i < playerPool.length; i++) {
        
        if (this.name === playerPool[i]['Name'] && playerPool[i]['Position'].indexOf(this.position) > -1) {

            this.salary = playerPool[i]['Salary'];
            this.team = playerPool[i]['teamAbbrev'];

            if (playerPool[i].hasOwnProperty('fpts')) {

                this.fpts = playerPool[i]['fpts'];

                if (lineupCheck == 'yes' && playerPool[i]['battingOrder'] == 'N/C') {

                    var error = 'This player is not in the team\'s lineup: '+this.name+' ('+this.team+')';

                    this.errors.push(error);                    
                } 

            } else {

                var error = 'This player does not have BAT fpts: '+this.name+' ('+this.team+')';

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

function Stack(team, numOfPlayers) { 

    this.team = team;
    this.numOfPlayers = numOfPlayers;

    this.buyIn = 0;
    this.numOfEntries = 0;
}