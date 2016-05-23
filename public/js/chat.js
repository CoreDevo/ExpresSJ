//public chat
var esj = angular.module('esj', []);
var emojiList = {
    ':pd_worth:': 'pd_worth.jpg',
    ':kappa:': 'kappa.jpg',
    ':edward_mad:': 'edward_mad.jpg',
    ':diao:': 'diao.gif',
    ':van_smile:': 'van_smile.jpg',
    ':ning_what:': 'ning_what.jpg',
    ':sorry:': 'sorry.jpg',
    ':rhine:': 'rhine.gif',
    ':gay:': 'seven_laugh.gay.png',
    ':edward_scary:': 'edward_scary.png',
    ':edward_trash:': 'edward_trash.png',
    ':miao:': 'miao.jpg',
    ':hhj_shoot:': 'hhj_shoot.jpg',
    ':bu_nolisten:': 'bu_nolisten.jpg',

};
var roomname = 'lobby';
esj.controller('PublicChatCtrl', function ($scope, $sce) {
    var socket = io.connect();
    var cachedUsername = document.cookie;
    var slicedUsername = parseCookies(cachedUsername)["userID"];
    $scope.messages=[];
    $scope.userlist=[];
    $scope.topRoomname = 'Lobby';

    //DEBUGGING:
    // console.log(slicedUsername)

    socket.emit('first connect', roomname, cachedUsername);

    $scope.changeRoom = function(){
        roomname = $scope.roomname;
        if(roomname != '') {
            socket.emit('enter room', roomname);
        } else {
            alert('Please enter a valid Room Name');
        }
    };

    $scope.sendMessage = function(){
        if($scope.messageText == undefined || $scope.messageText.trim() == "") {
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
        //TODO: REMOVE JQUERY FUNCTIONS
        $('.chat').animate({scrollTop:$('.chat-body').height()}, 0);
        //DEBUGGING:
        // console.log($('.chat-body').height());

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
        console.log($scope.userlist);
        $scope.topRoomname = roomname;
        $scope.userlist.push({
            username:username,
            description:'This is the description'
        });
        $scope.$apply();
        // $scope.topRoomname = roomname + ' Currently ' + currentNumber;
        console.log('In ' + roomname + ', Currently ' + currentNumber);
    });

    socket.on('new leave', function(username, roomname, currentNumber){
        console.log(username + " left");
        $scope.topRoomname = roomname;
        //TODO: Probably using helper
        for(var i = 0; i < $scope.userlist.length; i++) {
            if (($scope.userlist[i].username === username)) {
                $scope.userlist.splice(i, 1);
                i--;
            }
        }
        $scope.$apply();
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

function parseEmoji(message){
    var parsedMessage = message;
    for (var key in emojiList) {
        if (emojiList.hasOwnProperty(key)) {
            parsedMessage = parsedMessage.split(key).join(processImageSpan(key));
        }
    }

    return parsedMessage;
}

function processImageSpan(key) {
    return '<img class="emoji" src="../img/emoji/' + emojiList[key] + '"</img>';
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
