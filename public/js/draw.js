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

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function SetName(name){
	socket.emit("contributor", name);
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