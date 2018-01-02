const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const mongo_op = require('./mongo_op.js');
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const saltRounds = 10;
app.use(express.static(__dirname+'/public'));
app.set('view engine','ejs');


app.get('/',(req,res)=>{
	res.render('index',{
		title : "FloLabs : Home",
		css_file : "styles/home_style.css",
		js_file : 'js/api.js'
	});
})

app.post('/login_verification',urlencodedParser,(req,res)=>{
	//console.log(req.body.email);
	var login_data = new Object();
	login_data.email = req.body.email;
	login_data.password = req.body.pwd;
	//console.log(login_data);
	mongo_op.accLogin(login_data);

});

app.post('/signup_verification',urlencodedParser,(req,res)=>{
	var user_data = new Object();
	if(req.body.data_source==='facebook'|| req.body.data_source === 'google'){
		user_data.id = req.body.id;
		user_data.picture = req.body.disp_picture;
	}
	user_data.first_name = req.body.fname;
	user_data.last_name = req.body.lname;
	user_data.email = req.body.email;
	if(req.body.data_source==='facebook'){
		user_data.gender = req.body.gender;
	}
	if(req.body.pwd){
		bcrypt.hash(req.body.pwd, saltRounds, (err,hash)=>{
			if(err){
				console.log("Error in generating the hash");
			}else{
				user_data.password = hash;
				//console.log(user_data);
				mongo_op.createAccount(user_data,'accounts');
			};
		});
	}
	else{
		mongo_op.insertData(user_data,'accounts');
	}
	//console.log("FINAL : ",user_data);
});

app.listen(8080);