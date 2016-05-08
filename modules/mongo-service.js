var mongo = require('mongodb').MongoClient;
var assert = require('assert');

var userdbURL = 'mongodb://localhost:27017/Users';
var chatlogURL = 'mongodb://localhost:27017/ChatLogs';

var storeNewMessage = function(roomName, username, msg, callback) {
	mongo.connect(chatlogURL, function(err, db) {
		if(err) {
			console.log(err.toString());
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
			console.log(err.toString());
			return;
		}
		var aggregate = [
			{$sort:{"time":-1}},
			{$limit:10}
		];
		db.collection(roomName).aggregate(aggregate, function(err, res) {
			console.log(err);
			console.log(res);
			db.close();
			if(err) {callback(false, null);}
			else {callback(true,res.reverse());}
		});
	})
}
exports.getRecentMessage = getRecentMessage;