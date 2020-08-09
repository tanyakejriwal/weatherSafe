var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
const {OAuth2Client} = require('google-auth-library');


app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

app.get('/index.html', function(req, res){
	console.log("index.html");
	res.sendFile(__dirname +"/"+"index.html");
})

app.post('/process_post', function(req, res){
	console.log("wtf");
	console.log(req.body);
	const data = req.body;
	res.json({
		status: 'success',
		latitude: data.lat,
		longitude: data.lon
	});
	res.end()
});

app.post('/weather_post', urlencodedParser, function(request, response){
	const data = request.body;
	console.log(data, request.body.windy);
	//res.sendFile(_dirname+ "/" + "homepage.html");
	//response.sendFile(__dirname +"/public/"+ "homepage.html");
	response.end();
})

app.post('/email_id', function(req, res){
	var CLIENT_ID = "997136515621-ss186ta0un8qrku2ipepel41b9kvbjl4.apps.googleusercontent.com";
	const client = new OAuth2Client(CLIENT_ID);
	async function verify() {
	  const ticket = await client.verifyIdToken({
		  idToken: req.body.id_token,
		  audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
	  });
	  const payload = ticket.getPayload();
	  const userid = payload['sub'];
	  // If request specified a G Suite domain:
	  // const domain = payload['hd'];
	  console.log(userid);
	  console.log(payload['iss']);
	  console.log(payload['email']);
	}
	verify().catch(console.error);
	//const myurl = {url:"/index.html"}
	//res.send(JSON.stringify(myurl));
	//res.end();
	//IF NO ERROR FOUND:
	res.json({cont: "yes"});
	
})

var server = app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})
