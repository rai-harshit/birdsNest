const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('client-sessions');

const mongo_op = require('./mongo_op.js');
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const saltRounds = 10;

app.set('view engine','ejs');

app.use(express.static(__dirname+'/public'));
app.use(session({
  cookieName: 'loginSession', // cookie name dictates the key name added to the request object 
  secret: 'this_is_long_name_for_string_which_cannot_be_guessed_by_anyone', // should be a large unguessable string 
  //duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms 
  activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds 
}));


app.get('/',(req,res)=>{
	res.render('index',{
		title : "FloLabs : Home",
		css_file : "styles/home_style.css",
		js_file : 'js/api.js'
	});
});

app.get('/dashboard',(req,res)=>{
	res.render('dashboard',{
		title : "FloLabs : Dashboard",
		css_file : "styles/home_style.css",
	})
});

app.get('/test',(req,res)=>{
	res.render('test',{
		title : "FloLabs : Testing",
		css_file : "styles/home_style.css",
		js_file : ''
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
	user_data.data_source = req.body.data_source
	user_data.first_name = req.body.fname;
	user_data.last_name = req.body.lname;
	user_data.email = req.body.email;
	if(req.body.data_source==='facebook'|| req.body.data_source === 'google'){
		user_data.social_id = req.body.social_id;
		user_data.disp_picture = req.body.disp_picture;
		mongo_op.fb_google_signup(user_data,req,res);
	}
	if(req.body.pwd){
		user_data.account_status = 'unactivated';
		bcrypt.hash(req.body.pwd, saltRounds, (err,hash)=>{
			if(err){
				console.log("Error in generating the hash");
			}else{
				user_data.password = hash;
				//console.log(user_data);
				mongo_op.form_signup(user_data);
			};
		});
	}
});

app.listen(8080);