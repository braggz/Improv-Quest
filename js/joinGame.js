  var path = require('path');
 var fs = require('fs');
  var uuid = require('uuid');
 let reqPath = path.join(__dirname, './sql.json');
 let rawdata = fs.readFileSync(reqPath);
 let json = JSON.parse(rawdata);
 var mysql = require('mysql');
var searchGamesById = require("./createGame.js");
var addPlayer = require("./createGame.js");
var con= mysql.createPool({
	  host: json.host,
	  user: json.user,
	  password: json.password,
	  database: json.database
	});
 async function joinGame(gameId,connection){
	return new Promise(resolve => {
		searchGamesById.searchGamesById(gameId).then((searchRes) =>{
			console.log(gameId);
			var playerId = uuid.v4();
			assignId(playerId,connection);
      

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
