var getGames = require("./createGame.js");
var searchGamesById = require("./searchGamesById.js");
var searchPlayerId = require("./searchGamesById.js");
var massSend = require("./massSend.js");


var path = require('path');
var fs = require('fs');

function nextQuest(json){
	return new Promise(resolve => {
    var games = getGames.getGames();
	//console.log("here4");
	searchGamesById.searchGamesById(json.gameId).then((searchData) => {
		//console.log("here5");

			games[searchData]["selectedQuest"] += 1;
			var temp = games[searchData]["selectedQuest"];
			//console.log(temp);
			var picId;
			if(temp > 3){
				temp = 0;
				games[searchData]["selectedQuest"] = 0;
			}
			//var hostPic = games[gameId]["selectedQuest"];
			let questPath = path.join(__dirname, '../questData/quests.json');
			var obj1 = fs.readFileSync(questPath, 'utf8');
			var obj = JSON.parse(obj1);
			picId = obj[temp];
			var data = {
				action:"updateQuest",
				pictureId:picId,
			}
			//console.log(data);
			
			massSend.massSend(data,searchData);

	})
	})
}

function previousQuest(json){
	return new Promise(resolve => {
	//console.log("here4");
  var games = getGames.getGames();
	searchGamesById.searchGamesById(json.gameId).then((searchData) => {
		//console.log("here5");

			games[searchData]["selectedQuest"] -= 1;
			var temp = games[searchData]["selectedQuest"];
			//console.log(temp);
			var picId;
			if(temp < 0){
				temp = 3;
				games[searchData]["selectedQuest"] = 3;
			}
			//var hostPic = games[gameId]["selectedQuest"];
			let questPath = path.join(__dirname, '../questData/quests.json');
			var obj1 = fs.readFileSync(questPath, 'utf8');
			var obj = JSON.parse(obj1);
			picId = obj[temp];
			//console.log(picId);
			var data = {
				action:"updateQuest",
				pictureId:picId,
			}
			//console.log(data);
			massSend.massSend(data,searchData);

	})
	})
}
exports.nextQuest = nextQuest;
exports.previousQuest = previousQuest;
