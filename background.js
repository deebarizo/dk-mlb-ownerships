var title;

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  	if(message.method == 'setPlayers') {

  		players = message.players;
  	
  	} else if(message.method == 'getPlayers') {

    	sendResponse(players);

    	console.log(players);
  	}
});