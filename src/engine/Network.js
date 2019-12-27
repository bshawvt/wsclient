function Network(invoker) {
	
	this.invoker = invoker;
	this.netObjects = []; // a list of scene objects synchronized over a network
	this.netObjects[0] = {name: "Server"};
	this.socket = null;
	this.state = 0;

	this.frame = new NetworkFrame();
	this.ping = -1; // latency round trip time

	// get token
	this.session = document.cookie.match(/(^|;)?session=([^;]*)(;|$)/) || undefined;
	if (this.session!==undefined) { 
		this.session = this.session[2];
	}
	else {
		this.session = null;
	}

	// expire the one time use session cookie 
	//document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/client/index.html";
	console.log(this);
	console.log(invoker);
	new ContainerNetDebugger(this); // debug

};
Network.prototype.connect = function(args) {

	if (this.session === null) {
		this.invoker.ui.console("You need to authenticate before you can join the server");
		return;
	}

	if (this.socket == null) {
		this.invoker.ui.console("Connecting to server...");
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
Network.prototype.directConnect = function(args) {
	this.invoker.ui.console("directConnect to server...");
	var connectionString = [ args.address + ":",
		args.port + "/", args.session, "/", args.version  ];


	var socket = new WebSocket(connectionString.join(''));

	socket.onclose = (event) => { this.onClose(event); }
	socket.onerror = (event) => { this.onError(event); }
	socket.onmessage = (event) => { this.onMessage(event); }
	socket.onopen = (event) => { this.onOpen(event); }

	this.socket = socket;
};
Network.prototype.onClose = function(event) {
	this.invoker.ui.console("Disconnected: " + event.reason);
	this.setState(0);
};
Network.prototype.onError = function(event) {
	this.invoker.ui.console("Network error!");
};
Network.prototype.onMessage = function(event) {
	//this.invoker.ui.console("Network: " + event.data);
	var json = JSON.parse(event.data);
	console.log(json);
	//this.invoker.ui.console("raw: " + event.data);
	Events.emit("networkOnMessage", event.data);
	for(var i = 0; i < json.messages.length; i++) {
		var message = json.messages[i];

		switch(message.type) {
			case 0: {
				break;
			}
			case 1: { // chatblob
				//this.invoker.ui.chat(message);
				var channel = (() => {
					switch (message.channelId) {
						case 0: {
							return "All";
						}
						default: {
							return "^";
						}
					}
				})();

				var from = this.netObjects[message.from];
				if (from === undefined) {
					from = (this.netObjects[message.from] = {name:"unknown"});
				};

				this.invoker.ui.console(channel + ": " + from.name + ": " + message.message);
				break;
			}
			case 2: { // authenticate blob
				if (message.ready) {
					this.setState(1);
				}
				
				new ContainerCharacterSelect(this, message);
				
				break;//
			}
			case 3: { // authenticate

				break;
			}
			default: {
				break;
			}
		}
	}
};
Network.prototype.onOpen = function(event) {
	this.invoker.ui.console("Authenticating...");
};

Network.prototype.sendFrame = function() {
	//console.log(this.socket, this.state);
	if (this.socket !== null && this.state > 0 && this.frame.messages.length > 0) {
		this.socket.send(this.frame.serialize());
		this.frame.clear();
	}
};
Network.prototype.debugSendFrame = function() {
	if (this.socket !== null) {
		this.socket.send(this.frame.serialize());
		//this.frame.clear();
	}
};

Network.prototype.setState = function(state) {
	/* connection state
	0: unconnected
	1: authenticated
	*/
	this.state = state;
	//this.invoker.ui.console("state " + this.state);
};