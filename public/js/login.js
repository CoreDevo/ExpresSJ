$(document).ready( function() {
    deleteAllCookies();
    $('#login-button').click( function() {
        var username=$("#username").val();

        if (username.indexOf('=') != -1 || (username.indexOf('%') != -1)|| (username.indexOf('&') != -1)|| (username.indexOf(' ') != -1) {
            alert('no =,%,&,# and space pls');
            return;
        }

        var path = 'http://' + $(location).attr('host');
        $.ajax({
            type: 'POST',
            url: path + '/login',
            data: {name: username},
            success: function(content) {
                window.location.href = path + '/chat';
            }
        });
        return false; // to stop link
    });
});

function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
    	var cookie = cookies[i];
    	var eqPos = cookie.indexOf("=");
    	var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    	document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}
