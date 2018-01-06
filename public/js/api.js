window.fbAsyncInit = function() {
	FB.init({
	      appId            : '167899873956928',
	      autoLogAppEvents : false,
	      xfbml            : true,
	      version          : 'v2.11',
	      oauth			   : true,
	      cookie		   : true
	});

	FB.getLoginStatus((response)=>{
		statusChangeCallback(response);
	});

};


(function(d, s, id){
	 var js, fjs = d.getElementsByTagName(s)[0];
	 if (d.getElementById(id)) {return;}
	 js = d.createElement(s); js.id = id;
	 js.src = "https://connect.facebook.net/en_US/sdk.js";
	 fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function statusCheck(){
	FB.getLoginStatus((response)=>{
		statusChangeCallback(response);
	});
}


function statusChangeCallback(response){
	if(response.status === 'connected'){
		console.log("Connected");
		fb_login(response);
	}else{
		console.log("Not Connected");
	}
}
//function used to login to facebook and get all user data
function fb_login(response){
	FB.api('/me',{ fields: 'id, first_name, last_name, email, age_range, picture' }, function(response) {
        console.log('Good to see you, ' + response.first_name + '.');
        var fb_data = {
       	data_source : 'facebook',
       	social_id : response.id,
       	fname : response.first_name,
       	lname : response.last_name,
       	email : response.email,
       	gender : response.gender,
       	disp_picture : response.picture.data.url
        }		
        console.log(fb_data);		       
		$.ajax({
		  type: 'POST',
		  url: '/signup_verification',
		  data: fb_data,
		  async:true
		});
 	});
}







function onSignIn(googleUser) {
	var d_token = googleUser.getAuthResponse().id_token;
	// console.log("Authentication Token : ",d_token);
	var profile = googleUser.getBasicProfile();
	// console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
	// console.log('First Name: ' + profile.getGivenName());
	// console.log('Image URL: ' + profile.getImageUrl());
	// console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
	// console.log('Last Name: ' + profile.getFamilyName());
	var google_data = {
		data_source : 'google',
		social_id : profile.getId(),
		fname :  profile.getGivenName(),
		lname : profile.getFamilyName(),
		email : profile.getEmail(),			
		disp_picture : profile.getImageUrl(),
	};
	console.log(google_data);
	$.ajax({
	  type: 'POST',
	  url: '/signup_verification',
	  data: google_data,
	  async: true
	});
	// console.log("Printing google_data started");
	//console.log(google_data);
	// console.log("Printing google_data finished");
	}

function signOut() {
	var auth2 = gapi.auth2.getAuthInstance();
	auth2.signOut().then(function () {
	   	console.log('User signed out.');
	});
}


