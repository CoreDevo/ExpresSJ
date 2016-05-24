"use strict";
$(document).ready( () => {
    deleteAllCookies();

    const path = `http://${$(location).attr('host')}`;
    $("#login-public").click( () => {
      let username = $("#username").val();
      // var password = $("#password").val();
      if(verifyUsername(username)) {
          $.ajax({
              type: 'POST',
              url: `${path}/login`,
              data: {name: username},
              success(content) {
                  window.location.href = `${path}/chat`;
              }
          });
      } else {
          return false; // to stop link
      }
    });

    $("#create-accessCode").click( () => {
      const username = $("#username").val();
      // var password = $("#password").val();
      verifyUsername();
        $.ajax({
            type: 'POST',
            url: `${path}/login/generateAccessCode`,
            data: {name: username},
            success(data) {
                $("#username").val(username);
                $("#accessCode").val(data.accessCode);
            }
        });
        return false; // to stop link
    });
});

function deleteAllCookies() {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
    	const cookie = cookies[i];
    	const eqPos = cookie.indexOf("=");
    	const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    	document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
}

function verifyUsername(username){
    const regex = /[!@#\$%\^\&*\)\(+=.-]{1,}/g;
    if (regex.test(username) || username.trim() == ''){
        alert('Please Enter a Valid Username');
        return false;
    } else {
        return true;
    }
}
