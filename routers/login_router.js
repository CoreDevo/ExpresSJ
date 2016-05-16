var express = require('express');
var path = require('path');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var mongoService = require('../modules/mongo-service');
var proomURL = 'mongodb://localhost:27017/PrivateRooms';
var utils = require('../modules/utils');

router.get('/', function (req, res, next) {
	console.log("get login");
	res.sendFile(path.resolve('public/login.html'));
});

router.post('/generateAccessCode', function (req, res) {
	var accessCode = utils.generateID();
	var ifExist = true;
	mongo.connect(proomURL, function(err, db) {
		if(err) {
			console.log('err');
			console.log(err);
			return;
		}
		db.listCollections().toArray(function (err, items) {
			var array =items.map(function(col){return col['name'];});
			console.log(array);
			while(ifExist){
				if (items.length != 0 && array.indexOf(accessCode.toString()) != -1) {
					console.log('Re-generatng access code');
					accessCode = utils.generateID();
				} else {
					console.log('arrived here');
					ifExist = false;
					res.send({accessCode: accessCode});
					mongoService.createPrivateRoom(accessCode.toString(), console.log);
				}
			}
		});
	});
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
