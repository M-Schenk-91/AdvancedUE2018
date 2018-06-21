const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

require('dotenv').config();

var Twitter = require('twitter');
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

module.exports = {
	init: function(){
		console.log("TwitterLoader initialized");
	},

	loadFeed: function(pages, serverResponse){
		console.log("TwitterLoader loading twitter feeds of: " + pages);

		//var path = "statuses/user_timeline";
		var path = "friends/list"
		client.get(path, {screen_name: 'BSchweinsteiger'}, function(error, tweets, response) {
			serverResponse.send(JSON.stringify(response));
		});
		/*
		var lstPagesToLoad = pages.split("&");

		console.log(lstPagesToLoad);

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
					console.log("SEND")
					serverResponse.send(JSON.stringify(lstTweetsOfAllFeeds));
				}

			});
		}
		*/
	}
};
