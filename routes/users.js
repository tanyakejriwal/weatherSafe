var user_preference = require('../controllers/user_preference')
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var login = require('../controllers/login');
const authorize = require('../controllers/auth_controller');


/* GET users listing. */
router.post('/', login.user_login );
router.get('/preference', user_preference.handle_prefer);
/*router.get('/preference', function(req, res){
    console.log('redirecting to login..')
    res.redirect(302,'http://localhost:8080/homepage');
});
*/
router.get('/', function(req, res){
  res.send("in");
})
router.get('/auth',authorize.auth_function);
router.get('/signout', user_preference.signout);
router.post('/location', user_preference.location_handler);
router.post('/form', urlencodedParser, user_preference.form_handler);
router.get('/yourpage', user_preference.display);  
module.exports = router;
