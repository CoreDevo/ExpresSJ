var socket = io();
$('#login-button').submit(function(){
  console.log("submit username:"+$('#username').val())
  socket.emit('login', $('#username').val());
});
