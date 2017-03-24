var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function(req, res){
	console.log("Someone connected");
	res.sendFile(__dirname + "/public/html/index.html");
});

io.on('connection', function(socket){
	console.log("user connected to socket!");

	socket.on("draw", function(startX, startY, x, y, color, width){
		io.emit("draw", startX, startY, x, y, color, width);
	});
});

io.on('disconnect', function(){
    console.log("Someone disconnect");
});

http.listen(3000, function(){
	console.log('listening on port: 3000');
});