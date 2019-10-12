function UserInterface(invoker) {
	/*
	*/
	console.log(invoker);
	var self = this;
	this.invoker = invoker;
	
	window.topIndex = 0;

	this.elements = []; // map 

	//var metrics = new ContainerMetrics({metrics: this.invoker.metrics});
	var consoleOpt = {invoker: this.invoker, title: "Console", w: 350, h: 225};

	this.elements["console"] = new ContainerConsole(consoleOpt);
	this.elements["console"].update({snap: {right: true}});
	//this.elements["console"].hide();
	//console.update({snap: {top: true, left: true}});
	//var myconsole = null;
	/*Controller.addInputEvent(Input.KEY_TAB, function() {
		if (console==null || console.removed == true) {
			console = new ContainerConsole({game: self.invoker, title: "console", w: 275, h: 150});
		}
		else {
			console.hide();
		}
	}, true);*/
	document.addEventListener("keydown", function(e) {
		var evt = new InputEvent(e);
		if (evt.key == Input.TOGGLE_CONSOLE.key) {
			if (self.elements["console"]==null || self.elements["console"].removed == true) {
				self.elements["console"] = new ContainerConsole(consoleOpt);
			}
			else {
				self.elements["console"].hide();
			}
			e.stopPropagation();
			e.preventDefault();
		}

	});

	new Note("Press " + Input.TOGGLE_CONSOLE.map + " to enable the console");

	//(new ContainerLogin({title: "Join", w: 230, h: 190, y: 75, game: this.invoker}))
	//	.update({snap: {left: true, right: true}});

	/*
	new ContainerControls({w: 165, h: 300});*/
	/*setTimeout(function() {
		
	}, 100);*/
};

UserInterface.prototype.get = function(name) {
	if (this.elements[name] !== undefined)
		if (this.elements[name].removed == false)
			return this.elements[name];
	return null;
};

/* write data to a console UI element
*/
UserInterface.prototype.console = function(msg) {
	var out = this.get("console");
	if (out==null) {
		console.log(msg);
	}
	else {
		out.appendText(msg);
	}
};

UserInterface.prototype.addElement = function(name, obj) {
	this.elements[name] = obj;
};