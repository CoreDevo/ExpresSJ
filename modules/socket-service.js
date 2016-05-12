var socket_io = require('socket.io');
var mongo = require('../modules/mongo-service');
var utils = require('../modules/utils');

var createSocket = function(server) {
	var io = socket_io(server);
	io.on('connection', function (socket) {
		connections.push(socket);
		console.log('connected %s', connections.length);
		
		socket.on('first connect', function (roomname, rawCookies) {
			//TODO: Temp solotion for cookie username, need better solution
			var cookies = utils.parseCookies(rawCookies);
			var username = cookies['userID'];
			console.log('username is ' + username);
			socket.join(roomname);
			socket.room = roomname;
			socket.user = username;
			console.log(username + " joined into Room: " + roomname);
			io.to(roomname).emit('online gods', roomUsers[roomname]);
			users[0]++;
		});
		
		socket.on('enter room', function (roomname) {
			console.log(socket.room);
			try {
				if (roomname == socket.room) {
					socket.emit('new message', {msg: 'You are already in this room'});
					return;
				}
				console.log(socket.room);
				leaveRoom(socket);
				if (room.indexOf(roomname) == -1) {
					room.push(roomname);
					users.push(0);
					roomUsers[roomname] = [];
					console.log(room[room.length - 1] + ' room: Created');
				}
				socket.room = roomname;
				socket.join(roomname);
				socket.emit('entered room', roomname);
				users[room.indexOf(roomname)]++;

				roomUsers[roomname].push(socket.user);
				io.to(roomname).emit('online gods', roomUsers[roomname]);
				console.log('User in ' + roomname + ' : ' + roomUsers[roomname]);

				var currentNumber = users[room.indexOf(roomname)];
				console.log(socket.user + " joined into Room: " + roomname)
				//TODO: emmit online user list array as well
				io.to(roomname).emit('new join', socket.user, roomname, currentNumber);
				mongo.getRecentMessage(roomname, function (succeed, msgs) {
					if (succeed) {
						msgs.forEach(function (singleMsg) {
							socket.emit('new message', {msg: singleMsg.message, username: singleMsg.username});
						});
					}
				})
			} catch(e) {
				console.log(e);
			}
		});
		
		function leaveRoom(socket) {
			console.log('User is leaving ' + socket.room);
			var roomname = socket.room;
			var username = socket.user;
			socket.leave(socket.room);
			
			//TODO: Enhance maybe
			roomUsers[roomname].splice(roomUsers[roomname].indexOf(username), 1);
			console.log('User in ' + roomname + ' : ' + roomUsers[roomname]);
			
			var index = room.indexOf(roomname);
			if (users[index] == 1 && index != 0) {
				users.splice(index, 1);
				room.splice(index, 1);
				delete roomUsers[roomname];
				console.log('Room destroyed');
			} else {
				users[index]--;
				io.to(roomname).emit('online gods', roomUsers[socket.room]);
				io.to(roomname).emit('new leave', username, roomname, users[index]);
			}
		}
		
		socket.on('send message', function (data, roomname) {
			console.log('Msg: ' + data + ' - in room: ' + roomname + ' - by: ' + socket.user);
			mongo.storeNewMessage(roomname, socket.user, data, function (succeed) {
				if (succeed) {
					io.to(roomname).emit('new message', {msg: data, username: socket.user});
				}
			})
		});
		
		socket.on('disconnect', function (data) {
			connections.splice(connections.indexOf(socket), 1);
			console.log('disconnected %s', connections.length);
			leaveRoom(socket);
			socket.emit('clear data', data);
		});
	});
};

module.exports = createSocket;
