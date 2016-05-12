$(function(){
    var socket = io.connect();
    var $messageForm = $('#messageForm');
    var $message = $('#message');
    var $chat = $('#chat-box');
    var $roomForm = $('#roomForm');
    var $room = $('#room');
    var roomname = 'lobby';
    var $onlineUserList = $('#chat-users');
    var $topRoomname = $('#topRoomname');
    var cachedUsername = document.cookie;
    var slicedUsername = parseCookies(cachedUsername)["userID"];
    var emojiList = ['PDWorth','Kappa','EdwardMad','Diao','SevenLaugh'];

    // console.log(slicedUsername)

    socket.emit('first connect', roomname, cachedUsername);

    $roomForm.submit(function(e){
        e.preventDefault();
        console.log('Room Button Clicked');
        var rawRoomname = $room.val();
        roomname = parseRoomname(rawRoomname);
        if(roomname != '') {
            socket.emit('enter room', roomname);
        } else {
            alert('Are you trying to break?');
        }
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
        //TODO: ENHANCE THIS SHIT
        console.log(godsList);
        $onlineUserList.html('<h6>Online Gods</h6>');
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
          direction = "right";
        }
        else{
          direction = "left";
        }

        $chat.append('<div class="answer ' +direction+ '"><div class="avatar"><img src="img/avatar-' + direction + '.jpg" alt="User name"></div><div class="name">' + data.username + '</div><div class="text">' + parseEmoji(data.msg) + '</div><div class="time">Just now</div></div>');

        $('.chat').animate({scrollTop:$('.chat-body').height()}, 'fast');
        console.log($('.chat-box').height())
        console.log($('.chat-body').height())
    });

    socket.on('entered room', function(roomname) {
        $onlineUserList.empty('');
        $chat.empty('');
        console.log('Entered new room: ' + roomname);
        inRoom();
    });

    socket.on('new join', function(username, roomname, currentNumber){
        console.log(username + " joined");
        $topRoomname.text(roomname + " Currently " + currentNumber);
        console.log('In ' + roomname + ', Currently ' + currentNumber);
        //TODO: add number of current user to UI
        // $chat.append('<div class="well">Currently ' + currentNumber + '</div>');

        //$onlineUserList.append('<div id="' + username + '"><div class="user"><div class="avatar"><img src="img/userLIstAvatar.png" alt="User name"></div><div class="name">' + username + '</div></div></div>');
    });

    socket.on('new leave', function(username, roomname, currentNumber){
        $topRoomname.text(roomname + " Currently " + currentNumber);
        console.log('In ' + roomname + ', Currently ' + currentNumber);
        //for testing:
        // $chat.append('<div class="well">Someone left, Currently ' + currentNumber + '</div>');

        //remove offline users on online user list
        $onlineUserList.remove('.'+username)
    });

    socket.on('clear data', function(data){
        console.log('Clear Data Arrived')
        $onlineUserList.html('');
        $chat.val('');
    });

    function inRoom(){
        $room.val('');
        console.log('client side room name is ' + roomname);
        // $chat.append('<div class="well">You are in room ' + roomname + '</div>');
    }

    function parseRoomname(rawRoomname) {
        var roomname = rawRoomname.trim().split(' ').join('');
        return roomname;
    }

    function parseEmoji(message){
        var parsedMessage = message;
        for (var index = 0; index < emojiList.length; ++index)  {
            var key = emojiList[index];
            parsedMessage=parsedMessage.split(key).join('<img src="img/emoji/'+key+'.jpg" title='+key+' alt='+key+' class="emoji">');
        }
        return parsedMessage;
    }

    function parseCookies(rawCookies) {
        var cookies = {};
        rawCookies.split(';').forEach(function(element) {
            var pair = element.split('=');
            cookies[pair[0].trim()] = pair[1].trim();
        });
        return cookies;
    };
});
