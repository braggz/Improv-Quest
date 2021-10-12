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
					},
					playerSlots:{
						playerOneSlotId:null,
						playerTwoSlotId:null,
						playerThreeSlotId:null,
						playerFourSlotId:null,
					},
				}
			//	console.log(game);
				games.push(game);
			//	console.log(games);
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

async function searchPlayerId(id,index){
	return new Promise(resolve => {
		for(var i =0; i < games[index]["players"].length; i++){
			console.log(games[index]["players"][i]["playerId"])
			if(games[index]["players"][i]["playerId"] == id){
				resolve(i);
			}
		}
	})
}

async function addPlayer(index,player){
	
	return new Promise(resolve => {
		//console.log(index);
		
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
	
	for(var i =0; i < games.length; i++){
		if(games[i]["id"] == id){
			//console.log(games[i].connections.length);
		//console.log("length");
			for(var j =0; j < games[i]["connections"].length;j++){
				var con = games[i]["connections"][j];
				var data = {
					action:"joinedGame",
					playerId:playerId,
					playerCount:games[i]["players"].length,
					playerPicSlots:games[i]["playerSlots"]
				}
				con.sendUTF(JSON.stringify(data));
				//console.log("send");
				
			}
			break;
		}
	}
}

function pickPicSlot(index,playerId,player){
	var slotNum = (games[index].players.length)
	
	if(slotNum == 1){
		games[index].playerSlots.playerOneSlotId = playerId;
	}
	else if(slotNum == 2){
		games[index].playerSlots.playerTwoSlotId = playerId;
	}
	else if(slotNum == 3){
		games[index].playerSlots.playerThreeSlotId = playerId;
	}
	else if(slotNum == 4){
		games[index].playerSlots.playerFourSlotId = playerId;
	}
}

function nextPicture(json){
	return new Promise(resolve => {
	console.log("here4");
	searchGamesById(json.gameId).then((searchData) => {
		console.log("here5");
		searchPlayerId(json.playerId,searchData).then((playerData) =>{
			games[searchData]["players"][playerData]["avatar"]["avatarSlotId"] += 1;
			var temp = games[searchData]["players"][playerData]["avatar"]["avatarSlotId"];
			var picId;
			if(temp == 0){
				picId = "Boy1.jpg";
			}
			else if(temp == 1){
				picId = "Boy2.jpg";
			}
			else if(temp == 2){
				picId = "Boy1_0.jpg";
			}
			else if(temp == 3){
				picId = "Girl1_0.jpg";
			}
			else if(temp == 4){
				picId = "Girl1.jpg";
			}
			else if(temp == 5){
				picId = "Girl2.jpg";
			}
			var data = {
				action:"updatePicture",
				playerId:json.playerId,
				pictureId:picId,
				playersPicId:games[searchData]["playerSlots"]
			}
			console.log(data);
			massSend(json.gameId,data,searchData);
		})
	})
	})
}

function massSend(gameId,data,index){
	for(var i =0; i < games[index]["connections"].length;i++){
		console.log("fuck")
		con = games[index]["connections"][i];
		con.sendUTF(JSON.stringify(data));
	}
}
exports.createGame = createGame;
exports.searchGamesById = searchGamesById;
exports.addPlayer = addPlayer;
exports.nextPicture = nextPicture;