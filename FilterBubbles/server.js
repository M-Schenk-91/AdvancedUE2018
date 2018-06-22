const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

var fs = require('fs');
//var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('./sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('./sslcert/server.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};

var express = require('express');
var app = express();

var twitterLoader = require('./TwitterLoader');
twitterLoader.init();

app.use(express.static('./page/public'));


app.get('/', function(request, response){
    response.sendfile('./page/index.html');
});

/*
app.get('/privacy', function(request, response){
    response.sendfile('./page/privacy.html');
});
*/

app.get('/twitter/:owner', function(request, response){
	twitterLoader.loadFeed(request.params.owner, response);
});

app.get('/users/:search', function(request, response){
    twitterLoader.userAutocomplete(request.params.search, response);
});

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(8000, function () {
  console.log('Server listening on port 8000!');
});

