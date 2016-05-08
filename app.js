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

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cookieParser());
app.use(express.static(path.join(__dirname + '/public')));

app.get('/', function (req, res) {
  if (req.cookies.user == null) {
    //no cookie stored, proceed to login page
    res.redirect('/login');
  } else {
    //direct cached user to chat room
    res.redirect('/chat');

  }
});

//TO-DO: 为啥不 redirect ？目前用 jquery 办法临时解决，it works at least
app.get('/chat', function (req, res) {
    console.log("chat begin");
    res.sendFile(path.resolve('public/chat.html')); // im speaking about this line
});

app.get('/login', function (req, res) {
    console.log("get login");
    res.sendFile(path.resolve('public/login.html'));
});

app.post('/login', function (req, res) {
    console.log("req body name: "+req.body.name)
    if (users[req.body.name]) {
        //if exists
        console.log(" username already exists");
        res.redirect('/login');
    } else {
        console.log(req.body.name + " cached");
        res.cookie("user", req.body.name, {maxAge: 1000*60*60*24*30});
        res.redirect('/chat');
    }
});

io.on('connection', function(socket){
    connections.push(socket);
    console.log('connected %s', connections.length);

    socket.on('first connect', function(roomname) {
        console.log('someone just came in, first connect in lobby');
        socket.join(roomname);
        socket.room = roomname;
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
        console.log('joined room ' + roomname);
        io.to(roomname).emit('new join', roomname, currentNumber);
    });

    function leaveRoom(socket){
        console.log('User is leaving ' + socket.room);
        var roomname = socket.room;
        socket.leave(socket.room);
        var index = room.indexOf(roomname);
        if (users[index] == 1 && index != 0){
            users.splice(index, 1);
            room.splice(index, 1);
            console.log('Room destroyed');
        } else {
            users[index]--;
            io.to(roomname).emit('new leave', roomname, users[index]);
        }
    }

    socket.on('send message', function(data, roomname){
        console.log(data);
        console.log(roomname);
        io.to(roomname).emit('new message', {msg: data});
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
