function ContainerNetDebugger(net) {
	Container.call(this, {});

	var self = this;
	this.w = 400;
	this.h = 400;
	
	this.net = net; // Main.net reference

	// init the container element first
	this.container = this.createNodeElement({name: "div", className: "ui-container ui-default-container"});
	
	// addElement needs this.container to be a valid html5 element
	// element order mostly depends on css rules i guess idk
	var title = this.addElement({name: "div", className: "no-hide ui-default-title noselect", 
		text: "Net Debugger"});
	var remove = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-remove"}, title);
	var hide = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-hide"}, title);
	var body = this.addElement({name: "div", className: "ui-default-body"});
	var resize = this.addElement({name: "div", className: "ui-default-icon ui-default-icon-resize noselect"})
	


	var frame = this.addElement({name: "div", className: "ui-default-frame"}, body);
	var selectMsg = this.addElement({name: "select"}, frame);
	this.addElement({name: "option", text: "none"}, selectMsg);
	this.addElement({name: "option", text: "NetworkMessage"}, selectMsg);
	this.addElement({name: "br"}, frame);



	this.addText("deserialized frame:", frame);
	this.addElement({name: "br"}, frame);
	
	var frameFragment = this.addElement({name: "input", className: "ui-default-input ui-wide", 
			attributes: [{name: "value", value: "{}"}]
		}, frame);
	
	this.addElement({name: "br"}, frame);

	var addFragment = this.addElement({name: "button", text: "Add Message", 
		className: "ui-default-button ui-button ui-top-spaced"}, frame);
	
	this.addElement({name: "br"}, frame);
	this.addText("deserialized frames:", frame);
	this.addElement({name: "br"}, frame);
	
	var frames = this.addElement({name: "textarea", className: "ui-default-textarea ui-wide", 
		text: JSON.stringify(this.net.frame)}, frame);
	
	//this.addElement({name: "br"}, frame);

	var send = this.addElement({name: "button", text: "Send Frame", className: "ui-default-button ui-button"}, frame);
	
	var noClear = this.addElement({name: "input", id: "checkbox-net1", className: "", type: "checkbox"}, frame);
		this.addElement({name: "label", text: "clear frame on send", attributes: [{name: "for", value: "checkbox-net1"}]}, frame);

	this.addElement({name: "br"}, frame);
	var asBytes = this.addElement({name: "textarea", className: "ui-default-textarea ui-wide", text: ""}, frame);

	selectMsg.onchange = () => {
		if (selectMsg.value !== "none" || selectMsg.value !== "") {
			var t = eval(("new " + selectMsg.value + "({});"));
			frameFragment.value = JSON.stringify(t);
		}
	}
	addFragment.onclick = () => {
		try {
			tmp = JSON.parse(frameFragment.value);
			this.net.frame.push(tmp);
		}
		catch {
			console.log("fukken error");
		}
		finally {
			frames.value = JSON.stringify(this.net.frame);

		}
		

	};
	send.onclick = () => {
		if (!noClear.checked) {
			this.net.debugSendFrame();
		}
		else {
			this.net.sendFrame();
		}
		frames.value = JSON.stringify(this.net.frame);
	};
	
	this.addDragEvent(title);
	this.addRemoveEvent(remove);
	this.addHideEvent(hide);
	this.addDragEvent(resize, true);

	this.appendContainer();
	this.update({x: this.x, y: this.y, w: this.w, h: this.h, pushIndex: true});
}
ContainerNetDebugger.prototype = Object.create(Container.prototype);
ContainerNetDebugger.prototype.constructor = ContainerNetDebugger;
