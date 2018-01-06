const bcrypt = require('bcrypt');
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'FloLabs';
const saltRounds = 10;

var form_signup = (data)=>{
	//console.log(data);
	//console.log(collection_name);
	MongoClient.connect(url,(err,client)=> {
		if(err){
			return("Error Occured while connecting to the Database.");
		}

		//console.log("Successfully connected to the Database.");
		const db = client.db(dbName);
		const collection = db.collection('accounts');
		
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
		    			console.log("Successfully created a new account.Please check your email to confirm the account activation.");
		    			client.close();
		    		}
		    	});  	
		    }
  		});
	});
};





var fb_google_signup = (data,req,res)=>{
	MongoClient.connect(url,(err,client)=> {
		if(err){
			return("Error Occured while connecting to the Database.");
		}

		//console.log("Successfully connected to the Database.");
		const db = client.db(dbName);
		const collection = db.collection('accounts');
		
		collection.find({email:data.email,social_id:data.social_id}).toArray((err, result)=>{
		    if (err) throw err;
		    //console.log(hash);
		    //console.log(data.password);
		    if(result.length > 0){
		    	console.log("Account found. Redirecting to your Dashboard...");
		    }else{
		    	collection.insert(data,(err,res)=>{
		    		if(err){
		    			console.log("Could not create account at the moment. Try again later.")
		    		}else{
		    			console.log("Successfully created a new account. Redirecting you to your Dashboard.")
		    			client.close();
		    		}
		    	});  	
		    }
  		});
	});	
}





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
							console.log("Correct credentials provided. Redirecting you to your Dashboard.");
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
	form_signup,
	fb_google_signup,
	accLogin,
}