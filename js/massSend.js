var getGames = require("./createGame.js");
var searchGamesById = require("./searchGamesById.js");
var searchPlayerId = require("./searchGamesById.js");

var path = require('path');
var fs = require('fs');

function massSend(data,index){
  var games = getGames.getGames();
	for(var i =0; i < games[index]["connections"].length;i++){
		//console.log("fuck")
		con = games[index]["connections"][i];
		con.sendUTF(JSON.stringify(data));
	}
}

exports.massSend =massSend;
