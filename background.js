var title;

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  	if(message.method == 'setData') {

  		data = message.data;
  	
  	} else if(message.method == 'getData') {

    	sendResponse(data);

    	console.log(data);
  	}
});