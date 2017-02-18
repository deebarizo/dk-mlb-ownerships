function saveOptions() {

	var dailyBuyInTarget = 0;

	dailyBuyInTarget = parseFloat(document.getElementById('daily-buy-in-target').value.trim());
  
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

	var lineupsToShow = $('#lineups-to-show').val();

	var showLineupsOnThisDate = $('#show-lineups-on-this-date').val();

	var showLineupsAfter = $('#show-lineups-after').val();

	var lineupCheck = $('#lineup-check').val();

	chrome.storage.local.set({
	
		dailyBuyInTarget: dailyBuyInTarget,
		lineupBuyIns: lineupBuyIns,
		secondEventStacks: secondEventStacks,
		playerPool: playerPool,
		csvInput: csvInput,
		lineupsToShow: lineupsToShow,
		showLineupsOnThisDate: showLineupsOnThisDate,
		showLineupsAfter: showLineupsAfter,
		lineupCheck: lineupCheck
	
	}, function() {
	
		// Update status to let user know options were saved.
		
		var status = document.getElementById('status');

		// rewriting fields with trim

		document.getElementById('daily-buy-in-target').value = dailyBuyInTarget;

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

		document.getElementById('lineups-to-show').value = lineupsToShow;

		document.getElementById('show-lineups-on-this-date').value = showLineupsOnThisDate;

		document.getElementById('show-lineups-after').value = showLineupsAfter;

		document.getElementById('lineup-check').value = lineupCheck;

		status.textContent = 'Options saved.';
		setTimeout(function() {
			status.textContent = '';
		}, 1500);
	});
}


function getOptions() {

	chrome.storage.local.get({
		
		dailyBuyInTarget: 450, 
		lineupBuyIns: [3, 27],
		secondEventStacks: [],
		playerPool: [],
		csvInput: '',
		lineupsToShow: 'upcoming-and-live',
		lineupCheck: 'no',
		showLineupsOnThisDate: '',
		showLineupsAfter: '6:00 PM', 
		batPlayers: []
	
	}, function(items) {

		document.getElementById('daily-buy-in-target').value = items.dailyBuyInTarget;

		for (var i = 0; i < 2; i++) {

			document.getElementById('lineup-buy-in-'+i).value = items.lineupBuyIns[i];
		}

		if (items.secondEventStacks.length === 0) {

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

		document.getElementById('lineups-to-show').value = items.lineupsToShow;

		document.getElementById('show-lineups-on-this-date').value = items.showLineupsOnThisDate;

		document.getElementById('show-lineups-after').value = items.showLineupsAfter;

		document.getElementById('lineup-check').value = items.lineupCheck;
	});
}

function Stack(team) {

	this.team = team;
}

document.addEventListener('DOMContentLoaded', getOptions);

document.getElementById('save').addEventListener('click', saveOptions);