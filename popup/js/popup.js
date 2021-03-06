// When you click the popup icon, the following messages get sent to background.js.

var popupPort = chrome.runtime.connect({ name: "popupPort" });

popupPort.postMessage({ method: "getData" });


// This receives messages from background.js.

chrome.runtime.onConnect.addListener(function(port){

    port.onMessage.addListener(function(message) {

        if (message.method == "sendData" && port.name == 'popupPort') {

            data = message.data;

            $('span#daily-buy-in').text(data['dailyBuyIn']);

            showErrors(data['errors']);

            drawStacksChart(data['stacks']);

            drawPlayersChart(data['players']);
        }
    });
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

        chartStacks.push(stacks[i].team);
        percentages.push({
            y: parseFloat(stacks[i].percentage),
            val: parseInt(stacks[i].numOfEntries)
        });
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
            formatter: function() {
                return 'Number of Entries: '+this.point.val;
            }
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
                },
                dataLabels:{
                    enabled:true,
                    formatter: function() {
                        return this.y +'%';
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

    var playerTypes = ['pitcher', 'hitter'];

    for (var n = 0; n < playerTypes.length; n++) {

        var chartPlayers = [];
        var percentages = [];

        console.log(players);
        
        for (var i = 0; i < players.length; i++) {

            if (playerTypes[n] === 'pitcher') {

                if (players[i]['position'] === 'SP' || players[i]['position'] === 'RP') {

                    chartPlayers.push(players[i]['name']);
                    percentages.push(parseFloat(players[i]['percentage']));
                }
            }

            if (playerTypes[n] === 'hitter') {

                if (players[i]['position'] !== 'SP' && players[i]['position'] !== 'RP') {

                    chartPlayers.push(players[i]['name']);
                    percentages.push(parseFloat(players[i]['percentage']));
                }
            }    
        };

        var series = [      

            { data: percentages }
        ];

        $('#'+playerTypes[n]+'-percentages-container').highcharts({
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

    
}	