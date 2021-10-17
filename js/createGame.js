 var path = require('path');
 var fs = require('fs');
 let reqPath = path.join(__dirname, './sql.json');
 let questPath = path.join(__dirname, '../questData/quests.json');
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
			if(temp > 5){
				temp = 0;
				games[searchData]["players"][playerData]["avatar"]["avatarSlotId"] = 0;
			}
			picId = getPlayerPicId(temp);
			
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
function getPlayerPicId(temp){
	if(temp == 0){
				return "Boy1.jpg";
			}
			else if(temp == 1){
				return "Boy2.jpg";
			}
			else if(temp == 2){
				return "Boy1_0.jpg";
			}
			else if(temp == 3){
				return "Girl1_0.jpg";
			}
			else if(temp == 4){
				return "Girl1.jpg";
			}
			else if(temp == 5){
				return "Girl2.jpg";
			}
			else{
				return null;
			}
}

function previousPicture(json){
	return new Promise(resolve => {
	console.log("here4");
	searchGamesById(json.gameId).then((searchData) => {
		console.log("here5");
		searchPlayerId(json.playerId,searchData).then((playerData) =>{
			games[searchData]["players"][playerData]["avatar"]["avatarSlotId"] -= 1;
			var temp = games[searchData]["players"][playerData]["avatar"]["avatarSlotId"];
			var picId;
			if(temp < 0){
				temp = 5;
				games[searchData]["players"][playerData]["avatar"]["avatarSlotId"] = 5;
			}
			picId = getPlayerPicId(temp);
			
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
function findHostPictureId(temp){
	if(temp == 0){
				return "Book1.jpg";
			}
			else if(temp == 1){
				return "Book2.jpg";
			}
			else if(temp == 2){
				return "Book3.jpg";
			}
			else if(temp == 3){
				return "Book4.jpg";
			}
			else{
				return null;	
			}
			
}

function nextQuest(json){
	return new Promise(resolve => {
	console.log("here4");
	searchGamesById(json.gameId).then((searchData) => {
		console.log("here5");
		
			games[searchData]["selectedQuest"] += 1;
			var temp = games[searchData]["selectedQuest"];
			console.log(temp);
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
			console.log(data);
			massSend(json.gameId,data,searchData);
		
	})
	})
}

function previousQuest(json){
	return new Promise(resolve => {
	console.log("here4");
	searchGamesById(json.gameId).then((searchData) => {
		console.log("here5");
		
			games[searchData]["selectedQuest"] -= 1;
			var temp = games[searchData]["selectedQuest"];
			console.log(temp);
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
			console.log(picId);
			var data = {
				action:"updateQuest",
				pictureId:picId,
			}
			console.log(data);
			massSend(json.gameId,data,searchData);
		
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

async function syncGame(gameId,con){
	searchGamesById(gameId).then((gameId) => {
		playerSlots = games[gameId]["playerSlots"];
		syncPlayerSlots(gameId).then((slotData) => {
			var hostPic = games[gameId]["selectedQuest"];
			let questPath = path.join(__dirname, '../questData/quests.json');
			var obj1 = fs.readFileSync(questPath, 'utf8');
			var obj = JSON.parse(obj1);
			console.log(obj[hostPic]);
			
			var syncData = {
				action:"syncGame",
				playerSlots:playerSlots,
				playerData:slotData,
				hostData:obj[hostPic]
			}
			console.log(syncData);
			console.log("This is sync data");
			con.sendUTF(JSON.stringify(syncData));
		})
	})	
}

function syncPlayerSlots(gameId){
	return new Promise(resolve => {
		var players = games[gameId]["players"];
		var picSyncDataArr = [];
		for(var i =0; i < players.length; i++){
			var pic = getPlayerPicId(players[i]["avatar"]["avatarSlotId"]);
			var playerId = players[i]["playerId"];
			var picSyncData = {
				playerId:playerId,
				picId:pic
			}
			picSyncDataArr.push(picSyncData);
			
		}
		resolve(picSyncDataArr);
	})
}

exports.createGame = createGame;
exports.searchGamesById = searchGamesById;
exports.addPlayer = addPlayer;
exports.nextPicture = nextPicture;
exports.previousPicture = previousPicture;
exports.nextQuest = nextQuest;
exports.previousQuest = previousQuest;
exports.syncGame = syncGame;