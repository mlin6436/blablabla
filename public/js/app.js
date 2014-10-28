
var socket = io.connect('http://localhost:8080/');

$(function(){
	var $notificationscreen = $('#notification-screen');
	var $loginscreen = $('#login-screen');
	var $chatscreen = $('#chat-screen');
	var $userscreen = $('#user-screen');

	var $user = $('#user');

	var $join = $('#join');
	var $clear = $('#clear');
	var $send = $('#send');

	// sockets
	socket.on("distributemessage", function(data){
		var chatboard = $('#chatboard');
		var copy = chatboard.html();
		chatboard.html('<p>' + copy + '<span style="color: red">' + data.user + '</span>' + ' : ' + data.message + "</p>");
		chatboard.scrollTop($('#chatboard')[0].scrollHeight - chatboard.height());
	});

	socket.on("usernameadded", function (username) {
		$loginscreen.hide();

		if ($user.text() === "") {
			$chatscreen.toggle();
			$user.text(username);
			$userscreen.toggle();
		}
	});

	socket.on("usernameexists", function (username) {
		$notificationscreen.toggle();
		var notification = "Username " + username + " already exsits, please choose another one!";
		$('#notification').text(notification);
	});

	// events
	$join.click(function (e) {
		var username = $('#username').val();
		if (username.length) {
			socket.emit("login", username);
		}
	});

	$clear.click(function(e){
		$('#chatboard').text('');
	});

	$send.click(function(e){
		var user = $user.text();
		var message = $('#message').val();

		if(message.length){
			socket.emit("sendmessage", { message: message, user: user }, function () {
				$('#message').val('');
			});
		}
	});

	$('#message').keydown(function (e){
	    if(e.keyCode == 13){
	        $send.trigger('click');//lazy, but works
	    }
	})
});
