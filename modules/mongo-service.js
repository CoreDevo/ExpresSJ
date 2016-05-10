var mongo = require('mongodb').MongoClient;
var assert = require('assert');

var userdbURL = 'mongodb://localhost:27017/Users';
var chatlogURL = 'mongodb://localhost:27017/ChatLogs';
var proomURL = 'mongodb://localhost:27017/PrivateRooms'

var storeNewMessage = function(roomName, username, msg, callback) {
	mongo.connect(chatlogURL, function(err, db) {
		if(err) {
			console.log(err);
			return;
		}
		var message = {
			'username':username,
			'message':msg,
			'time': +new Date()
		}
		db.collection(roomName).insertOne(message, function(err, res) {
			db.close();
			if(err) {
				callback(false);
			} else {
				callback(true);
			}
		});
	});
}
exports.storeNewMessage = storeNewMessage;

var getRecentMessage = function(roomName, callback) {
	mongo.connect(chatlogURL, function(err, db) {
		if(err) {
			console.log(err);
			return;
		}
		var aggregate = [
			{$sort:{"time":-1}},
			{$limit:10}
		];
		db.collection(roomName).aggregate(aggregate, function(err, res) {
			db.close();
			if(err) {callback(false, null);}
			else {callback(true,res.reverse());}
		});
	});
}
exports.getRecentMessage = getRecentMessage;

var createPrivateRoom = function(roomName, password, callback) {
	mongo.connect(proomURL, function(err, db) {
		if(err) {
			console.log(err);
			return;
		}
		db.listCollections({name: roomName}).toArray(function (err, items) {
			if(items.length !== 0) {
				callback("Room Name already exist", false)
				return;
			}
		});
		db.collection(roomName).insertOne({
			"name":roomName,
			"password":password,
			"createTime":+new Date()
		}, function(err, res) {
			if(err) {
				callback(err, false);
			} else {
				callback(null, true);
			}
		});
	});
}
exports.createPrivateRoom = createPrivateRoom;