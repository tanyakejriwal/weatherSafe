const User_Data = require('../models/user_data');
const session = require('express-session');
const async = require('async');
const path = require('path');

exports.handle_prefer = function(req, res){
    if(!req.session.token){ //here is where templates are usefull, I want to send an alret with login page
        console.log('redirecting to login..')
        res.redirect(302,'http://localhost:8080/homepage'); //Idk this if statement is needed now.
    }
    else{
        //console.log('sending preference.html file')
        res.sendFile(path.join(__dirname, '../views', '/preference.html'));
    }
    /*console.log("request token:", req.session.token);
    res.sendFile(path.join(__dirname, '../views', '/preference.html'));*/
    //res.sendFile(path.join(__dirname, '../views', '/preference.html'));
};

exports.location_handler = function (req, res) {
    console.log('got user location');
    const data = req.body;
    req.session.lat = data.lat;
    req.session.lon = data.lon;
	res.end();  
};

exports.form_handler = function(req, res){
    console.log("request body:", req.body);
    var userdata = [];
    if(req.body.rainy)
        userdata.push(req.body.rainy);
    if(req.body.windy)
        userdata.push(req.body.windy);   
    if(req.body.sunny)
        userdata.push(req.body.sunny);
    if(req.body.cloudy)
        userdata.push(req.body.cloudy);
    console.log("userdata array:", userdata);
    req.session.preference = userdata;
    var notif = req.body.notification;
    req.session.notification = notif;
    res.render('index', {userdata, notif});
}

exports.display = async function(req, res){
    const doc = await User_Data.findOne({email_id: req.session.token});
    var userdata = doc.preference;
    var notif = doc.notification;
    res.render('index', {userdata, notif});
}

exports.signout = async function(req, res){
    console.log(req.session);
    if(req.session.user_exits)
    {
        console.log("updating document");
        const doc = await User_Data.findOne({ email_id: req.session.token });
        if(req.session.tokens)
                doc.tokens = req.session.tokens;
        if(req.session.lat){
            doc.location.lat = req.session.lat;
            doc.location.lon = req.session.lon;
        }
        if(req.session.preference){
            doc.preference = req.session.preference;
            doc.notification = req.session.notification;
        }
        doc.save((err,doc ) => {
            if(err) console.log("Error saving the document: ",err );
            console.log("document saved successfully");
        })
    }
    else{
        console.log("creating new document");
        const dataobject = {
            email_id: req.session.token,
            tokens: req.session.tokens,
            location: {
                lat: req.session.lat,
                lon: req.session.lon,
            },
            preference: req.session.preference,
            notification: req.session.notification
        }
        var newdoc = new User_Data(dataobject);
        newdoc.save((err,doc ) => {
            if(err) console.log("Error saving the document: ",err );
            console.log("document saved successfully");
        })
    }

    res.redirect(302,"http://localhost:8080/homepage");
}