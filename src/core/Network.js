function Network(invoker) {
	
	this.invoker = invoker;
	this.netObjects = []; // a list of scene objects synchronized over a network
	this.socket = null;
	this.state = 0;

	
	this.ping = -1; // latency round trip time

	// get token
	this.session = document.cookie.match(/(^|;)?session=([^;]*)(;|$)/) || undefined;
	if (this.session!==undefined) { 
		this.session = this.session[2];
		//this.connect(this.session);
	}
	else {
		this.session = null;
	}
	// expire the one time use session cookie 
	document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/client/index.html";
	console.log(this);

};
Network.prototype.connect = function(args) {

	if (this.session === null) {
		this.invoker.ui.output("You must login to play");

		new ContainerConnector(this);
		//this.invoker.ui.get("console").appendText("");
		//console.log("invalid token.. stopping");
		return;
	}
	if (this.socket == null) {
		this.invoker.ui.output("Connecting to server...");
		var connectionString = [ Config.serverAddress.game.address + ":",
			Config.serverAddress.game.port + "/", this.session, "&v=", Config.version.build ];
		var socket = new WebSocket(connectionString.join(''));
		// i hate these closures but it's the only way
		socket.onclose = (event) => { this.onClose(event); }
		socket.onerror = (event) => { this.onError(event); }
		socket.onmessage = (event) => { this.onMessage(event); }
		socket.onopen = (event) => { this.onOpen(event); }
		this.socket = socket;
	}
};
Network.prototype.directConnect = function(args) {
	this.invoker.ui.output("directConnect to server...");
	console.log(args.session);
	var connectionString = [ args.address + ":",
		args.port + "/", args.session, "/", args.version  ];


	var socket = new WebSocket(connectionString.join(''));
	// i hate these closures but it's the only way
	socket.onclose = (event) => { this.onClose(event); }
	socket.onerror = (event) => { this.onError(event); }
	socket.onmessage = (event) => { this.onMessage(event); }
	socket.onopen = (event) => { this.onOpen(event); }
	this.socket = socket;
};
Network.prototype.onClose = function(event) {
	this.invoker.ui.output("Disconnected: " + event.reason);
	console.log(event);
};
Network.prototype.onError = function(event) {
	this.invoker.ui.output("Network error!");
	console.log(event);
};
Network.prototype.onMessage = function(event) {
	this.invoker.ui.output("Network: " + event.data);
	console.log(event);
};
Network.prototype.onOpen = function(event) {
	this.invoker.ui.output("Authenticating...");
	this.state = 1;
	console.log(event);

};

Network.prototype.send = function(message) {

};
Network.prototype.sendFrame = function() {
	if (this.state == 2) {
		
	}
};