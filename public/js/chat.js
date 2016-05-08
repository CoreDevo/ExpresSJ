$(function(){
    var socket = io.connect();
    var $messageForm = $('#messageForm');
    var $message = $('#message');
    var $chat = $('#chat');

    $messageForm.submit(function(e){
        e.preventDefault();
        console.log('working');
        socket.emit('send message', $message.val());
        $message.val('');
    });

    socket.on('new message', function(data){
        $chat.append('<div class="well">' + data.msg + '</div>');
    });
});
