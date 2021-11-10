 var path = require('path');
 var fs = require('fs');
 let reqPath = path.join(__dirname, './sql.json');
 let questPath = path.join(__dirname, '../questData/quests.json');
 var massSend = require("./massSend.js");
var getGames = require("./createGame.js");

 var uuid = require('uuid');
 var searchGamesById = require("./searchGamesById.js");
 var searchPlayerId = require("./searchGamesById.js");
 var massSend = require("./massSend.js");





 async function hostDisconnect(connection){
	game = getGames.getGames();
	
	searchGamesById.searchGamesById(connection.gameId).then((searchRes) =>{
		console.log(searchRes);
		console.log("hope is disconnected");
		
		var data = {
			action:"hostDisconnect"
		}
		massSend.massSend(data,searchRes);
	});
	
}


















exports.hostDisconnect = hostDisconnect;
