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
			var playerId = uuid.v4();
			var player = {
				name:"name",
				connection:connection,
				avatarId:"test",
				gameId:gameId,
				playerId:playerId,
			}
			addPlayer.addPlayer(searchRes,player).then((addRes) => {
				resolve(player);
			})
			
		});
	});
}

exports.joinGame = joinGame;