//var ws = require("nodejs-websocket");
//var child = require("child_process");
var proc = require("process");

var WS = require('ws');

var config = 	{
				connectionSpam: false,
				password: "pretendimarandomlygeneratedhash",
				port: 29800,
			};

// main function start
(() => {
	
	var netObjects = [];//new Map();
	var uuid = 0;
	var queue = [];

	var server = new WS.Server({port: config.port, clientTracking: true});
	server.on('connection', function(socket, b, c) {


		//if (socket.netObjectId === undefined) {
		socket.netObjectId = ++uuid;
		socket.netObject = null; // reference to a netObjects element
		queue.push({socket: socket, id: uuid});

		//socket.netObject = netObjects[uuid];
		//}

		socket.on('message', function(msg, b, c) {
			var netObj = socket.netObject;//netObjects[socket.netObjectId];
			if (netObj === null || netObj === undefined) return; // todo: need to tell client to try again because users aren't added to netObjects array until after a flush
			try {
				//console.log("on message", a, JSON.parse(a), c);
				var message = JSON.parse(msg);
				console.log("message from: " + socket.netObjectId);
				console.log("netObjects length: " + netObjects.length);
				if (message.update) {
					//netObjects[socket.netObjectId];//.state.
					if (message.update.keyState)
						netObj.keyState = message.keyState;
					//if (message.update.inputState)
					//	netObj.inputState = message.inputState;
				}
			}
			catch (e) {
				//console.error(e);
			}
		});

		socket.on('close', function(a, b, c) {
			console.log("on close", a, b, c);
		});

	});

	var TimeStep = 1000/30;

	function update(dt) {
		for(var i = 0; i < netObjects.length; i++) {
			var object = netObjects[i];
			// shuffle off state changes to other clients
			if (object.keyState !== object.lastKeyState) {
				object.lastKeyState = object.keyState;
				server.clients.forEach(function(e) {
					e.send("fook");
				});
			}
			if (object.keyState == 1) {
				object.x += object.dir[0] * object.spd[0];
				object.y += object.dir[1] * object.spd[0];
			}
		}
	}
	function flush() {
		for(var i1 = 0; i1 < queue.length; i1++) {
			var item = queue[i1];
			var nObj = {	
							socket: item.socket, 
							keyState: 0,
							lastKeyState: 0,

							x: 0.0,
							y: 0.0,

							dir: [0.0, 0.0],
							spd: [1.0, 1.0]
						};
			netObjects.push(nObj);
			item.socket.netObject = nObj;
		}
		for(var i2 = 0; i2 < netObjects.length; i2++) {
			var obj = netObjects[i2];
			if (obj.removed) {
				netObjects[i2] = netObjects[netObjects.length - 1];
				netObjects[i2].pop();
				console.log("removed netobject #" + i2);
			}
		}
		queue = [];
	}

	var dt = (new Date()).getTime();
	function loop() {

		flush();
		
		var now = (new Date()).getTime();
		while(dt < now) {
			update(dt);
			dt+=TimeStep;
		}

		setImmediate(loop);
	}
	
	loop(); // start
})();
// main function end