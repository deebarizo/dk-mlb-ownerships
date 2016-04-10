chrome.runtime.sendMessage({ method: 'getData' }, function(response) {
  	
  	data = response;

    showErrors(data['errors']);

  	drawBarChart(data['players']);
});

function showErrors(errors) {

    if (errors.length === 0) {

        return;
    }

    var htmlErrorMessages = '<h4 style="color: red">Errors</h4>';

    for (var i = 0; i < errors.length; i++) {
        
        htmlErrorMessages += '<p>'+errors[i]+'</p>';
    }

    htmlErrorMessages += '<hr>';

    $('div#errors').html(htmlErrorMessages);
}

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