 var path = require('path');
 var fs = require('fs');
 let reqPath = path.join(__dirname, './sql.json');
 let rawdata = fs.readFileSync(reqPath);
 let json = JSON.parse(rawdata);
 var mysql = require('mysql');
 var uuid = require('uuid');
 
 var games = [];
	var con= mysql.createPool({
	  host: json.host,
	  user: json.user,
	  password: json.password,
	  database: json.database
	});

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
					host:{
						avatart:"test"
					}
				}
			//	console.log(game);
				games.push(game);
				console.log(games);
				resolve(game);
			
		//});
		
	});
}


async function searchGamesById(id){
	return new Promise(resolve => {
		for(var i =0; i < games.length; i++){
			if(games[i]["id"] == id){
				resolve(i);
			}
		}
	})
}

async function addPlayer(index,player){
	
	return new Promise(resolve => {
		console.log(index);
		games[index]["players"].push(player);
		if(games[index]["activePlayers"] <= 3){
			games[index]["activePlayers"]+=1;
			playerJoined(games[index]["id"],player.playerId);
			var data = {
				success:true,
				players:games[index]["activePlayers"]
				
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
	for(var i =0; i < games.length; i++){
		if(games[i]["id"] == id){
			for(var j =0; j < games[i]["connections"].length;j++){
				var con = games[i]["connections"][j];
				var data = {
					action:"joinedGame",
					playerId:playerId,
					playerCount:games[i]["players"].length
				}
				con.sendUTF(JSON.stringify(data));
				console.log("send");
				
			}
			break;
		}
	}
}
exports.createGame = createGame;
exports.searchGamesById = searchGamesById;
exports.addPlayer = addPlayer;