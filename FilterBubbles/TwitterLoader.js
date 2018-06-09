const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();


var Twitter = require('twitter');
var client = new Twitter({
	consumer_key: 'KqBbt3SnPySp6on7HWXsjVIaY',
	consumer_secret: 'rZbCnAOti9J9Kg2XnmYuxn9muispZZzPGgYOvRXLKRnRBPdRup',
	access_token_key: '1005481241657868288-LmwUy4OKe9BGyS1nTF4NNNbtwMonTC',
	access_token_secret: '4UJt0UMcUusQVTUWyL3gIxAlfragvcXlXBMZbSCFxZ6yl'
});

module.exports = {
	init: function(){
		console.log("TwitterLoader initialized");
	},

	loadFeed: function(pages, serverResponse){
		console.log("TwitterLoader loading twitter feeds of: " + pages);

		var path = "statuses/user_timeline";
		var lstPagesToLoad = pages.split("&");

		var pageCountMax = lstPagesToLoad.length;
		var pageCount = 0;
		var lstTweetsOfAllFeeds = [];


		for (i = 0; i < lstPagesToLoad.length; i++) { 
			client.get(path, {screen_name: lstPagesToLoad[i]}, function(error, tweets, response) {

				if(error){
					pageCountMax--;
					return;
				}

				pageCount++;
				console.log("Got " + tweets.length)
				lstTweetsOfAllFeeds.push.apply(lstTweetsOfAllFeeds, tweets)

				if(pageCount >= pageCountMax){
					serverResponse.send(JSON.stringify(lstTweetsOfAllFeeds));
					console.log(lstTweetsOfAllFeeds);
				}

				//myEmitter.emit('twitterFeedLoaded', tweets);
				
			});
		}
	}
};