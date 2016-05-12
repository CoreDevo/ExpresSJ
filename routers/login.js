var express = require('express');
var path = require('path');
var router = express.Router();

router.get('/', function (req, res, next) {
	console.log("get login");
	res.sendFile(path.resolve('public/login.html'));
});

router.post('/', function (req, res, next) {
	var username = req.body.name;
	console.log("new user name: " + username)
	//TODO: check if username exists
	roomUsers['lobby'].push(username);
	console.log('User in lobby: ' + roomUsers['lobby']);
	console.log(req.body.name + " cached");
	res.cookie("userID", req.body.name, {maxAge: 1000*60*60*24*30});
	res.cookie("shouldProcessChat", true, {maxAge: 1000*10});
	res.redirect('/chat');
});


module.exports = router;