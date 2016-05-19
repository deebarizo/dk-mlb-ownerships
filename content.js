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

                var showLineupsAfter = items.showLineupsAfter;
                showLineupsAfter = new Date(Date.parse('2016/01/01 '+showLineupsAfter));

                var lineupCheck = items.lineupCheck;

                var lineupBuyIns = items.lineupBuyIns;

                var secondEventStacks = items.secondEventStacks;

                var selectorForLineupsToShow = getSelectorForLineupsToShow(items.lineupsToShow);

                var playerPool = items.playerPool;
                playerPool = addFptsToPlayerPool(playerPool, batPlayers);

                $(selectorForLineupsToShow).each(function() {

                    var lastEditText = $(this).find('div.last-edit').text();

                    var lastEditTime = lastEditText.replace(/(Last Edit: \d+\/\d+\/\d+ )(\d+:\d+ (am|pm))( EST)/, '$2');
                    lastEditTime = new Date(Date.parse('2016/01/01 '+lastEditTime));

                    if (lastEditTime > showLineupsAfter) {
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

                            errors = processPlayer(players, name, position, lineup, playerPool, errors, lineupCheck);
                        });

                        errors = lineup.getStacks(errors);

                        if (lineup.stacks.length === 1) {

                            $(this).find('div.pmr span').text(lineup.stacks[0].team);   
                        
                        } else {

                            var twoTeamStack = lineup.stacks[0].team+'/'+lineup.stacks[1].team;

                            $(this).find('div.pmr span').text(twoTeamStack); 
                        } 

                        lineup.getBuyIn(secondEventStacks, lineupBuyIns);

                        processStack(stacks, lineup);

                        lineups.push(lineup);
                    }
                });

                lineups.sort(function(a,b) {

                    return a.fpts - b.fpts;
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


