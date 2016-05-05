chrome.runtime.onConnect.addListener(function(port){

	port.onMessage.addListener(function(message) {

	    if (message.method == 'getData' && port.name == 'popupPort') {

			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			
			    var activeTab = tabs[0];
			    
				var contentPort = chrome.tabs.connect(activeTab.id, {name: 'contentPort'});

    			contentPort.postMessage({ method: 'getData' });
			});
	    }

	    if (message.method == 'sendData' && port.name == 'contentPort') {

	    	var popupPort = chrome.runtime.connect({ name: "popupPort" });

	    	popupPort.postMessage({ method: 'sendData', data: message.data });
	    }
	});
});

// http://stackoverflow.com/questions/18835452/chrome-extension-onmessageexternal-undefined

chrome.runtime.onConnectExternal.addListener(function(port) {
    
    port.onMessage.addListener(function(message) {
    
		chrome.storage.local.set({
		
			batPlayers: message.players

		}, function() {});
    });
});