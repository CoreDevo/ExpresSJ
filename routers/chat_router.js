/**
 * Created by JyaouShingan on 2016-05-09.
 */

var express = require('express');
var path = require('path');
var router = express.Router();

//Temp solution for NoName user gettin chat
//TODO: add friendly alert maybe? NOT NOW!
/*JUST DONT VISIT CHAT DIRECTLY PLS.
 app.get('/chat', function (req, res) {
 res.redirect('/login');
 console.log('chat redirecting to login');
 });*/

router.get('/', function (req, res, next) {
	if(req.cookies["shouldProcessChat"] === 'true') {
		// This line currently causing problem
		//res.cookie('shouldProcessChat', false, {path: '/'});
		res.sendFile(path.resolve('public/chat.html'));
	} else {
		res.clearCookie('userID', {path: '/'});
		res.clearCookie('shouldProcessChat', {path: '/'});
		res.redirect('/login');
	}
});

module.exports = router;
