chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

  	if(message.method == 'setData') {

  		data = message.data;

  		console.log(data);
  	
  	} else if(message.method == 'getData') {

    	sendResponse(data);

    	console.log(data);
  	}
});