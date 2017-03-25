function SetName(name){
	socket.emit("login", name);
}

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

socket.on('reregister', function(){
	SetName(getCookie('name'));
});