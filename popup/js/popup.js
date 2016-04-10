chrome.runtime.sendMessage({ method: 'getPlayers' }, function(response) {
  	
  	players = response;

  	drawBarChart(players);
});

function drawBarChart(players) {

	var chartPlayers = [];
	var percentages = [];

	for (var i = 0; i < players.length; i++) {

		chartPlayers.push(players[i]['name']);
		percentages.push(parseFloat(players[i]['percentage']));
	};

	var series = [		
		{ data: percentages }
	];

    $('#player-percentages-container').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
        	text: null
        },
        xAxis: {
            categories: chartPlayers
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Percentage'
            },
            max: 100
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            },
            series: {
            	states: {
            		hover: {
            			enabled: false
            		}
            	}
            }
        },
        credits: {
            enabled: false
        },
        series: series,
        legend: {
        	enabled: false
        }
    });	
}	