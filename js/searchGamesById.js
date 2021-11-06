var getGames = require("./createGame.js");
var path = require('path');
var fs = require('fs');


async function searchGamesById(id){
  var games = getGames.getGames();
	return new Promise(resolve => {
		for(var i =0; i < games.length; i++){
			if(games[i]["id"] == id){
				resolve(i);
			}
		}
	})
}

async function searchPlayerId(id,index){
  var games = getGames.getGames();
	return new Promise(resolve => {
		for(var i =0; i < games[index]["players"].length; i++){
		//	//console.log(games[index]["players"][i]["playerId"])
			if(games[index]["players"][i]["playerId"] == id){
				resolve(i);
			}
		}
	})
}

exports.searchPlayerId = searchPlayerId;
exports.searchGamesById = searchGamesById;
