function Network(opts) {
	var opts = opts || {};
	this.queuedMessage = []; // holds messages that shouldn't be processed immediately
	this.netObjects = []; // a list of scene objects synchronized over a network
	this.socket = null;
	this.state = 0; // 0 disconnected, 1 awaiting character select, 2 ready
	this.hasStarted = false; // set from Game.start

	//this.out = opts.out || console.log;
	this.frame = new NetworkFrame();
	this.ping = -1;

	// get token
	this.session = document.cookie.match(/(^|;)?session=([^;]*)(;|$)/) || undefined;
	if (this.session!==undefined) { 
		this.session = this.session[2];
	}
	else {
		this.session = null;
	}
	// expire the token because it is one time use and limited time only anyway
	document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/bin.html";

	this.console = null;
	this.connect();

};
Network.prototype.process = function(message) {
	switch(message.type) {
		case 0: {
			break;
		}
		case 1: { // chatblob
	
			break;
		}
		case 2: { // authenticate blob
			if (message.ready) {
				new ContainerCharacterSelect(this, message);
				this.state = 2;
			}
			else {
				this.out("there a server error.");
				this.close();
			}
			break;//
		}
		case 3: { 

			break;
		}
		default: {
			break;
		}
	}
};
Network.prototype.connect = function() {

	if (this.session === null) {
		console.log("You need to login before you can join the server");
		return;
	}

	if (this.socket == null) {
		console.log("Connecting to server...");
		var connectionString = [ Config.servers.game.address, ":",
			Config.servers.game.port, "/", this.session, "/", Config.version.build ];

		var socket = new WebSocket(connectionString.join(''));

		socket.onclose = (event) => { this.onClose(event); }
		socket.onerror = (event) => { this.onError(event); }
		socket.onmessage = (event) => { this.onMessage(event); }
		socket.onopen = (event) => { this.onOpen(event); }

		this.socket = socket;
	}
};

Network.prototype.onClose = function(event) {
	console.log("Disconnected: " + event.reason);
	//this.setState(0);
};
Network.prototype.onError = function(event) {
	console.log("Network error!");
};
Network.prototype.onMessage = function(event) {
	//this.invoker.ui.console("Network: " + event.data);
	var json = JSON.parse(event.data);
	console.log(json);
	for(var i = 0; i < json.messages.length; i++) {
		var message = json.messages[i];
		if (!this.hasStarted) {
			this.queuedMessage.push(message);
			continue;
		}
		this.process(message);
	}
};
Network.prototype.onOpen = function(event) {
	console.log("Authenticating...");
	this.state = 1;
};

Network.prototype.sendFrame = function() {
	//console.log(this.socket, this.state);
	if (this.socket !== null && this.state > 0 && this.frame.messages.length > 0) {
		this.socket.send(this.frame.serialize());
		this.frame.clear();
	}
};
/* called when Game has been activated to propagate messages received before it was activated */
Network.prototype.start = function() {
	new ContainerCharacterSelect(this, {ready: true, characters: [], id: 0, type: 2 });
	this.console = new ContainerConsole(this);
	var self = this;
	this.hasStarted = true;
	this.queuedMessage.forEach(function(item) {
		self.process(item);
	});
	this.queuedMessage = [];
};
Network.prototype.close = function() {
	this.socket.close();
};
Network.BlobTypes = {};
Network.BlobTypes.None = 0;
Network.BlobTypes.Chat = 1;
Network.BlobTypes.Join = 2;
Network.BlobTypes.State = 3;