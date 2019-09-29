function ContainerAuthDebugger(net) {
	Container.call(this, {});

	var self = this;
	this.w = 200;
	this.h = 270;
	
	this.net = net; // Main.net reference

	// init the container element first
	this.container = this.createNodeElement({name: "div", className: "ui-container ui-default-container"});
	
	// addElement needs this.container to be a valid html5 element
	// element order mostly depends on css rules i guess idk
	var title = this.addElement({name: "div", className: "no-hide ui-default-title noselect", 
		text: "Auth Debugger"});
	var remove = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-remove"}, title);
	var hide = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-hide"}, title);
	var body = this.addElement({name: "div", className: "ui-default-body"});
	//var resize = this.addElement({name: "div", className: "ui-default-icon ui-default-icon-resize noselect"})
	

	this.addText("connection address:", body);
	this.addElement({name: "br"}, body);
	var addr = this.addElement({name: "input", className: "ui-default-input",
								attributes: [{	name: "value", value: Config.servers.game.address}]}, 
								body);
	this.addElement({name: "br"}, body);
	this.addText("port:", body);
	this.addElement({name: "br"}, body);
	var port = this.addElement({name: "input", className: "ui-default-input",
								attributes: [{	name: "value", value: Config.servers.game.port}]}, 
								body);
	this.addElement({name: "br"}, body);
	this.addText("session token:", body);
	this.addElement({name: "br"}, body);
	var token = this.addElement({name: "input", className: "ui-default-input",
								attributes: [{	name: "value", value: ""}]}, 
								body);
	this.addElement({name: "br"}, body);
	this.addText("client version:", body);
	this.addElement({name: "br"}, body);
	var version = this.addElement({name: "input", className: "ui-default-input",
								attributes: [{ name: "value", value: Config.version.build }]}, 
								body);
	
	this.addElement({name: "br", className: "clearfix"}, body);

	var connect = this.addElement({name: "button", text: "Connect", className: "ui-default-button ui-button"}, body);
	connect.onclick = () => {
		console.log(addr, port, token, version);
		this.net.directConnect({address: addr.value, port: port.value, session: token.value, version: version.value});
	};
	
	this.addDragEvent(title);
	this.addRemoveEvent(remove);
	this.addHideEvent(hide);
	//this.addDragEvent(resize, true);

	this.appendContainer();
	this.update({x: this.x, y: this.y, w: this.w, h: this.h, pushIndex: true});
}
ContainerAuthDebugger.prototype = Object.create(Container.prototype);
ContainerAuthDebugger.prototype.constructor = ContainerAuthDebugger;
