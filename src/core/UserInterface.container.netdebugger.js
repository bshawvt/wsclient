function ContainerNetDebugger(net) {
	Container.call(this, {});

	var self = this;
	this.w = 400;
	this.h = 400;
	
	this.net = net; // Main.net reference
	this.constructedNetMessage = new NetworkMessage();

	// init the container element first
	this.container = this.createNodeElement({name: "div", className: "ui-container ui-default-container"});
	
	// addElement needs this.container to be a valid html5 element
	// element order mostly depends on css rules i guess idk
	var title = this.addElement({name: "div", className: "no-hide ui-default-title noselect", 
		text: "Net Debugger"});
	var remove = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-remove"}, title);
	var hide = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-hide"}, title);
	var body = this.addElement({name: "div", className: "ui-default-body"});
	//var resize = this.addElement({name: "div", className: "ui-default-icon ui-default-icon-resize noselect"})
	
	var frame = this.addElement({name: "div", className: "ui-default-frame"}, body);
	this.addText("deserialized frame:", frame);
	this.addElement({name: "br"}, frame);
	
	var frameFragmentMessage = this.addElement({name: "input", className: "ui-default-input ui-wide", 
			attributes: [{name: "value", value: "{}"}]
		}, frame);
	
	this.addElement({name: "br"}, frame);

	var addFragment = this.addElement({name: "button", text: "Add Message", 
		className: "ui-default-button ui-button ui-top-spaced"}, frame);
	
	this.addElement({name: "br"}, frame);
	this.addText("deserialized frames:", frame);
	this.addElement({name: "br"}, frame);
	
	var frames = this.addElement({name: "textarea", className: "ui-default-textarea ui-wide", 
		text: "{}"}, frame);
	
	this.addElement({name: "br"}, frame);

	var send = this.addElement({name: "button", text: "Send Frame", className: "ui-default-button ui-button"}, frame);

	addFragment.onclick = () => {
		var tmp = {};
		try {
			tmp = JSON.parse(frameFragmentMessage.value);
		}
		catch {
			console.log("fukken error");
		}
		finally {
			this.net.frame.push(tmp);
		}
		frames.value = JSON.stringify(this.net.frame);

	};
	send.onclick = () => {
		console.log(this.net);
		this.net.sendFrame();
	};
	
	this.addDragEvent(title);
	this.addRemoveEvent(remove);
	this.addHideEvent(hide);
	//this.addDragEvent(resize, true);

	this.appendContainer();
	this.update({x: this.x, y: this.y, w: this.w, h: this.h, pushIndex: true});
}
ContainerNetDebugger.prototype = Object.create(Container.prototype);
ContainerNetDebugger.prototype.constructor = ContainerNetDebugger;
