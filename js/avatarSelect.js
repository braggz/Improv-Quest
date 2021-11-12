var getGames = require("./createGame.js");
var searchGamesById = require("./searchGamesById.js");
var searchPlayerId = require("./searchGamesById.js");
var massSend = require("./massSend.js");

var path = require('path');
var fs = require('fs');

function nextPicture(json,con){
	return new Promise(resolve => {
    var games = getGames.getGames();
//	//console.log("here4");
	searchGamesById.searchGamesById(json.gameId).then((searchData) => {
//		//console.log("here5");
		searchPlayerId.searchPlayerId(json.playerId,searchData).then((playerData) =>{
			if(games[searchData]["players"][playerData]["avatar"]["locked"] == false){
				games[searchData]["players"][playerData]["avatar"]["avatarSlotId"] += 1;
				var temp = games[searchData]["players"][playerData]["avatar"]["avatarSlotId"];
				var picId;
				if(temp > 5){
					temp = 0;
					games[searchData]["players"][playerData]["avatar"]["avatarSlotId"] = 0;
				}
				let questPath = path.join(__dirname, '../questData/players.json');
				var obj1 = fs.readFileSync(questPath, 'utf8');
				var obj = JSON.parse(obj1);
				picId = obj[temp];

				var data = {
					action:"updatePicture",
					playerId:json.playerId,
					pictureId:picId,
					playersPicId:games[searchData]["playerSlots"]
				}
			//	//console.log(data);
				massSend.massSend(data,searchData);
			}
			else{
				var data = {
					action:"ierror",
					message:"You are Locked Bro"
				}
				con.sendUTF(JSON.stringify(data));
			}
		})
	})
	})
}


function previousPicture(json,con){
	return new Promise(resolve => {
    var games = getGames.getGames();
//	//console.log("here4");
	searchGamesById.searchGamesById(json.gameId).then((searchData) => {

	//	//console.log("here5");
		searchPlayerId.searchPlayerId(json.playerId,searchData).then((playerData) =>{
			if(games[searchData]["players"][playerData]["avatar"]["locked"] == false){
				games[searchData]["players"][playerData]["avatar"]["avatarSlotId"] -= 1;
				var temp = games[searchData]["players"][playerData]["avatar"]["avatarSlotId"];
				var picId;
				if(temp < 0){
					temp = 5;
					games[searchData]["players"][playerData]["avatar"]["avatarSlotId"] = 5;
				}
				let questPath = path.join(__dirname, '../questData/players.json');
				var obj1 = fs.readFileSync(questPath, 'utf8');
				var obj = JSON.parse(obj1);
				picId = obj[temp];

				//
				//var locked =
				var data = {
					action:"updatePicture",
					playerId:json.playerId,
					pictureId:picId,
					playersPicId:games[searchData]["playerSlots"],

				}
				//console.log(data);
				massSend.massSend(data,searchData);
			}
			else{
				var data = {
					action:"ierror",
					message:"You are Locked Bro"
				}
				con.sendUTF(JSON.stringify(data));
			}
		})
	})
	})
}


exports.nextPicture = nextPicture;
exports.previousPicture = previousPicture;
