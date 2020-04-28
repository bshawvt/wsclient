/* message response is expected to be a join blob */
function Container() {

}

Container.Menu = 1;
Container.Console = 2;
Container.Select = 4;
Container.Todo = 8;

function ContainerMenu() {
	var html = document.getElementById("ui-container");
	if (html==null) {
		html = document.createElement("div");
		html.id = "ui-container";
		document.body.appendChild(html);
	}

	var container = document.createElement("div");
	container.setAttribute("class", "ui-menu");

	html.appendChild(container);
}
function ContainerCharacterSelect(network, message) {
	var html = document.getElementById("ui-container");
	if (html==null) {
		html = document.createElement("div");
		html.id = "ui-container";
		document.body.appendChild(html);
	}

	var container = document.createElement("div");
	container.setAttribute("class", "ui-charselect");

	var group = document.createElement("div");

	function close() {
		html.removeChild(container);
	}

	for(var i = 0; i < message.characters.length; i++) {
		var select = document.createElement("div");
		select.setAttribute("class", "ui-charselect-item");
		select.data = message.characters[i].id;
		select.onclick = function() {
			console.log(this.data);
			var blob = {type: Network.BlobTypes.Join, id: this.data};
			network.frame.push(blob);
			close();
		}
		console.log(message.characters[i]);
		select.innerText = message.characters[i].name;
		group.appendChild(select);
	}

	if (message.characters.length < 3) {
		var select = document.createElement("div");
		select.setAttribute("class", "ui-charselect-item");
		select.onclick = function() {
			var blob = {type: Network.BlobTypes.Join, id: -1};
			console.log(blob);
			network.frame.push(blob);
			close();
		}
		select.innerText = "Create new character";
		group.appendChild(select);
	}
	container.appendChild(group);
	html.appendChild(container);
}

function ContainerConsole(game) {
	var html = document.getElementById("ui-container");
	if (html==null) {
		html = document.createElement("div");
		html.id = "ui-container";
		document.body.appendChild(html);
	}

	var self = this;
	//var html = document.body;
	var container = document.createElement("div");
	container.setAttribute("class", "ui-console ui-console-hidden");

	var messages = document.createElement("div");
	messages.setAttribute("class", "ui-console-messagebody");

	//this.cl = console.log;
	this.append = function(arguewithmem8) {
		//self.cl(arguewithmem8);
		for(var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			var m = arg;
			if (typeof arg === "object") {
				m = JSON.stringify(arg);
			}
			var msg = document.createElement("div");
			msg.innerText = m;
			//this.scrollTop = this.scrollHeight;
			if (!isMobile()) {
				messages.appendChild(msg);
				messages.scrollTop = messages.scrollHeight;
			}
			else { // 
				messages.prepend(msg);
				messages.scrollTop = 0;
			}
		}
	}

	this.isActive = true;
	this.toggle = function() {
		console.log("!");
		self.isActive = !self.isActive;
		if (self.isActive) { // open state
			container.setAttribute("class", "ui-console");
		}
		else { // closed state
			container.setAttribute("class", "ui-console ui-console-collapse");
		}
	}
	this.show = function(a) {
		//self.isActive = !self.isActive;
		if (a) { // open state
			container.setAttribute("class", "ui-console");
		}
		else { // closed state
			container.setAttribute("class", "ui-console-hidden");
		}
	}

	var inputContainer = document.createElement("div");
	inputContainer.setAttribute("class", "ui-console-input");

	var input = document.createElement("input");
	input.placeholder = "> Press enter to send";

	var player = null;

	function send(event) {
		var evt = {};
		if (event === null) { // null only when send is clicked
			evt.key = 13;
		}
		else {
			evt = new EventInput(event);
		}

		if (evt.key == 13) {
			var cmds = input.value.trim().split(" ");
			if (cmds.length == 0) cmds[0] = "";

			console.log("input" + input.value.trim());
			if (input.value.trim() == "toggle") {
				console.log("toggled console");
				self.toggle();
			}
			else if (cmds[0] == "yawspeed" ) {
				if (cmds.length > 1) {
					Config.input.sensX = cmds[1];
					Config.input.sensY = cmds[1];
				}
			}
			else if (cmds[0] == "playertest") {
				console.log("doing bad things...");
				var s = new ScenePlayer(game);
				player = s;
				s.isPlayer = true;
				game.camera.attach(s);
				game.add(s);
			}
			else if (cmds[0] == "accel") {
				console.log("doing bad things...");
				if (player != null) {
					player.speed[0] = 2;
				}
			}
			self.append(input.value);
			input.value = "";
		}
	}
	input.onkeydown = send;

	var sendBtn = document.createElement("button");
	sendBtn.setAttribute("class", "ui-console-input-send");
	sendBtn.innerText = "Send";
	sendBtn.onclick = function(e) { send(null); };

	inputContainer.appendChild(input);
	inputContainer.appendChild(sendBtn);

	//console.log = this.append;
	container.appendChild(messages);
	container.appendChild(inputContainer);

	html.appendChild(container);

}