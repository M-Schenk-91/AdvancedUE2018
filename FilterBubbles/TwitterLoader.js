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

	loadFeed: function(screenName, serverResponse){
		console.log("TwitterLoader loading twitter feeds of: " + screenName);
		var path = "friends/list"
		client.get(path, {screen_name: screenName}, function(error, tweets, response) {
			serverResponse.send(JSON.stringify(response));
		});
	},

	userAutocomplete: function(search, serverResponse) {
		console.log("TwitterLoader searching twitter user: " + search);
		var path = "users/search"
		client.get(path, {q: search}, function(error, tweets, response) {
			serverResponse.send(JSON.stringify(response));
		});
	}
};
