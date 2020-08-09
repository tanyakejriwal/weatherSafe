var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//in the future I would have a differnt model for geolocaiton
//so that I can group a particular geolocation and call the api for that once
//and from the geolocation model find the users that have that particular geolocation
//and create event, so I dont have to make api call for the same geolocation
// again and again

var userSchema = new Schema( //add validation later!
    {
        email_id: String,
        tokens: String,
        location: {
            lat: Number,
            lon: Number,
        },
        preference: [String],
        notification:  Number
    }
); 
module.exports = mongoose.model('User_Data', userSchema);

