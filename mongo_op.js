const bcrypt = require('bcrypt');
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'FloLabs';
const saltRounds = 10;

var createAccount = (data,collection_name)=>{
	//console.log(data);
	//console.log(collection_name);
	MongoClient.connect(url,(err,client)=> {
		if(err){
			return("Error Occured while connecting to the Database.");
		}

		//console.log("Successfully connected to the Database.");
		const db = client.db(dbName);
		const collection = db.collection(collection_name);
		
		collection.find({email : data.email}).toArray((err, result)=>{
		    if (err) throw err;
		    //console.log(hash);
		    //console.log(data.password);
		    if(result.length > 0){
		    	console.log("Email ID is already in use with another account.");
		    }else{
		    	collection.insert(data,(err,res)=>{
		    		if(err){
		    			console.log("Could not create account at the moment. Try again later.")
		    		}else{
		    			console.log("Successfully created a new account.");
		    			client.close();
		    		}
		    	});  	
		    }
  		});
	});
};


var accLogin = (data)=>{
	MongoClient.connect(url,(err,client)=>{
		if(err){
			return("Error Occured while connecting to the Database.");
		}

		const db = client.db(dbName);
		const collection = db.collection('accounts');

		collection.find({email: data.email}).toArray((err, result)=>{
			if(err) throw err;
			if(result.length == 0){
				console.log("Account with provided email does not exist. Create an account now !");
			}
			else{
				pass_hash = result[0].password;
				bcrypt.compare(data.password, pass_hash, (err,res)=>{
					if(err){
						console.log("Error Occured while logging in.");
					}else{
						if(res == true){
							console.log("Correct credentials provided. Logging into your account...");
						}else{
							console.log("You've entered a wrong password. Please try again.");
						}	
					}
				});
			}
		});
	});
};


module.exports = {
	createAccount,
	accLogin
}