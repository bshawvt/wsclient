function ContainerControls(opt) { // used for rebinding controls
	Container.call(this, opt);

	var self = this;
	this.title = "Controls and Keybinds";
	//this.w = 300;

	// init the container element first
	this.container = this.createNodeElement({name: "div", className: "ui-container ui-default-container"});
	
	// addElement needs this.container to be a valid html5 element
	// element order mostly depends on css rules i guess idk
	var title = this.addElement({name: "div", className: "no-hide ui-default-title noselect", text: this.title});
	var remove = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-remove"}, title);
	var hide = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-hide"}, title);
	var resize = this.addElement({name: "div", className: "ui-default-icon ui-default-icon-resize noselect"})
	var body = this.addElement({name: "div", className: "ui-controls-body"});

	this.addText(	"To remap an action click the input box and press a key. " +
					"The string displayed may not match the key you pressed but this is a visual bug.", 
					body, "text-size-small");
	this.addElement({name:"br"}, body);
	this.addElement({name:"br"}, body);
	this.addText("Movement keys", body);
	this.addElement({name:"br"}, body);

	var tmp = this.addElement({name: "div", className: "float-right"}, body);
	this.addText("Strafe Left: ",tmp);
	var strafeLeft = this.addElement({name: "input", className: "ui-controls-input", 
		attributes: [{	name: "value", value: Input.MOVE_LEFT.map},
					{	name: "readonly", value: ""}]}, tmp);
	this.addElement({name:"br", className: "clearfix"}, body);

	var tmp = this.addElement({name: "div", className: "float-right"}, body);
	this.addText("Strafe Right: ",tmp);
	var strafeRight = this.addElement({name: "input", className: "ui-controls-input", 
		attributes: [{	name: "value", value: Input.MOVE_RIGHT.map},
					{	name: "readonly", value: ""}]}, tmp);
	this.addElement({name:"br", className: "clearfix"}, body);

	var tmp = this.addElement({name: "div", className: "float-right"}, body);
	this.addText("Forward: ",tmp);
	var forward = this.addElement({name: "input", className: "ui-controls-input", 
		attributes: [{	name: "value", value: Input.MOVE_FORWARD.map},
					{	name: "readonly", value: ""}]}, tmp);
	this.addElement({name:"br", className: "clearfix"}, body);

	var tmp = this.addElement({name: "div", className: "float-right"}, body);
	this.addText("Backward: ",tmp);
	var backward = this.addElement({name: "input", className: "ui-controls-input", 
		attributes: [{	name: "value", value: Input.MOVE_BACKWARD.map},
					{	name: "readonly", value: ""}]}, tmp);
	this.addElement({name:"br", className: "clearfix"}, body);

	this.addElement({name:"br"}, body);
	this.addText("User Interface ", body);
	this.addElement({name:"br"}, body);

	var tmp = this.addElement({name: "div", className: "float-right"}, body);
	this.addText("Toggle Console: ",tmp);
	var toggleConsole = this.addElement({name: "input", className: "ui-controls-input", 
		attributes: [{	name: "value", value: Input.TOGGLE_CONSOLE.map},
					{	name: "readonly", value: ""}]}, tmp);
	this.addElement({name:"br", className: "clearfix"}, body);

	strafeLeft.addEventListener("keydown", function(e){
		var evt = new InputEvent(e);
		Input.MOVE_LEFT = evt;
		this.value = Input.MOVE_LEFT.map;
	});
	strafeRight.addEventListener("keydown", function(e){
		var evt = new InputEvent(e);
		Input.MOVE_RIGHT = evt;
		this.value = Input.MOVE_RIGHT.map;
	});
	forward.addEventListener("keydown", function(e){
		var evt = new InputEvent(e);
		Input.MOVE_FORWARD = evt;
		this.value = Input.MOVE_FORWARD.map;
	});
	backward.addEventListener("keydown", function(e){
		var evt = new InputEvent(e);
		Input.MOVE_BACKWARD = evt;
		this.value = Input.MOVE_BACKWARD.map;
	});
	toggleConsole.addEventListener("keydown", function(e){
		var evt = new InputEvent(e);
		Input.TOGGLE_CONSOLE = evt;
		this.value = Input.TOGGLE_CONSOLE.map;
	});

	/*this.addText("stuff", body);
	this.addElement({name:"br"}, body);

	var tmp = this.addElement({name: "div", className: "float-right"}, body);
	this.addText(": ",tmp);
	this.addElement({name: "input", className: "ui-controls-input", 
		attributes: [{name: "value", value: String.fromCharCode(Input.KEY_A)}]}, tmp);
	this.addElement({name:"br"}, body);*/

	this.addElement({name:"span", className: "clearfix"}, body);





	
	//var footer = this.addElement({name: "div", className:"ui-example-footer"});

	// this.events is a a UIBehavior object created by the container super class
	/*this.events.addDragEvent(title);
	this.events.addRemoveEvent(remove);
	this.events.addHideEvent(hide);
	this.events.addDragEvent(resize, true);*/

	this.addDragEvent(title);
	this.addRemoveEvent(remove);
	this.addHideEvent(hide);
	this.addDragEvent(resize, true);

	this.appendContainer();
	this.update({x: this.x, y: this.y, h: this.h, pushIndex: true});
}
ContainerControls.prototype = Object.create(Container.prototype);
ContainerControls.prototype.constructor = ContainerControls;

// 