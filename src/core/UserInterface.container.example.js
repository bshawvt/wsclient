function ContainerExample(opt) { // container template for UserInterface
	Container.call(this, opt);

	var self = this;

	// init the container element first
	this.container = this.createNodeElement({name: "div", className: "ui-container ui-default-container"});
	
	// addElement needs this.container to be a valid html5 element
	// element order mostly depends on css rules i guess idk
	var title = this.addElement({name: "div", className: "no-hide ui-default-title noselect", text: this.title});
	var remove = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-remove"}, title);
	var hide = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-hide"}, title);
	var resize = this.addElement({name: "div", className: "ui-default-icon ui-default-icon-resize noselect"})
	var body = this.addElement({name: "div", className: "ui-default-body"});
	this.textArea = this.addElement({name: "div", className: "ui-default-textarea"}, body); 
	this.addText("^12353Hello ^834522world", this.textArea);
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
	this.update({x: this.x, y: this.y, pushIndex: true});
}
ContainerExample.prototype = Object.create(Container.prototype);
ContainerExample.prototype.constructor = ContainerExample;

// 