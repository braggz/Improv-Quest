  var path = require('path');
 var fs = require('fs');
  var uuid = require('uuid');
var searchGamesById = require("./searchGamesById.js");
var searchPlayerId = require("./searchGamesById.js");
var addPlayer = require("./playerJoined.js");
var getGames = require("./createGame.js");

 async function joinGame(gameId,connection){
	return new Promise(resolve => {
		searchGamesById.searchGamesById(gameId).then((searchRes) =>{
			var games = getGames.getGames();
			var gameId = games[searchRes]["id"];
			var playerId = uuid.v4();
			connection.playerId = playerId;
			connection.isPlayer = true;
			connection.gameId = gameId;
			assignId(playerId,connection);
		console.log("Set id");

			var player = {
				name:"name",
				connection:connection,
				avatar:{
					avatarSlotId:0,
					avatarPicId:null,
					locked:false
				},
				gameId:gameId,
				playerId:playerId,
			}
		//	console.log(searchRes);
			addPlayer.addPlayer(searchRes,player).then((addRes) => {
				//console.log(addRes);
			//	console.log("addRes");
				if(addRes.success){
					var data = {
						player:player,
						players:addRes.players,
						playerPicSlots:addRes.playerPicSlots
					}
					resolve(data);
				}
				else{
					var data = {
						action:"error",
						value:"Lobby is Full"
					}
					resolve(data);
				}

			})

		});
	});
}

function assignId(id,con){
	var assignData = {
		action:"assignId",
		playerId:id,
	}
	console.log(assignData);
	console.log("assignId");
	con.sendUTF(JSON.stringify(assignData));
}

exports.joinGame = joinGame;
