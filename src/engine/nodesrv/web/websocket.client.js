function WebClient(opt) {
	var opt = opt || {};
	
	this.address 	= opt.address 	|| "localhost";
	this.port 		= opt.port 		|| 29800;
	this.token 		= opt.token 	|| "";
	this.form		= opt.form 		|| null; 

	this.socket 	= null;
	var connect = document.getElementById("mf-connect");
	connect.onclick = () => { this.connect(); };
	
	var stop = document.getElementById("mf-stop");
	stop.onclick = () => { this.socket.send("stop"); };

	var start = document.getElementById("mf-start");
	start.onclick = () => { this.socket.send("start"); };

	var restart = document.getElementById("mf-restart");
	restart.onclick = () => { this.socket.send("restart"); };

};
WebClient.prototype.connect = function(args) {
	
	if (this.socket == null) {

		this.token = window.prompt("to interact with the server please enter a passphrase:");

		var connectionString = ["ws://",
								this.address, 
								":",
								this.port, 
								"/", 
								this.token];
		console.log(connectionString);
		var socket = new WebSocket(connectionString.join(''));

		socket.onclose = (event) => { this.onClose(event); }
		socket.onerror = (event) => { this.onError(event); }
		socket.onmessage = (event) => { this.onMessage(event); }
		socket.onopen = (event) => { this.onOpen(event); }

		this.socket = socket;
		console.log(this.socket);
	}
};

WebClient.prototype.onClose = function(event) {
	console.log("disconnected");
	this.socket = null;
};
WebClient.prototype.onError = function(event) {
};
WebClient.prototype.onMessage = function(event) {
	console.log(event, event.data);
};
WebClient.prototype.onOpen = function(event) {
};
