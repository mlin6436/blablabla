var express = require('express');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT;
var io = require('socket.io').listen(server);
var device  = require('express-device');
var users = ['123'];

// configuration
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(device.capture());

// logging
app.use(function(req, res, next){
  console.log({method:req.method, url: req.url, device: req.device});
  next();
});

// routing
app.get("/", function(req, res){
	res.render('index', {});
});

// web socket
io.sockets.on('connection', function (socket) {
  io.sockets.emit('sendtoclient', { message: "someone joined the conversation." });

  socket.on('login', function (username, action) {
    // TODO: username verification
    console.log('Incoming username: ', username);
    if (users.indexOf(username) === -1) {
      console.log('Adding new username to the list...');
      users.push(username);
      io.sockets.emit('usernameadded', username);
    } else {
      console.log('Username exists...');
      io.sockets.emit('usernameexists', username);
    }
    console.log('User list: ', users);
  });

  socket.on('sendmessage', function (data, callback) {
    console.log('Incoming message from : ', data.user);
    console.log('Incoming message: ', data.message);
    // TODO: potty mouth filter
    io.sockets.emit('distributemessage', data);
    callback();
  });
});

// server
server.listen(8080);
