var app = require('express')();
var server = require('http').Server(app);
var index = '/index.html';
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');

var users = [];
var connections = [];

app.use(bodyParser());
app.use(cookieParser());

app.get('/', function (req, res) {
  if (req.cookies.user == null) {
    //no cookie stored, proceed to login page
    res.redirect('/login');
  } else {
    //direct cached user to chat room
    res.sendFile(path.resolve('../client/chat.html'));
  }
});

app.get('/login', function (req, res) {
  console.log("get login")
  res.sendFile(path.resolve('../client/login.html'));
});
app.post('/login', function (req, res) {
  if (users[req.body.name]) {
    //if exists
    console.log(users[req.body.name] + " username already exists")
    res.redirect('/login');
  } else {
    //不存在，把用户名存入 cookie 并跳转到主页
    console.log("saved in cookie, proceeding to chat room")
    res.cookie("user", req.body.name, {maxAge: 1000*60*60*24*30});
    res.redirect('/');
  }
});

io.on('connection', function(socket){
   connections.push(socket);
   console.log('connected %s', connections.length);

   socket.on('disconnect', function(data) {
       connections.splice(connections.indexOf(socket), 1);
       console.log('disconnected %s', connections.length);
   });

   socket.on('send message', function(data){
       console.log(data);
       io.emit('new message', {msg:data});
   });
});

server.listen(3000, function(){
   console.log('Started');
});
