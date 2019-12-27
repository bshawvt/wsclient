var ws = require("nodejs-websocket");
//var child = require("child_process");
//var proc = require("process");

var conf = 	{
				connectionSpam: false,
				password: "pretendimarandomlygeneratedhash",
				port: 29800,
			};

// main function start
(() => {

var server = ws.createServer(function(connection) {
	var token = connection.path.split("/");
	console.log(token[1], conf.magicToken);
	if(token[1] !== conf.magicToken) {
		connection.close(1000, "dead");
	}

	connection.on("text", function(input) {
		if (conf.connectionSpam) console.log("received %s", input);
		
		//if (conf.killOnDone)
		//	connection.close(1000, "success");
	});
	connection.on("disconnect", function(msg) {
		if (conf.connectionSpam) console.log("user disconnected %s", msg);
		connection.close(1000);
	});
	connection.on("error", function(reee) {
		// nodejs-websocket throws error if this does not exist
		if (conf.connectionSpam) console.log("connection error %s", reee);
		connection.close(1000, "error: " + reee);
	});
});

server.listen(conf.port);

})();
// main function end