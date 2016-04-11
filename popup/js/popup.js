chrome.runtime.sendMessage({ method: 'getData' }, function(response) {
  	
  	data = response;

    $('span#daily-buy-in').text(data['dailyBuyIn']);

    showErrors(data['errors']);

    drawStacksChart(data['stacks']);

  	drawPlayersChart(data['players']);
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

function drawStacksChart(stacks) {

    var chartStacks = [];
    var percentages = [];

    for (var i = 0; i < stacks.length; i++) {

        chartStacks.push(stacks[i]['team']);
        percentages.push(parseFloat(stacks[i]['percentage']));
    };

    var series = [      

        { data: percentages }
    ];

    $('#stack-percentages-container').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: null
        },
        xAxis: {
            categories: chartStacks
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

function drawPlayersChart(players) {

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