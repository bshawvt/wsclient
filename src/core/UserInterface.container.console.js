function ContainerConsole(opt) {
	Container.call(this, opt);

	var self = this;
	this.game = opt.invoker.game;
	this.invoker = opt.invoker;
	console.log(opt);

	// init the container element first
	this.container = this.createNodeElement({name: "div", className: "ui-container ui-default-container"});
	
	// addElement needs this.container to be a valid html5 element
	// element order mostly depends on css rules i guess idk
	var title = this.addElement({name: "div", className: "no-hide ui-default-title noselect", text: this.title});
	var remove = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-remove"}, title);
	var hide = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-hide"}, title);
	var resize = this.addElement({name: "div", className: "ui-default-icon ui-default-icon-resize noselect"})
	var body = this.addElement({name: "div", className: "ui-example-body"});
	this.textArea = this.addElement({name: "div", className: "ui-example-textarea"}, body); 
	var footer = this.addElement({name: "div", className:"ui-example-footer"});

	this.addDragEvent(title);
	this.addRemoveEvent(remove);
	this.addHideEvent(hide);
	this.addDragEvent(resize, true);

	this.input = this.addElement({name: "input", className: "ui-example-input", 
		attributes: [{name: "placeholder", value: "> Press return to send"}]}, footer);
	this.input.onkeydown = function(e) {
		self.send(e);
	};

	this.appendContainer();
	this.update({x: this.x, y: this.y, w: this.w, h: this.h, pushIndex: true});
}
ContainerConsole.prototype = Object.create(Container.prototype);
ContainerConsole.prototype.constructor = ContainerConsole;

// 
ContainerConsole.prototype.send = function(e) {
	if (e) {
		var evt = new InputEvent(e);
		if (evt.key == Input.KEY_ENTER) {
			var input = this.input.value;
			
			this.appendText((new ConsoleCommand(this.invoker, input)).text);

			this.input.value = "";
			//this.addElement({name: "br"}, this.textArea);
			//this.textArea.scrollTop = this.textArea.scrollHeight;
		}
	}
};

ContainerConsole.prototype.appendText = function(text) {
	this.addText(text, this.textArea);
	this.addElement({name: "br"}, this.textArea);

	this.textArea.scrollTop = this.textArea.scrollHeight;

};

ContainerConsole.prototype.getOutput = function() {
	return this.textArea;
};