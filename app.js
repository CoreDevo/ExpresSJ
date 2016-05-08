var express = require('express');
var app = express();
var server = require('http').Server(app);
var index = '/index.html';
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');

var users = [];
var connections = [];

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cookieParser());
// console.log(path.join(__dirname + '/public'))
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
  console.log("chat begin")
  res.sendFile(path.resolve('public/chat.html'));// im speaking about this line
});

app.get('/login', function (req, res) {
  console.log("get login")
  res.sendFile(path.resolve('public/login.html'));
});

app.post('/login', function (req, res) {
  console.log("req body name: "+req.body.name)
  res.cookie("user", req.body.name, {maxAge: 1000*60*60*24*30});
  if (users[req.body.name]) {
    //if exists
    console.log(" username already exists")
    res.redirect('/login');
  } else {
    console.log(req.body.name + " cached")
    res.redirect('/chat');
  }
});

io.on('connection', function(socket){
   connections.push(socket);
  //  console.log('connected %s', connections.length);

   socket.on('disconnect', function(data) {
       connections.splice(connections.indexOf(socket), 1);
      //  console.log('disconnected %s', connections.length);
   });

   socket.on('send message', function(data){
       console.log(data);
       io.emit('new message', {msg:data});
   });
});

server.listen(3000, function(){
   console.log('Started');
});
