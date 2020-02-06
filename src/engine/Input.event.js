function EventInput(event, noDefaultPropagation) {
	/* normalizes mouse/touch/keyboard events maybe and returns an Input.definitions object
		todo: multitouch support, keyboard support?
	*/
	this.x = undefined;
	this.y = undefined;
	this.key = undefined;
	this.map = undefined;

	switch(event.type) {
		case "touchstart":
		case "touchend":
		case "touchmove": { // todo: ???
			this.x = event.touches[0].pageX;
			this.y = event.touches[0].pageY;
			break;
		}
		case "mousedown":
		case "mouseup":
		case "mousemove": { // todo: this should account for pointer lock
			this.x = event.pageX;
			this.y = event.pageY;
			break;
		}
		case "keypress":
		case "keydown":
		case "keyup": { // todo: this is not 'future proof' because it uses keyCode
			if (event.code === undefined) break; // chrome sends keyboard events on autofill input
			this.key = event.keyCode;
			this.map = event.code.toUpperCase().replace("KEY", "");
			break;
		}

		default: {
			break;
		}
	}
	this.x = parseInt(this.x, 10);
	this.y = parseInt(this.y, 10);
	return this;
}
