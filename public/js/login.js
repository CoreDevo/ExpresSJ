$(document).ready( function() {
    deleteAllCookies();
    $('#login-button').click( function() {
        var username=$("#username").val();
        var regex = /[!@#\$%\^\&*\)\(+=._-]{1,}/g
        if (regex.test(username)){
            alert('no special symbol allowed');
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
