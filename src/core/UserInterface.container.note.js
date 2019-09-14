function Note(msg) {
	Container.call(this, undefined);

	var self = this;

	// init the container element first
	this.container = this.createNodeElement({name: "div", className: "ui-default-notification-container ui-default-notification-container noselect"});
	var body = this.addElement({name: "div", className: "ui-default-notification-body"});
	this.addText(msg, body);

	setTimeout(function() {
		document.body.removeChild(self.container);
	}, 10000); // remove this container after 10 seconds

	this.appendContainer();
	this.update({x: this.x, y: this.y, pushIndex: true});
}
Note.prototype = Object.create(Container.prototype);
Note.prototype.constructor = Note;
