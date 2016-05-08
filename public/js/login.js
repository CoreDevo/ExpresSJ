$(document).ready( function() {
    $('#login-button').click( function() {
        var username=$("#username").val();
        var path = 'http://' + $(location).attr('host');
        $.ajax({
            type: 'POST',
            url: path + '/login',
            data: {name: username},
            success: function(content) {
                window.location.href = path + '/chat';
            }
        });
        socket.emit('Username', username);
        return false; // to stop link
    });
});
