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
var getGames = require("./createGame.js");
var dir = path.join(__dirname, '../');
var fs = require('fs');
directHttp.use(express.static(dir));


var dir = path.join(__dirname, '../i');


//console.log(dir);
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
	//	console.log(connection.isPlayer);
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
  var games = getGames.getGames();
	var gameId = con.gameId;
	var playerId = con.playerId;
	searchGamesById.searchGamesById(gameId).then((searchRes) =>{

    var slots =  games[searchRes]["playerSlots"];
    for(var key in slots){
      if(slots[key] == playerId){
        games[searchRes]["playerSlots"][key] = null;
      }
    }


    var tempArr = [];
    for(var i =0; i < games[searchRes]["players"].length ; i++){
      if(games[searchRes]["players"][i]["playerId"] == playerId){
        //
      }
      else{
        tempArr.push(games[searchRes]["players"][i]);
      }
    }
    games[searchRes]["players"] = tempArr;
    games[searchRes]["activePlayers"] -=1
    let questPath = path.join(__dirname, '../questData/players.json');
    var obj1 = fs.readFileSync(questPath, 'utf8');
    var obj = JSON.parse(obj1);

		var data = {
			action:"playerLeft",
      value:playerId,
      playerCount:games[searchRes]["players"].length,
      playerPicSlots:games[searchRes]["playerSlots"],
      resetSlotData:obj[0]
		}
		massSend.massSend(data,searchRes);

	});

}
