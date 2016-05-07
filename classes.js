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

function Stack(teams) { // 1-2 teams, can have 2 teams with 4 players on each team

    this.teams = teams;
    this.buyIn = 0;
    this.numOfEntries = 0;
}