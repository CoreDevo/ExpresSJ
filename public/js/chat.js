$(function(){
    var socket = io.connect();
    var $messageForm = $('#messageForm');
    var $message = $('#message');
    var $chat = $('#chat-body');
    var $roomForm = $('#roomForm');
    var $room = $('#room');
    var roomname = 'lobby';
    var $onlineUserList = $('#chat-users');
    var cachedUsername = document.cookie;
    var slicedUsername = cachedUsername.split("=")[1];

    // console.log(slicedUsername)

    socket.emit('first connect', roomname, cachedUsername);

    $roomForm.submit(function(e){
        e.preventDefault();
        console.log('Room Button Clicked');
        roomname = $room.val();
        socket.emit('enter room', roomname);
    });

    $messageForm.submit(function(e){
        e.preventDefault();
        console.log('message submitted');
        socket.emit('send message', $message.val(), roomname);
        $message.val('');
    });

    socket.on('connect', function(){
        console.log("first connect")
        //$onlineUserList.append('<div id="' + slicedUsername + '"><div class="user"><div class="avatar"><img src="img/userLIstAvatar.png" alt="User name"></div><div class="name">' + slicedUsername + '</div><div class="user-description">The God</div></div></div>');

    });

    socket.on('online gods', function(godsList){
        console.log(godsList);
        $onlineUserList.html('');
        var gods;
        for (var num in godsList) {
            gods = godsList[num];
            $onlineUserList.append('<div class="user"><div class="avatar"><img src="img/userLIstAvatar.png" alt="User name"></div><div class="name">' + gods + '</div><div class="user-description">The God</div></div>');
        }
    });

    socket.on('new message', function(data){
      //differentiate sent and received messages
      //TODO: sent time. eg. 5 mins ago
      console.log(data)
      var direction;
        if(slicedUsername == data.username){
          //sent by current user
          direction = "right"
        }
        else{
          direction = "left"
        }
        // console.log(direction);
        //NOTE: This is da fkiing ES6 feature, compatibility should be considered
        // $chat.append('<div class="answer ${direction}"><div class="avatar"><img src="img/avatar-${direction}.jpg" alt="User name"></div><div class="name">${cachedUsername}</div><div class="text">${data.msg}</div><div class="time">1989年年初的时候</div></div>');
        $chat.append('<div class="answer ' +direction+ '"><div class="avatar"><img src="img/avatar-' + direction + '.jpg" alt="User name"></div><div class="name">' + data.username + '</div><div class="text">' + data.msg + '</div><div class="time">Just now</div></div>');
        $('.chat').animate({scrollTop:$('.chat').height()}, 'slow');
    });

    socket.on('new join', function(username, roomname, currentNumber){
        console.log(username + " joined");
        console.log('In ' + roomname + ', Currently ' + currentNumber);
        //TODO: add number of current user to UI
        $chat.append('<div class="well">Currently ' + currentNumber + '</div>');

        $onlineUserList.append('<div id="' + username + '"><div class="user"><div class="avatar"><img src="img/userLIstAvatar.png" alt="User name"></div><div class="name">' + username + '</div></div></div>');
    });

    socket.on('new leave', function(username, roomname, currentNumber){
        console.log('In ' + roomname + ', Currently ' + currentNumber);
        //for testing:
        $chat.append('<div class="well">Someone left, Currently ' + currentNumber + '</div>');

        //remove offline users on online user list
        $onlineUserList.remove('.'+username)
    });

    socket.on('entered room', function(roomname) {
        console.log('Entered new room: ' + roomname);
        inRoom();
    });

    function inRoom(){
        $room.val('');
        console.log('client side room name is ' + roomname);
        $chat.html('');
        $chat.append('<div class="well">You are in room ' + roomname + '</div>');
    }
});
