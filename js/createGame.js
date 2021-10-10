 var path = require('path');
 var fs = require('fs');
 let reqPath = path.join(__dirname, './sql.json');
 let rawdata = fs.readFileSync(reqPath);
 let json = JSON.parse(rawdata);
 var mysql = require('mysql');
 var uuid = require('uuid');
 
 
	var con= mysql.createPool({
	  host: json.host,
	  user: json.user,
	  password: json.password,
	  database: json.database
	});

 async function createGame(data){
	 return new Promise(resolve => {
	var gameId = uuid.v4();
	  con.query("INSERT INTO game (gameId,gameTitle,activePlayers) VALUES ('"+gameId+"','"+data.title+"','0')" ,function (err, result) {
	  console.log(result)
	 if(err){
       console.log(err);
         var data = {
           code:300,
           errorMessage:"Could not insert client, please try again"
         }
          resolve(false);
     }
	 else{
		 resolve(gameId);
		 console.log("game created");
	 }
  });
});


}
exports.createGame = createGame;