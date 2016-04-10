function saveOptions() {
  
	var lineupBuyIns = [];

	for (var i = 0; i < 2; i++) {

		lineupBuyIns[i] = parseFloat(document.getElementById('lineup-buy-in-'+i).value.trim());
	}

	var secondEventStacks = [];

	for (var i = 0; i < 5; i++) {

		var teamName = document.getElementById('team-'+i).value.trim();

		var stack = new Stack(teamName);

		secondEventStacks.push(stack);
	}

	var csvInput = $('textarea').val();

	if (csvInput === '') {

		var playerPool = [];
	
	} else {

		var playerPool = $.csv.toObjects(csvInput);

		for (var i = 0; i < playerPool.length; i++) {
			
			delete playerPool[i]['AvgPointsPerGame'];
			delete playerPool[i]['GameInfo'];
		}
	}

	chrome.storage.local.set({
	
		lineupBuyIns: lineupBuyIns,
		secondEventStacks: secondEventStacks,
		playerPool: playerPool,
		csvInput: csvInput
	
	}, function() {
	
		// Update status to let user know options were saved.
		
		var status = document.getElementById('status');

		// rewriting fields with trim

		for (var i = 0; i < 2; i++) {

			document.getElementById('lineup-buy-in-'+i).value = lineupBuyIns[i];
		}

		for (var i = 0; i < secondEventStacks.length; i++) {

			var teamName = secondEventStacks[i]['team'];

			if (teamName === 'undefined') {

				teamName = '';
			}

			document.getElementById('team-'+i).value = teamName;
		}

		status.textContent = 'Options saved.';
		setTimeout(function() {
			status.textContent = '';
		}, 1500);
	});
}


function getOptions() {

	chrome.storage.local.get({
		
		lineupBuyIns: [3, 27],
		secondEventStacks: [],
		playerPool: [],
		csvInput: ''
	
	}, function(items) {

		for (var i = 0; i < 2; i++) {

			document.getElementById('lineup-buy-in-'+i).value = items.lineupBuyIns[i];
		}

		if (items.secondEventStacks.length == 0) {

			for (var i = 0; i < 5; i++) {

				document.getElementById('team-'+i).value = '';
			}

		} else {

			for (var i = 0; i < items.secondEventStacks.length; i++) {

				var teamName = items.secondEventStacks[i]['team'];

				if (teamName === 'undefined') {

					teamName = '';
				}

				document.getElementById('team-'+i).value = teamName;
			}
		}

		document.getElementById('csv-input').value = items.csvInput;

		console.log(items);
	});
}

function Stack(team) {

	this.team = team;
}

document.addEventListener('DOMContentLoaded', getOptions);

document.getElementById('save').addEventListener('click', saveOptions);