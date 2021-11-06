 var path = require('path');
 var fs = require('fs');
 let reqPath = path.join(__dirname, './sql.json');
 let questPath = path.join(__dirname, '../questData/quests.json');


 var uuid = require('uuid');
 var searchGamesById = require("./searchGamesById.js");
 var searchPlayerId = require("./searchGamesById.js");
 var massSend = require("./massSend.js");


 var games = [];


  function getGames(){
    return games;
  }

 async function createGame(data,connection){
	 return new Promise(resolve => {
		//searchGames.then((searchData) => {

				var gameId = uuid.v4();
				var connections = [];
				connections.push(connection);
				var game = {
					title:"Title",
					players:[],
					id:gameId,
					activePlayers:0,
					connections:connections,
					selectedQuest:0,
					host:{
						avatart:"test"
					},
					playerSlots:{
						playerOneSlotId:null,
						playerTwoSlotId:null,
						playerThreeSlotId:null,
						playerFourSlotId:null,
					},
				}
			//	//console.log(game);

				games.push(game);
			//	//console.log(games);
				resolve(game);

		//});

	});
}

















exports.getGames =getGames;
exports.createGame = createGame;
