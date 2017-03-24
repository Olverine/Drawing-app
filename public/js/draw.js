var socket = io();

var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

var pos;

var sizeRange = document.getElementById("sizeRange");
var color = document.getElementById("color");

var drawing = false;

c.onmousedown = function(){
	drawing = true
}

c.onmouseup = function(){
	drawing = false;
}

c.onmouseout = function(){
	drawing = false;
}

c.onmousemove = function(evt){
	var lastPos = pos;
	pos = getMousePos(c, evt);
	if(drawing){
		ctx.beginPath();
		ctx.moveTo(lastPos.x, lastPos.y);
		ctx.lineTo(pos.x, pos.y);
		ctx.lineWidth = sizeRange.value;
		ctx.strokeStyle = color.value;
		ctx.stroke();
		socket.emit("draw", lastPos.x, lastPos.y, pos.x, pos.y, color.value, sizeRange.value);
	}else{
		ctx.moveTo(pos.x,pos.y);
	}
}

function getMousePos(canv, evt) {
    var rect = canv.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function SetName(name){
	socket.emit("login", name);
}

socket.on("draw", function(startX, startY, x, y, color, width){
	ctx.beginPath();
	ctx.moveTo(startX, startY);
	ctx.lineTo(x, y);
	ctx.lineWidth = width;
	ctx.strokeStyle = color;
	ctx.lineCap = 'round';
	ctx.stroke();
});

socket.on("userUpdate", function(users){
	console.log("Updating user info");

	var box = document.getElementById("playerBox");
	while(box.firstChild){
		box.removeChild(box.firstChild);
	}

	for (var i = 0; i < users.length; i++) {
		var userBox = document.createElement("div");
		userBox.className = "userBox";

		var img = document.createElement("img");
		img.src = "http://192.168.2.105:3000/id?s="+users[i];
		userBox.appendChild(img);

		var nameTag = document.createElement("h5");
		nameTag.innerHTML = users[i];
		userBox.appendChild(nameTag);

		document.getElementById("playerBox").appendChild(userBox);
	};
});