function ContainerConnector(net) {
	Container.call(this, {});

	var self = this;
	this.w = 300;
	this.h = 500;
	
	this.net = net;

	// init the container element first
	this.container = this.createNodeElement({name: "div", className: "ui-container ui-default-container"});
	
	// addElement needs this.container to be a valid html5 element
	// element order mostly depends on css rules i guess idk
	var title = this.addElement({name: "div", className: "no-hide ui-default-title noselect", text: "Network Debug"});
	var remove = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-remove"}, title);
	var hide = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-hide"}, title);
	var body = this.addElement({name: "div", className: "ui-default-body"});


	this.addText("connection address:", body);
	//this.addElement({name: "br"});
	var addr = this.addElement({name: "input", className: "ui-default-input",
								attributes: [{	name: "value", value: Config.serverAddress.game.address}]}, 
								body);
	this.addText("session token:", body);
	//this.addElement({name: "br"});
	var port = this.addElement({name: "input", className: "ui-default-input",
								attributes: [{	name: "value", value: Config.serverAddress.game.port}]}, 
								body);
	this.addText("session token:", body);
	//this.addElement({name: "br"});
	var token = this.addElement({name: "input", className: "ui-default-input",
								attributes: [{	name: "value", value: ""}]}, 
								body);
	var connect = this.addElement({name: "button", text: "Connect", className: "ui-default-button ui-button float-right"}, body);
	connect.onclick = () => {
		console.log(addr, port, token);
		this.net.directConnect({address: addr.value, port: port.value, session: token.value});
	};

	this.addElement({name: "span", className: "clearfix"}, body);

	
	this.addDragEvent(title);
	this.addRemoveEvent(remove);
	this.addHideEvent(hide);

	this.appendContainer();
	this.update({x: this.x, y: this.y, w: this.w, h: this.h, pushIndex: true});
}
ContainerConnector.prototype = Object.create(Container.prototype);
ContainerConnector.prototype.constructor = ContainerConnector;
