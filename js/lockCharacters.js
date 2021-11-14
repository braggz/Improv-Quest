var searchGamesById = require("./searchGamesById.js");
var searchPlayerId = require("./searchGamesById.js");
var getGames = require("./createGame.js");
var path = require('path');
var fs = require('fs');
var massSend = require("./massSend.js");

function lockCharacter(data){
  var games = getGames.getGames();
//  console.log(data);
	searchGamesById.searchGamesById(data.gameId).then((gameId) => {
		searchPlayerId.searchPlayerId(data.playerId,gameId).then((playerData) =>{

      var picSlot = games[gameId]["players"][playerData]["avatar"]["avatarSlotId"];
      var saveData = data;
       searchLockedSlots(gameId,picSlot).then((lockData)=>{

         if(!lockData){
           games[gameId]["players"][playerData]["avatar"]["locked"] = true;

    			var slotId = games[gameId]["players"][playerData]["avatar"]["avatarSlotId"];
    			let questPath = path.join(__dirname, '../questData/players.json');
    			var obj1 = fs.readFileSync(questPath, 'utf8');
    			var obj = JSON.parse(obj1);
    			var pic = obj[slotId];
    			var brodData = {
    				action:"lockedCharacter",
    				playerId:saveData.playerId,
    				pictureId:pic,
    				playersPicId:games[gameId]["playerSlots"]
    			}
    			massSend.massSend(brodData,gameId);
        }
        else{
          var con = games[gameId]["players"][playerData]["connection"];
          console.log(con);
          var data = {
            action:"characterIsLocked"
          }
          con.sendUTF(JSON.stringify(data));
        }
      });
		});
	});
}

function searchLockedSlots(gameId,picId){
  var games = getGames.getGames();
	return new Promise(resolve => {
		for(var i=0;i<games[gameId]["players"].length;i++){
			player = games[gameId]["players"][i];
			if(player.avatar.locked == true && player.avatar.avatarSlotId == picId){
				resolve(true);
			}
		}
		resolve(false);
	});
}

function unlockCharacter(data){
  var games = getGames.getGames();
//  console.log(data);
	searchGamesById.searchGamesById(data.gameId).then((gameId) => {
		searchPlayerId.searchPlayerId(data.playerId,gameId).then((playerData) =>{

      var picSlot = games[gameId]["players"][playerData]["avatar"]["avatarSlotId"];
      var saveData = data;
       searchLockedSlots(gameId,picSlot).then((lockData)=>{

         if(lockData){
           games[gameId]["players"][playerData]["avatar"]["locked"] = false;

    			var slotId = games[gameId]["players"][playerData]["avatar"]["avatarSlotId"];
    			let questPath = path.join(__dirname, '../questData/players.json');
    			var obj1 = fs.readFileSync(questPath, 'utf8');
    			var obj = JSON.parse(obj1);
    			var pic = obj[slotId];
    			var brodData = {
    				action:"unlockedCharacter",
    				playerId:saveData.playerId,
    				pictureId:pic,
    				playersPicId:games[gameId]["playerSlots"]
    			}
    			massSend.massSend(brodData,gameId);
        }
      });
		});
	});
}

exports.lockCharacter = lockCharacter;
exports.unlockCharacter = unlockCharacter;
