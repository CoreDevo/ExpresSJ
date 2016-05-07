var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/index.html'));
});

io.on('connection', function(socket){
  console.log("connected");
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(8888, function(){
  console.log('listening on port 8888');
});
