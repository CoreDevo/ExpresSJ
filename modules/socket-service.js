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
			socket.emit('online gods', roomUsers[roomname]);
			roomUsers['lobby'].push(username);
			users[0]++;
			io.to(roomname).emit('new join', username, roomname, users[0]);
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
				socket.emit('online gods', roomUsers[roomname]);
				roomUsers[roomname].push(socket.user);
				console.log('User in ' + roomname + ' : ' + roomUsers[roomname]);
				var currentNumber = users[room.indexOf(roomname)];
				console.log(socket.user + " joined into Room: " + roomname);
				//TODO: emmit online user list array as well
				io.to(roomname).emit('new join', socket.user, roomname, currentNumber);
				mongo.getRecentMessage(roomname, function (succeed, msgs, err) {
					if (succeed) {
						msgs.forEach(function (singleMsg) {
							socket.emit('new message',
									{msg: singleMsg.message, 
									username: singleMsg.username,
									timestamp: singleMsg.time});
						});
					} else {
						const error_msg = 'Failed to get recent history';
						socket.emit('new message', {msg: error_msg, username: 'Old Man'});
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
			if (roomUsers[roomname]) {
				roomUsers[roomname].splice(roomUsers[roomname].indexOf(username), 1);
			}
			console.log('User in ' + roomname + ' : ' + roomUsers[roomname]);

			var index = room.indexOf(roomname);
			if (users[index] == 1 && index != 0) {
				users.splice(index, 1);
				room.splice(index, 1);
				delete roomUsers[roomname];
				console.log('Room destroyed');
			} else {
				users[index]--;
				io.to(roomname).emit('new leave', username, roomname, users[index]);
			}
		}

		socket.on('send message', function (data, roomname) {
			console.log('Msg: ' + data + ' - in room: ' + roomname + ' - by: ' + socket.user);
			var message = {
				username: socket.user,
				message: data,
				time: +new Date()
			};
			mongo.storeNewMessage(roomname, message, function (succeed, err) {
				if (succeed) {
					io.to(roomname).emit('new message', 
						{msg: parseMessage(data), 
						username: message.username,
						timestamp: message.time});
				} else {
					const error_msg = 'An error has occurred, your message was failed to send. 志己的生命-1s';
					socket.emit('new message', {msg: error_msg, username: '长者'});
				}
			})
		});

		function parseMessage(data) {
			var d = data.split('');
			var index = 0;
			while (index < Math.floor(d.length / 30)) {
				d.splice((index+1)*30+index, 0, '\n');
				index++;
			}
			return d.join('');
		}

		socket.on('disconnect', function (data) {
			connections.splice(connections.indexOf(socket), 1);
			console.log('disconnected %s', connections.length);
			leaveRoom(socket);
			socket.emit('clear data', data);
		});
	});
};

module.exports = createSocket;
