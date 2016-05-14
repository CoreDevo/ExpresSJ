var express = require('express');
var path = require('path');
var mongo = require('mongodb').MongoClient;
var mongoService = require('../modules/mongo-service');
var router = express.Router();
var proomURL = 'mongodb://localhost:27017/PrivateRooms';

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

router.post('/generateAccessCode', function (req, res) {
	var accessCode = randomBasic();
	var ifExist = true;

	mongo.connect(proomURL, function(err, db) {
		if(err) {
			console.log(err);
			return;
		}
		while(ifExist) {
			db.listCollections({_id: accessCode}).toArray(function (err, items) {
				if (items.length !== 0) {
					console.log('Re-generatng access code');
					accessCode = randomBasic();
				} else {
					ifExist = false;
					res.send({accessCode: accessCode});
					mongoService.createPrivateRoom(accessCode, console.log);
				}
			});
		}
	});
});

function randomBasic() {
	return Math.floor(Math.random() * 6) + 1;
}

module.exports = router;