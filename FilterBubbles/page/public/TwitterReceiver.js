function twitterReceiever() {
	var httpGetAsync = function(url, callback) {
		console.log("HTML request: " + url)
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function() {
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
				callback(xmlHttp.responseText);
		}
	    xmlHttp.open("GET", url, true); // true for asynchronous
	    xmlHttp.send(null);
	},

	loadFeeds = function(names) {
		var url = "https://localhost:8000/twitter/" + names;
		httpGetAsync(url, onTwitterFeedReceived);
	},

	userAutocomplete = function(search) {
		var url = "https://localhost:8000/users/" + search;
		return httpGetAsync(url, onTwitterUsersReceived);
	},

	onTwitterFeedReceived = function(response) {
		//DATA LOADED
		var feed =  JSON.parse(response);
		console.log("RECEIVED")
		var evt = new CustomEvent('twitterfeedreceived', { detail: feed });
		window.dispatchEvent(evt);
	},

	onTwitterUsersReceived = function(response) {
		//DATA LOADED
		var feed =  JSON.parse(response);
		console.log("RECEIVED")
		var evt = new CustomEvent('twitterusersreceived', { detail: feed });
		window.dispatchEvent(evt);
	},

	init = function() {

	};

	this.userAutocomplete= userAutocomplete;
	this.loadFeeds = loadFeeds;
	this.init = init;

	return this;
}
