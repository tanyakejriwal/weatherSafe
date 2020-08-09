const User_Data = require('../models/user_data');
const session = require('express-session');
const {OAuth2Client} = require('google-auth-library');
const async = require('async');

exports.user_login = function(req, res){
    async.waterfall([
    function (callback){
        var CLIENT_ID = "997136515621-ss186ta0un8qrku2ipepel41b9kvbjl4.apps.googleusercontent.com";
        const client = new OAuth2Client(CLIENT_ID);
        async function verify() {
          const ticket = await client.verifyIdToken({
              idToken: req.body.id_token,
              audience: CLIENT_ID,  
          });
          const payload = ticket.getPayload();
          const userid = payload['sub'];  // If request specified a G Suite domain: // const domain = payload['hd'];
          console.log('email verified successfully');
          callback(null, userid);
        }
        verify().catch((error) => {
            console.log('Verification failed');
            console.log(error);
            res.end();
        });
    },
    function(userid,callback){
        console.log("finding user..");
        User_Data.findOne({ email_id: userid }, function(err, doc){
            callback(null, doc, userid);
        });
        //console.log(user);
        //callback(null, userid);
    }
],
    function(err, doc, userid) {
       if(err) 
       {
           console.log(err);
           res.end();
       } 
       if(doc == null)
       {
           console.log("no user found, creating new user");
           req.session.user_exits = false;
           req.session.token = userid;
           console.log('user token:', req.session.token);
           res.redirect(302, "/users/auth"); //for prefernce.html add if user access if without loged in then error //CHECK IF 308 OR 302
       }
       else{
           console.log('User found!');
           req.session.user_exits = true;
           req.session.token = userid;
           if(!doc.tokens)
           {
               console.log('redirecting to authorization..');
               res.redirect(302,"/users/auth");
           }
           else if(Object.keys(doc.location).length == 0 || doc.preference.length == 0)
           {
                console.log('redirecting to preference page');
                res.redirect(302, "/users/preference");
           }
           else{
            console.log('everything is found') //use jquery to have all fields before the submit button is enabled
            res.redirect(302, "/users/yourpage");
           }
       }
       //create session
       //IF NO ERROR FOUND:
       //res.redirect(308, "/index.html");
   }

);
}


