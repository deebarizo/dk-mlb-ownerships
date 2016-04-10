function saveOptions() {
  
	var lineupBuyIns = [];

	for (var i = 0; i < 2; i++) {

		lineupBuyIns[i] = parseFloat(document.getElementById('lineup-buy-in-'+i).value.trim());
	}

	var secondEventStacks = [];

	for (var i = 0; i < 2; i++) {

		var players = [];

		for (var n = 0; n < 5; n++) {

			var name = document.getElementById('stack-'+i+'-player-'+n).value.trim();

			var player = new Player(name);

			players.push(player);
		}		

		var stack = new Stack(players);

		secondEventStacks.push(stack);
	}

	var input = $('textarea').val();

	console.log($.csv.toObjects(input));

	chrome.storage.sync.set({
	
		lineupBuyIns: lineupBuyIns,
		secondEventStacks: secondEventStacks
	
	}, function() {
	
		// Update status to let user know options were saved.
		
		var status = document.getElementById('status');

		// rewriting fields with trim

		for (var i = 0; i < 2; i++) {

			document.getElementById('lineup-buy-in-'+i).value = lineupBuyIns[i];
		}

		for (var i = 0; i < 2; i++) {
			
			for (var n = 0; n < 5; n++) {

				var playerName = secondEventStacks[i]['players'][n]['name'];

				if (playerName === "undefined") {

					playerName = '';
				}

				document.getElementById('stack-'+i+'-player-'+n).value = playerName;
			}		
		}

		status.textContent = 'Options saved.';
		setTimeout(function() {
			status.textContent = '';
		}, 1500);
	});
}


function getOptions() {

	chrome.storage.sync.get({
		
		lineupBuyIns: [3, 27],
		secondEventStacks: []
	
	}, function(items) {

		for (var i = 0; i < 2; i++) {

			document.getElementById('lineup-buy-in-'+i).value = items.lineupBuyIns[i];
		}

		if (items.secondEventStacks.length === 0) {

			for (var i = 0; i < 2; i++) {

				for (var n = 0; n < 5; n++) {

					document.getElementById('stack-'+i+'-player-'+n).value = '';
				}
			}

		} else {

			for (var i = 0; i < 2; i++) {

				for (var n = 0; n < 5; n++) {

					var playerName = items.secondEventStacks[i]['players'][n]['name'];

					if (playerName === 'undefined') {

						playerName = '';
					}

					document.getElementById('stack-'+i+'-player-'+n).value = playerName;
				}
			}		
		}
	});
}

function Stack(players) {

	this.players = players;
}

function Player(name) {

	this.name = name;
}

document.addEventListener('DOMContentLoaded', getOptions);

document.getElementById('save').addEventListener('click', saveOptions);