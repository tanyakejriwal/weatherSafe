var express = require('express');
var router = express.Router();
var path = require('path');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var auth_controllers = require("../controllers/auth_controller");
/* GET home page. */
router.get('/homepage', function(req, res, next) {  //SHOULD I USE A SENDFILE HERE?
  res.sendFile(path.join(__dirname, '../public'+'/homepage.html'));
});
router.get('/', urlencodedParser, auth_controllers.getTokens);

module.exports = router;
