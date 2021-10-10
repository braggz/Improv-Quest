  var path = require('path');
 var fs = require('fs');
 let reqPath = path.join(__dirname, './sql.json');
 let rawdata = fs.readFileSync(reqPath);
 let json = JSON.parse(rawdata);
 var mysql = require('mysql');

var con= mysql.createPool({
	  host: json.host,
	  user: json.user,
	  password: json.password,
	  database: json.database
	});
	
function joinGame(gameId){
	return new Promise(resolve => {
	console.log("gameid");
	  con.query("SELECT  * FROM game WHERE gameId='"+gameId+"'" ,function (err, result) {
	  console.log(result)
	 if(err){
       console.log(err);
         var data = {
           code:300,
           errorMessage:"Could not insert client, please try again"
         }
         // resolve(false);
     }
	 else{
		// resolve(gameId);
		var player = result[0]["activePlayers"];
				con.query("UPDATE game SET activePlayers='"+(player+1)+"' WHERE gameId='"+gameId+"'" ,function (err, result) {
			  console.log(result)
			 if(err){
			   console.log(err);
				 var data = {
				   code:300,
				   errorMessage:"Could not insert client, please try again"
				 }
				 // resolve(false);
			 }
			 else{
				 
			 }
			})
	 }
  });
});
}

exports.joinGame = joinGame;