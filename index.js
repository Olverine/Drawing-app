var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var identicon = require('identicon');
var fs = require('fs');

var users = [];

var port = process.env.PORT || 8080;

app.use(express.static('public'));

app.get('/', function(req, res){
	console.log("Someone connected");

	res.sendFile(__dirname + "/public/html/index.html");
});

app.get('/cookieInfo', function(req, res){
	res.sendFile(__dirname + "/public/html/cookieInfo.html");
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
		setTimeout(function(){
			if(fs.existsSync(filePath)){
				fs.unlink(filePath);
			}
		}, 100);
	}, 100);
});

io.on('connection', function(socket){
	console.log("user connected to socket!");
	socket.emit("userUpdate", users);

	socket.on("login", function(name){
		socket.name = name;
		users.push(socket.name);
		console.log(socket.name + " joined");
		io.emit("userUpdate", users);
	})

	socket.on("draw", function(startX, startY, x, y, color, width, tool){
		io.emit("draw", startX, startY, x, y, color, width, tool);
	});

	socket.on('disconnect', function(){
		var index = users.indexOf(socket.name);
		if (index > -1) {
			users.splice(index, 1);
		}
		io.emit("userUpdate", users);
		console.log(socket.name + " left")
	});
});

http.listen(port, function(){
	console.log('Server running!');
	console.log('listening on port: ' + port);
});
