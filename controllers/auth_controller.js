const User_Data = require('../models/user_data');
const path = require('path');
const fs = require('fs');
const readFile = require('readline');
const {google} = require('googleapis');
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const session = require('express-session');

exports.auth_function = function(req, res){

    fs.readFile(path.join(__dirname, '../credentials.json'), (err, content) => {
        if(err) return console.log("Error loading client secret file:", err);
        var credentials =JSON.parse(content);
        const {client_secret, client_id, redirect_uris} = credentials.web;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        const url = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        //res.header("Access-Control-Allow-Origin", "http//localhost:8080"); // update to match the domain you will make the request from
        //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        var url_string = ""+url;
        res.render("auth", {url_string});
    });
};

exports.getTokens = function(req, res){
    console.log(req.query.code);
    fs.readFile(path.join(__dirname, '../credentials.json'), (err, content) => {
        if(err) return console.log("Error loading client secret file:", err);
        var credentials =JSON.parse(content);
        const {client_secret, client_id, redirect_uris} = credentials.web;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        oAuth2Client.getToken(req.query.code, (err, token) => {
            console.log("in get token callback");
            if (err) return console.error('Error retrieving access token', err);
            // Store the token to disk for later program executions
            req.session.tokens = JSON.stringify(token);
            console.log("tokens:", req.session.tokens);
            res.redirect(302, "/users/preference");
        })
    })
    
};

function create_oauth2client (){
    console.log("in create oauth function");
    fs.readFile(path.join(__dirname, '../credentials.json'), (err, content) => {
        if(err) return console.log("Error loading client secret file:", err);
        var credentials =JSON.parse(content);
        const {client_secret, client_id, redirect_uris} = credentials.web;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        return oAuth2Client;
    })
}