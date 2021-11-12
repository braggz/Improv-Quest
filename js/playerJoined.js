var getGames = require("./createGame.js");
var searchGamesById = require("./searchGamesById.js");
var searchPlayerId = require("./searchGamesById.js");

var path = require('path');
var fs = require('fs');

async function addPlayer(index,player){
	return new Promise(resolve => {
    var games = getGames.getGames();
		////console.log(index);



		if(games[index]["activePlayers"] <= 3){
			games[index]["connections"].push(player.connection);
			games[index]["players"].push(player);
			pickPicSlot(index,player.playerId,player);
			games[index]["activePlayers"]+=1;
			playerJoined(games[index]["id"],player.playerId);
			var data = {
				success:true,
				players:games[index]["activePlayers"],
				playerPicSlots: games[index]["playerSlots"]

			}
			resolve(data);
		}
		else{
			var data = {
				success:false
			}
			resolve(data);
		}

	});
}

function playerJoined(id,playerId){
var games = getGames.getGames();
	for(var i =0; i < games.length; i++){
		if(games[i]["id"] == id){
			////console.log(games[i].connections.length);
		////console.log("length");
			for(var j =0; j < games[i]["connections"].length;j++){
				var con = games[i]["connections"][j];
				var data = {
					action:"joinedGame",
					playerId:playerId,
					playerCount:games[i]["players"].length,
					playerPicSlots:games[i]["playerSlots"]
				}
				con.sendUTF(JSON.stringify(data));
				////console.log("send");

			}
			break;
		}
	}
}

function pickPicSlot(index,playerId,player){
  var games = getGames.getGames();
	var slots = (games[index].playerSlots);
	console.log(games[index].playerSlots);
	console.log("slots before");

	for(key in slots){
		if(slots[key] == null){
			console.log("inside loop");
			games[index]["playerSlots"][key] = playerId;
			break;
		}
	}
	console.log(games[index].playerSlots);
	console.log("slots after");

	// if(slotNum == 1){
	// 	games[index].playerSlots.playerOneSlotId = playerId;
	// }
	// else if(slotNum == 2){
	// 	games[index].playerSlots.playerTwoSlotId = playerId;
	// }
	// else if(slotNum == 3){
	// 	games[index].playerSlots.playerThreeSlotId = playerId;
	// }
	// else if(slotNum == 4){
	// 	games[index].playerSlots.playerFourSlotId = playerId;
	// }
}
exports.addPlayer = addPlayer;
