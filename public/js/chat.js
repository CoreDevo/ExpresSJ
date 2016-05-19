var esj = angular.module('esj', []);
var emojiList = ['PDWorth','Kappa','EdwardMad','Diao','SevenLaugh'];
var roomname = 'lobby';
esj.controller('PublicChatCtrl', function ($scope) {
  var socket = io.connect();
  // var $messageForm = $('#messageForm');
  // var $message = $('#message');
  // var $chat = $('#chat-box');
  // var $roomForm = $('#roomForm');
  // var $room = $('#room');

  // var $onlineUserList = $('#chat-users');
  // var $topRoomname = $('#topRoomname');
  var cachedUsername = document.cookie;
  var slicedUsername = parseCookies(cachedUsername)["userID"];
  $scope.messages=[];
  $scope.userlist=[];
  $scope.topRoomname = 'Lobby';

  // console.log(slicedUsername)

  socket.emit('first connect', roomname, cachedUsername);

  // $roomForm.submit(function(e){
  //     e.preventDefault();
  //     console.log('Room Button Clicked');
  //     var rawRoomname = $room.val();
  //     roomname = parseRoomname(rawRoomname);
  //     if(roomname != '') {
  //         socket.emit('enter room', roomname);
  //     } else {
  //         alert('Are you trying to break?');
  //     }
  // });

    $scope.changeRoom = function(){
      roomname = $scope.roomname;
      if(roomname != '') {
          socket.emit('enter room', roomname);
      } else {
          alert('Please enter a valid Room Name');
      }
    }

    $scope.sendMessage = function(){
        socket.emit('send message', $scope.messageText, roomname);
        $scope.messageText = '';
    };

    socket.on('connect', function(){
        console.log("first connect");
        //$onlineUserList.append('<div id="' + slicedUsername + '"><div class="user"><div class="avatar"><img src="img/userLIstAvatar.png" alt="User name"></div><div class="name">' + slicedUsername + '</div><div class="user-description">The God</div></div></div>');

    });

    socket.on('online gods', function(godsList){
        $scope.userlist = [];
        console.log(godsList);
        var gods;
        $scope.userlist.length = 0;
        for (var num in godsList) {
            gods = godsList[num];
            $scope.userlist.push({
              username:gods,
              description:'This is the description'
            });
        }
        $scope.$apply();
    });

    socket.on('new message', function(data){
      //differentiate sent and received messages
      //TODO: sent time. eg. 5 mins ago
      console.log(data);
      var direction;
        if(slicedUsername == data.username){
          //sent by current user
          direction = "right";
        }
        else{
          direction = "left";
        }
        $scope.messages.push({
          username:decodeURIComponent(data.username),
          text:parseEmoji(data.msg),
          direction:direction,
          timestamp:"Just Now"
        });
        $scope.$apply();

        $('.chat').animate({scrollTop:$('.chat-body').height()}, 'fast');
        // console.log($('.chat-box').height());
        // console.log($('.chat-body').height());
    });

    socket.on('entered room', function(roomname) {
        // angular.element(document.getElementById("chat-users")).empty();
        // angular.element(document.getElementById("chat-box")).empty();
        $scope.messages=[];
        $scope.userlist=[];
        console.log('Entered new room: ' + roomname);
        inRoom();
    });

    socket.on('new join', function(username, roomname, currentNumber){
        console.log(username + " joined");
        $scope.topRoomname = roomname;
        // $scope.topRoomname = roomname + ' Currently ' + currentNumber;
        console.log('In ' + roomname + ', Currently ' + currentNumber);
        //TODO: add number of current user to UI
        // $chat.append('<div class="well">Currently ' + currentNumber + '</div>');

        //$onlineUserList.append('<div id="' + username + '"><div class="user"><div class="avatar"><img src="img/userLIstAvatar.png" alt="User name"></div><div class="name">' + username + '</div></div></div>');
    });

    socket.on('new leave', function(username, roomname, currentNumber){
        $scope.topRoomname = roomname;
        // $scope.topRoomname = roomname + " Currently " + currentNumber;
        console.log('In ' + roomname + ', Currently ' + currentNumber);
        //for testing:
        // $chat.append('<div class="well">Someone left, Currently ' + currentNumber + '</div>');

        //remove offline users on online user list
        // $onlineUserList.remove('.'+username)
    });

    socket.on('clear data', function(data){
        console.log('Clear Data Arrived');
        $onlineUserList.html('');
        $chat.val('');
    });
});

function inRoom(){
    // angular.element(document.getElementById("room")).empty();
    document.getElementById("room").value = '';
    console.log('client side room name is ' + roomname);
}

function parseRoomname(rawRoomname) {
    var roomname = rawRoomname.trim().split(' ').join('');
    return roomname;
}

function parseEmoji(message){
    var parsedMessage = message;
    for (var index = 0; index < emojiList.length; ++index)  {
        var key = emojiList[index];
        parsedMessage = parsedMessage.split(key).join('<img src="img/emoji/'+key+'.jpg" title='+key+' alt='+key+' class="emoji">');
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
}

// function parseMessage(message){
//     var encodedMsg = message.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
//         return '&#'+i.charCodeAt(0)+';';
//     });
//     return encodedMsg;
// }
