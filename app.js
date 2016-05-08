var express = require('express');
var app = express();
var server = require('http').Server(app);
var index = '/index.html';
var notFound = '/notFound.html';
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');

var connections = [];
var room = ['lobby'];
var users = [0];
var roomUsers = {lobby:[]};

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cookieParser());
app.use(express.static(path.join(__dirname + '/public')));

app.get('/', function (req, res) {
  // if (req.cookies.user == null) {
  //   //no cookie stored, proceed to login page
  //   res.redirect('/login');
  // } else {
  //   //direct cached user to chat room
  //   res.redirect('/chat');
  // }
  res.redirect('/login');
});


//Temp solution for NoName user gettin chat
//TODO: add friendly alert maybe? NOT NOW!
/*JUST DONT VISIT CHAT DIRECTLY PLS.
app.get('/chat', function (req, res) {
    res.redirect('/login');
    console.log('chat redirecting to login');
});*/

 app.get('/chat', function (req, res) {
     res.sendFile(path.resolve('public/chat.html'));
 });

app.get('/login', function (req, res) {
    console.log("get login");
    res.sendFile(path.resolve('public/login.html'));
});

app.post('/login', function (req, res) {
    var username = req.body.name;
    console.log("new user name: " + username)
    //TODO: check if username exists
    roomUsers['lobby'].push(username);
    console.log('User in lobby: ' + roomUsers['lobby']);
    console.log(req.body.name + " cached");
    res.cookie("userID", req.body.name, {maxAge: 1000*60*60*24*30});
    res.redirect('/chat');
});

io.on('connection', function(socket){
    connections.push(socket);
    console.log('connected %s', connections.length);

    socket.on('first connect', function(roomname, rawUsername) {
        //TODO: Temp solotion for cookie username, need better solution
        var splitArray = rawUsername.split(';');
        var username = splitArray[splitArray.length-1].split('=')[1];
        console.log('username is ' + username);
        socket.join(roomname);
        socket.room = roomname;
        socket.user = username;
        console.log(username + " joined into Room: " + roomname)
        users[0]++;
    });

    socket.on('enter room', function(roomname){
        if(roomname == socket.room){
            socket.emit('new message', { msg: 'You are already in this room'});
            return;
        }
        leaveRoom(socket);
        if (room.indexOf(roomname) == -1){
            room.push(roomname);
            users.push(0);
            console.log(room[room.length-1] + ' Created');
        }
        socket.room = roomname;
        socket.join(roomname);
        socket.emit('entered room', roomname);
        users[room.indexOf(roomname)]++;
        var currentNumber = users[room.indexOf(roomname)];
        console.log(socket.user + " joined into Room: " + roomname)
        io.to(roomname).emit('new join', socket.user, roomname, currentNumber);
    });

    function leaveRoom(socket){
        console.log('User is leaving ' + socket.room);
        var roomname = socket.room;
        var username = socket.user;
        socket.leave(socket.room);
        var index = room.indexOf(roomname);
        if (users[index] == 1 && index != 0){
            users.splice(index, 1);
            room.splice(index, 1);
            console.log('Room destroyed');
        } else {
            users[index]--;
            io.to(roomname).emit('new leave', username, roomname, users[index]);
        }
    }

    socket.on('send message', function(data, roomname){
        console.log('Msg: ' + data + ' - in room: ' + roomname + ' - by: ' + socket.user);
        io.to(roomname).emit('new message', {msg: data, username: socket.user});
    });

    socket.on('disconnect', function(data) {
        connections.splice(connections.indexOf(socket), 1);
        console.log('disconnected %s', connections.length);
    });
});

app.use(function(req, res){
    console.log('someone just viewed 404 page');
    res.sendFile(path.resolve('public/notFound.html'));
});

server.listen(3000, function(){
    console.log('Started');
});
