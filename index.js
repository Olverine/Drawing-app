var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var identicon = require('identicon');
var fs = require('fs');

var users = [];

app.use(express.static('public'));

app.get('/', function(req, res){
	console.log("Someone connected");

	res.sendFile(__dirname + "/public/html/index.html");
});

app.get('/id', function(req, res){
	var name = req.query.s;
	var filePath = __dirname + '/' + name +'.png'
	console.log("Someone requested an identicon with string: " + name);

	if(!fs.existsSync(filePath)){
		identicon.generate({ id: name, size: 60 }, function(err, buffer) {
		    if (err) throw err;
		 	console.log("generating identicon from: " + name);
		    // buffer is identicon in PNG format. 
		    fs.writeFileSync(filePath, buffer);
		});
	}

	setTimeout(function(){
		res.sendFile(filePath);
	}, 100);
});

io.on('connection', function(socket){
	console.log("user connected to socket!");
	io.emit("userUpdate", users);

	socket.on("login", function(name){
		users.push(name);
		console.log(name + " registered");
		io.emit("userUpdate", users);
	})

	socket.on("draw", function(startX, startY, x, y, color, width){
		io.emit("draw", startX, startY, x, y, color, width);
	});
});

io.on('disconnect', function(){
    console.log("Someone disconnected");
});

http.listen(3000, function(){
	console.log('Server running!');
	console.log('listening on port: 3000');
});