function ContainerOptions(opt) { // used for rebinding controls
	Container.call(this, opt);

	var self = this;
	this.title = "Options & Settings";
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

	this.addElement({name:"button"}, body);
	this.addElement({name:"button"}, body);

	this.addElement({name:"span", className: "clearfix"}, body);

	this.addDragEvent(title);
	this.addRemoveEvent(remove);
	this.addHideEvent(hide);
	this.addDragEvent(resize, true);

	this.appendContainer();
	this.update({x: this.x, y: this.y, h: this.h, pushIndex: true});
}
ContainerOptions.prototype = Object.create(Container.prototype);
ContainerOptions.prototype.constructor = ContainerOptions;

// 