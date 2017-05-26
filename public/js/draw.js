var socket = io();

var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

var pos;

var sizeRange = document.getElementById("sizeRange");
var color = document.getElementById("color");
var gridCheckbox = document.getElementById("gridCheck");

var drawing = false;

c.onmousedown = function(){
	drawing = true
	draw(pos, pos, document.getElementById("toolSelect").value, color.value, sizeRange.value, true);
}

document.onmouseup = function(){
	drawing = false;
}

document.onmousemove = function(evt){
	if(sizeRange.value > 40){
		sizeRange.min = 1;
		sizeRange.max = 40;
	}
	var lastPos = pos;
	pos = getMousePos(c, evt);
	if(drawing){
		draw(lastPos, pos, document.getElementById("toolSelect").value, color.value, sizeRange.value, true);
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

function getTouchPos(canv, evt) {
    var rect = canv.getBoundingClientRect();
    var touch = evt.touches[0];
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
}

c.ontouchstart = function(evt){
	pos = getTouchPos(c, evt);
	draw(pos, pos, document.getElementById("toolSelect").value, color.value, sizeRange.value, true);
}

c.ontouchmove = function(evt){
	var lastPos = pos;
	pos = getTouchPos(c, evt);
	draw(lastPos, pos, document.getElementById("toolSelect").value, color.value, sizeRange.value, true);
};

function draw(pos1, pos2, tool, color, width, emit){
	switch(tool){
		case "pen":
			ctx.beginPath();
			ctx.moveTo(pos1.x, pos1.y);
			ctx.lineTo(pos2.x, pos2.y);
			ctx.lineWidth = width;
			ctx.strokeStyle = color;
			ctx.lineCap="round";
			ctx.stroke();
		break;

		case "eraser":
			ctx.clearRect(pos2.x - width, pos2.y - width, width * 2, width * 2);
		break;
	}

	if(emit)
		socket.emit("draw", pos1.x, pos1.y, pos2.x, pos2.y, color, width, tool);
}

socket.on("draw", function(startX, startY, x, y, color, width, tool){
	var pos1 = {
		x: startX,
		y: startY
	};
	var pos2 = {
		x: x,
		y: y
	};
	draw(pos1, pos2, tool, color, width, false);
});

function toggleGrid(){
	if(gridCheckbox.checked){
		c.className = "grid";
	}else{
		c.className = "";
	}
}
