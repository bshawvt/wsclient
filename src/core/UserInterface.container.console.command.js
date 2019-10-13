// invoker: 
function ConsoleCommand(invoker, input) {

	this.command = "";
	this.text = input;

	if (input[0] == "/") {

		var lines = input.split(" ");
		this.command = lines[0].toLowerCase();

		if (this.command == "/help") {
			this.text = "You have ^23423983been ^helped prolly";
		}

		else if (this.command == "/controls") {
			new ContainerControls();
		}

		else if (this.command == "/debug") {
			var dtype = lines[1].toLowerCase();
			if (dtype == "auth") {
				new ContainerAuthDebugger(invoker.net);
			}
			else if (dtype == "net") {
				new ContainerNetDebugger(invoker.net);
			}
		}

		else {
			this.text = "Unknown input";
		}

	}
	else {
		var blob = new ChatBlob();
		blob.message = input;
		invoker.net.frame.push(blob);
	}
}

ConsoleCommand.prototype.getResult = function() {
	return this;
};

/*function ConsoleCommand(input, consoleContainer) {
	
	//console.log(consoleContainer);
	if (consoleContainer === undefined) return;
	//if (this.hasGameReference(consoleContainer) == false) return;
	if (input[0] == "/") {
		var cmd = input.split(" ");
		var result = "";
		switch(cmd[0].toLowerCase()) {
			case "/oddwarg": {
				consoleContainer.addElement({name: "img", 
					attributes: [{name: "src", value: "../../bin/data/oddwarg.png"}]}, consoleContainer.textArea);
				break;
			}
			case "/c": {
				var p = parseInt(cmd[1]);
				result = "^16776960output: ^" + p + '\0' + p;
				break;
			}
			case "/hash": {
				var crypt = new sjcl.hash.sha256();
				var str = input.replace("/hash ", '');
				crypt.update(str);
				var hash = sjcl.codec.base64.fromBits(crypt.finalize());
				result = "^16776960output: ^" + hash						
				break;
			}
			case "/model": {
				var str = "new " + cmd[1];
				var obj = eval(str);
				consoleContainer.game.sceneManager.add(obj);
				//consoleContainer.game.sceneManager.add(new TestSceneObject({x: -1 + Math.floor(Math.random() * 2), y: -1 + Math.floor(Math.random() * 2)}));
				break;
			}
			case "/metrics": {
				new ContainerMetrics(consoleContainer.invoker);
				break;
			}
			case "/check": {
				function dopen() {

					var r = false;
					var t = /./;
					t.toString = function() { // firefox check
						r = true;
					}
					// chrome check
					var d = document.createElement('br');
					Object.defineProperty(d, "id", {get: () => { r = true; }});
					console.log(d, t);
					return r;
				}
				result = "dopen result: " + dopen();
				break;
			}
			case "/controls": {
				new ContainerControls();
				break;
			}
			default: {
				result = "^16711680error: ^unknown / command";
				break;
			}
		}
		//consoleContainer.addText(result, consoleContainer.textArea);
	}
	else {
		//consoleContainer.addText(input, consoleContainer.textArea);
	}
}
ConsoleCommand.prototype.hasGameReference = function(container) {
	if (container.invoker.game === undefined) {
		return false;
	}
	return true;
};*/