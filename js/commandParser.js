
var createGame = require("./createGame.js");
var joinGame = require("./joinGame.js");
var checkStatus = require("./checkStatus.js");
var nextPicture = require("./avatarSelect.js");
var previousPicture = require("./avatarSelect.js");
var nextQuest = require("./questSelect.js");
var previousQuest = require("./questSelect.js");
var syncGame = require("./syncGame.js");
var lockCharacter = require("./lockCharacters.js");
//Node Repos
var path = require('path');
var fs = require('fs');

function commandParser(data,connection){
  var parsedData = JSON.parse(data);
	if(parsedData.action == "createGame"){
		createGame.createGame(parsedData,connection).then((response) => {
			let questPath = path.join(__dirname, '../questData/quests.json');
			var obj1 = fs.readFileSync(questPath, 'utf8');
			var obj = JSON.parse(obj1);

			var data = {
				action:"gameCreated",
				value:response.id,
				hostData:obj[response.selectedQuest]
			}
			connection.sendUTF(JSON.stringify(data));

		});
	}
	else if(parsedData.action == "checkStatus"){
		checkStatus.checkStatus(parsedData.gameId).then((response) =>{
			var data = {
				action:"checkStatus",
				data:response
			}

			connection.sendUTF(JSON.stringify(data));
		})
	}
	else if(parsedData.action == "joinGame"){
	//	console.log(parsedData);
		joinGame.joinGame(parsedData.gameId,connection).then((joinRes) => {
		//	console.log(joinRes.playerPicSlots);
			if(joinRes.action != "error"){
				var data = {
				action:"joinedGame",
				value:joinRes.playerId,
				playerCount:joinRes.players,
				playerPicSlots:joinRes.playerPicSlots
				}
			//	console.log(JSON.stringifydata);
				connection.sendUTF(JSON.stringify(data));
			}
			else{
				console.log("what the fuck");
				connection.sendUTF(JSON.stringify(joinRes));
			}

		});
    console.log("Attempted to Sync Game");
		syncGame.syncGame(parsedData.gameId,connection);

	}
	else if(parsedData.action == "nextPicture"){
		nextPicture.nextPicture(parsedData,connection);
	}
	else if(parsedData.action == "previousPicture"){
		previousPicture.previousPicture(parsedData,connection);
	}
	else if(parsedData.action == "nextQuest"){
		nextQuest.nextQuest(parsedData);
	}
	else if(parsedData.action == "previousQuest"){
		previousQuest.previousQuest(parsedData);
	}
	else if(parsedData.action == "lockCharacter"){
		lockCharacter.lockCharacter(parsedData);
	}
  else if(parsedData.action == "unlockCharacter"){
		lockCharacter.unlockCharacter(parsedData);
	}
}



exports.commandParser = commandParser;
