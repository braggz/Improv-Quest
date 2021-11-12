var commandParser = require("./commandParser.js");
//Node Repors
var express = require('express');
var path = require('path');
directHttp = express();
var express = require('express');
 var massSend = require("./massSend.js");
var hostDisconnect = require('./hostDisconnected');
var searchGamesById = require("./searchGamesById.js");
var programPath = path.join(__dirname, '../');
var htmlRoot = programPath + "/html";
var dir = path.join(__dirname, '../');

directHttp.use(express.static(dir));


var dir = path.join(__dirname, '../i');


console.log(dir);
const http = require('http');
const WebSocketServer = require('websocket').server;

directHttp.listen(80);
directHttp.get('/', function (req, res) {
  res.sendFile(htmlRoot+'/index.html')
});
directHttp.get('/createGame', function (req, res) {
	console.log("here");
  res.sendFile(htmlRoot+'/createGame.html')
});
directHttp.get('/hostGame', function (req, res) {
	console.log("here");
  res.sendFile(htmlRoot+'/hostGame.html')
});
directHttp.get('/playGame', function (req, res) {
	console.log("here");
  res.sendFile(htmlRoot+'/playGame.html')
});
directHttp.get('/startGame', function (req, res) {
	console.log("here");
  res.sendFile(htmlRoot+'/startGame.html')
});

const server = http.createServer();
server.listen(9898);
const wsServer = new WebSocketServer({
    httpServer: server
});


wsServer.on('request', function(request) {
    const connection = request.accept(null, request.origin);
    connection.on('message', function(message) {
      //console.log(utf8Data,connection)
	  commandParser.commandParser(message.utf8Data,connection);
    });
    connection.on('close', function(reasonCode, description) {
	//	console.log(connection);
        console.log('Client has disconnected.');
		console.log(connection.isPlayer);
		if(connection.isHost && connection.isHost != undefined && connection.isHost != null){
			hostDisconnect.hostDisconnect(connection);
		}
		else if(connection.isPlayer && connection.isPlayer != undefined && connection.isPlayer != null){
			console.log("player disconnected")
			playerDisconnected(connection);
		}
    });
});

function playerDisconnected(con){
	var gameId = con.gameId;
	var playerId = con.playerId;
	searchGamesById.searchGamesById(gameId).then((searchRes) =>{
		var data = {
			action:"playerLeft",
			playerId:playerId
		}
		massSend.massSend(data,searchRes);
		
	});
	
}