var path = require('path');
var fs = require('fs');

let questPath = path.join(__dirname, '../questData/quests.json');



var uuid = require('uuid');

var searchGamesById = require("./searchGamesById.js");
var searchPlayerId = require("./searchGamesById.js");
var getGames = require("./createGame.js");

async function syncGame(gameId,con){
  var games = getGames.getGames();
	searchGamesById.searchGamesById(gameId).then((gameId) => {
		playerSlots = games[gameId]["playerSlots"];
		syncPlayerSlots(gameId).then((slotData) => {
			var hostPic = games[gameId]["selectedQuest"];
			let questPath = path.join(__dirname, '../questData/quests.json');
			var obj1 = fs.readFileSync(questPath, 'utf8');
			var obj = JSON.parse(obj1);
	//		//console.log(obj[hostPic]);

			var tempPlayer = games[gameId]["players"];
		//	console.log(games[gameId]["players"]);
      console.log("before null")
      var copy = [];
			for(var i =0; i < tempPlayer.length;i++){
        var player = {
  				name:tempPlayer[i]["name"],
  				connection:null,
  				avatar:tempPlayer[i]["avatar"],
  				gameId:tempPlayer[i]["gameId"],
  				playerId:tempPlayer[i]["playerId"],
  			}
        copy.push(player);
				//tempPlayer[i]["connection"] = null;
			}
			////console.log(tempPlayer);
			var syncData = {
				action:"syncGame",
				playerSlots:playerSlots,
				playerData:slotData,
				hostData:obj[hostPic],
				playerDataFull:copy
			}
      //console.log(games[gameId]["players"]);
      console.log("after null")
		//	//console.log(syncData);
		//	//console.log("This is sync data");
			con.sendUTF(JSON.stringify(syncData));
		})
	})
}

function syncPlayerSlots(gameId){
  var games = getGames.getGames();
	return new Promise(resolve => {
		var players = games[gameId]["players"];
		var picSyncDataArr = [];
		for(var i =0; i < players.length; i++){
			let questPath = path.join(__dirname, '../questData/players.json');
			var obj1 = fs.readFileSync(questPath, 'utf8');
			var obj = JSON.parse(obj1);
			var pic = obj[players[i]["avatar"]["avatarSlotId"]];

			var playerId = players[i]["playerId"];
			var picSyncData = {
				playerId:playerId,
				picId:pic
			}
			picSyncDataArr.push(picSyncData);

		}
		resolve(picSyncDataArr);
	})
}
exports.syncGame = syncGame;
