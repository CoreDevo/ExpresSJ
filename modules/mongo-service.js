var mongo = require('mongodb').MongoClient;
var assert = require('assert');

var usersURL = 'mongodb://localhost:27017/Users';
var chatlogURL = 'mongodb://localhost:27017/ChatLogs';
var proomURL = 'mongodb://localhost:27017/PrivateRooms';

var storeNewMessage = function(roomName, username, msg, callback) {
	mongo.connect(chatlogURL, function(err, db) {
		if(err) {
			callback(false, err);
			return;
		}
		var message = {
			'username':username,
			'message':msg,
			'time': +new Date()
		};
		db.collection(roomName).insertOne(message, function(err, res) {
			db.close();
			if(err) {
				callback(false, err);
			} else {
				callback(true, null);
			}
		});
	});
};
exports.storeNewMessage = storeNewMessage;

var getRecentMessage = function(roomName, callback) {
	mongo.connect(chatlogURL, function(err, db) {
		if(err) {
			callback(false, null, err);
			return;
		}
		var aggregate = [
			{$sort:{"time":-1}},
			{$limit:10}
		];
		db.collection(roomName).aggregate(aggregate, function(err, res) {
			db.close();
			if(err) {callback(false, null, err);}
			else {callback(true,res.reverse(), null);}
		});
	});
};
exports.getRecentMessage = getRecentMessage;

var createPrivateRoom = function(accessCode, callback) {
	mongo.connect(proomURL, function(err, db) {
		if(err) {
			callback(false, err);
			return;
		}
		/*
		db.listCollections({name: roomName}).toArray(function (err, items) {
			if(items.length !== 0) {
				callback("Room Name already exist", false);
				return;
			}
		});*/
		db.collection(accessCode).insertOne({
			"_id": accessCode,
			"createTime":+new Date()
		}, function(err, res) {
			if(err) {
				callback(err);
			} else {
				callback(null);
			}
		});
	});
};
exports.createPrivateRoom = createPrivateRoom;

var requestNewRegistration = function(username, password, callback) {
	mongo.connect(usersURL, function(err, db) {
		if (err) {
			callback(false, err);
			return;
		}
		var collection = db.collection('Users');
		collection.find({'name':username});
	});
};
exports.requestNewRegistration = requestNewRegistration;