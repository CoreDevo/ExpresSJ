//public chat
var esj = angular.module('esj', []);
var emojiList = [':pd_worth:',':kappa:',':edward_mad:',':diao:',':seven_laugh:'];
var roomname = 'lobby';
esj.controller('PublicChatCtrl', function ($scope, $sce) {
    var socket = io.connect();
    var cachedUsername = document.cookie;
    var slicedUsername = parseCookies(cachedUsername)["userID"];
    $scope.messages=[];
    $scope.userlist=[];
    $scope.topRoomname = 'Lobby';

    // console.log(slicedUsername)

    socket.emit('first connect', roomname, cachedUsername);

    $scope.changeRoom = function(){
        roomname = $scope.roomname;
        if(roomname != '') {
            socket.emit('enter room', roomname);
        } else {
            alert('Please enter a valid Room Name');
        }
    }

    $scope.sendMessage = function(){
        if($scope.messageText.trim() == "") {
            alert("don't spam");
        } else {
            socket.emit('send message', $scope.messageText, roomname);
            $scope.messageText = '';
        }
    };

    $scope.renderEmoji = function(rawText) {
        return $sce.trustAsHtml(parseEmoji(rawText));
    }

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
          text:data.msg,
          direction:direction,
          timestamp:"Just Now"
        });
        $scope.$apply();
        $scope.
        //TODO: REMOVE JQUERY FUNCTIONS
        $('.chat').animate({scrollTop:$('.chat-body').height()}, 'fast');
    });

    socket.on('entered room', function(roomname) {
        $scope.messages=[];
        $scope.userlist=[];
        console.log('Entered new room: ' + roomname);
        document.getElementById("room").value = '';
        console.log('client side room name is ' + roomname);
        // inRoom();
    });

    socket.on('new join', function(username, roomname, currentNumber){
        console.log(username + " joined");
        $scope.topRoomname = roomname;
        // $scope.topRoomname = roomname + ' Currently ' + currentNumber;
        console.log('In ' + roomname + ', Currently ' + currentNumber);
    });

    socket.on('new leave', function(username, roomname, currentNumber){
        $scope.topRoomname = roomname;
        // $scope.topRoomname = roomname + " Currently " + currentNumber;
        console.log('In ' + roomname + ', Currently ' + currentNumber);
    });

    socket.on('clear data', function(data){
        console.log('Clear Data Arrived');
        $onlineUserList.html('');
        $chat.val('');
    });
});

//NOTE it doesnt do any huge stuff, temp commented
// function inRoom(){
//     // angular.element(document.getElementById("room")).empty();
//     document.getElementById("room").value = '';
//     console.log('client side room name is ' + roomname);
// }

function parseRoomname(rawRoomname) {
    var roomname = rawRoomname.trim().split(' ').join('');
    return roomname;
}

//<span class="emoji emoji-sizer emoji-only" style="background-image:url(https://emoji.slack-edge.com/T1677E5QD/diao/0b78577733d410de.gif)" title="diao">:diao:</span>

function parseEmoji(message){
    var parsedMessage = message;
    for (var i in emojiList)  {
        var key = emojiList[i];
        parsedMessage = parsedMessage.split(key).join(processImageSpan(key));
    }
    return parsedMessage;
}

function processImageSpan(key) {
    var name = key.replace(/:/g, "");
    return '<img class="emoji" src="../img/emoji/' + name + '.jpg"name</img>';
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
