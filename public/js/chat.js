$(function(){
    var $messageForm = $('#messageForm');
    var $message = $('#message');
    var $chat = $('#chat');
    var $roomForm = $('#roomForm');
    var $room = $('#room');
    var roomname = 'lobby';
    var userID;
    //var cachedUsername = document.cookie;
    //console.log(cachedUsername);

    socket.emit('first connect', roomname);

    $roomForm.submit(function(e){
        e.preventDefault();
        console.log('Room Button Clicked');
        roomname = $room.val();
        socket.emit('enter room', roomname);
    });

    $messageForm.submit(function(e){
        e.preventDefault();
        console.log('working');
        socket.emit('send message', $message.val(), roomname);
        $message.val('');
    });

    socket.on('new message', function(data){
        $chat.append('<div class="well">'+ data.username +': ' + data.msg + '</div>');
    });

    socket.on('new join', function(username, roomname, currentNumber){
        console.log('In ' + roomname + ', Currently ' + currentNumber);
        //for testing:
        $chat.append('<div class="well">' + username + ' joined' + '</div>');
        $chat.append('<div class="well">Currently ' + currentNumber + '</div>');
    });

    socket.on('new leave', function(username, roomname, currentNumber){
        console.log('In ' + roomname + ', Currently ' + currentNumber);
        //for testing:
        $chat.append('<div class="well">' + username + ' left' + '</div>');
        $chat.append('<div class="well">Someone left, Currently ' + currentNumber + '</div>');
    });

    socket.on('entered room', function(roomname) {
        console.log('Entered new room: ' + roomname);
        inRoom();
    });

    socket.on('Username', function(username){
        userID = username;
        console.log('Received Username: ' + userID);
    });

    function inRoom(){
        $room.val('');
        console.log('client side room name is ' + roomname);
        $chat.html('');
        $chat.append('<div class="well">You are in room ' + roomname + '</div>');
    }
});
