const cron = require("node-cron");
cron.schedule("* 5 * * *", function(){


const {google} = require('googleapis');
const fs = require('fs');
const readline = require('readline');


var axios = require('axios');
var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://TanyaK:wwenadtd9@cluster0.6ymkm.azure.mongodb.net/WeatherSafe?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true,  useUnifiedTopology: true }); //my own change
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


var User_Data = require("./models/user_data")
getData();
async function getData(){
    console.log("in");
    var alldocs = await User_Data.find();
    getWeather(alldocs[1]);

    
}

function createEvent (tokens, list){
    fs.readFile('credentials.json', (err, content) => {
        if(err) return console.log('Error loading client secret file:', err);
        var credentials = JSON.parse(content);
        const {client_secret, client_id, redirect_uris} = credentials.web;
        const oAuth2Client = new google.auth.OAuth2( client_id, client_secret, redirect_uris[0]);
        oAuth2Client.setCredentials(JSON.parse(tokens));
        const calendar = google.calendar({version: 'v3', auth: oAuth2Client})
        const eventStartTime = new Date();
        eventStartTime.setDate(eventStartTime.getDay()+2);
        const eventEndTime = new Date();
        eventEndTime.setDate(eventEndTime.getDay() + 2);
        eventEndTime.setMinutes(eventEndTime.getMinutes() + 45);

        const event = {
            summary: list[0],
            location: 'none',
            description: 'dont forget to check weather',
            start:{
                dateTime: eventStartTime,
                timeZone: 'America/Denver',
            },
            end: {
                dateTime: eventEndTime,
                timeZone: 'America/Denver'

            },
            colorId: 1,
        }
        calendar.events.insert({calendarId: 'primary', resource: event}, err => {
            if(err) return console.error("Calendar event creation error",err);
            else console.log('done');
        })

    })
}

function getWeather(doc){
    var latitude = doc.location.lat;
    var longitude = doc.location.lon;
    axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&
    exclude=minutely&appid=${API_KEY}`).then(response => {
        var hourly = response.data.hourly.slice(doc.notification - 5, 24);
        
        var calendarEvents = [];
        console.log(doc.preference);
        if (doc.preference.includes("Rainy")){
            console.log("in rainy");
            var types = ['Thunderstorm', 'Drizzle', 'Rain' ];
            var ans = weatherArray(hourly, types);
            if(ans)
                calendarEvents.push('Rain');
        }
        if(doc.preference.includes("Sunny")){
            var types = ['Clear'];
            var ans = weatherArray(hourly, types);
            if (ans)
                calendarEvents.push('Sunny');
        }
        /*if("Windy" in preference)
        {   
            var types = [];

        }*/
        if(doc.preference.includes("Cloudy")){
            var ans = weatherArray(hourly, ["Clouds"]);
            if (ans)
                calendarEvents.push('Cloudy');
        }
        console.log(calendarEvents);
        createEvent(doc.tokens, calendarEvents);
    })

}

function weatherArray (weatherObject, types){
   var array = [];
    console.log("IN HERE");
    for(var i =0; i<weatherObject.length; i++)
    {
        for(var j =0; j<weatherObject[i].weather.length; j++)
        {
            weather = weatherObject[i].weather[j].main;
            array.push(weather);
            if(types.includes(weather)) {
                console.log(array);
                return true;
            }
        }  
    }
    console.log(array);
    return false;
}


})
