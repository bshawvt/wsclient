function Input() {
	var self = this;
	this.buttonStates = [];
	this.mouseStates = [];

	this.cursorPosition = {x: 0, y: 0};

	this.pointerLock = false;
	
	this.mousedown = function(e) {
		// todo: mobile should go into fullscreen on touch
		if (typeof self.mouseStates[e.button] === 'undefined') {
			self.mouseStates[e.button] = {state: true, previousActiveTime: 0, activeTime: 0};
		}
		self.mouseStates[e.button].state = true;
		self.mouseStates[e.button].previousActiveTime = self.mouseStates[e.button].activeTime;
		self.mouseStates[e.button].activeTime = (new Date()).getTime();
	};
	this.mouseup = function(e) {
		if (typeof self.mouseStates[e.button] === 'undefined') {
			self.mouseStates[e.button] = {state: true};
		}
		self.mouseStates[e.button].state = false;
	};
	this.mousemove = function(e) {
		if (self.pointerLock) {
			// todo: mouse positions in pointerlock rely on screenX/Y
			return;
		}
		self.cursorPosition.x = e.pageX;
		self.cursorPosition.y = e.pageY;
	}
	this.keydown = function(e) {
		if (typeof self.buttonStates[e.keyCode] === 'undefined') {
			self.buttonStates[e.keyCode] = {state: true};
		} 
		self.buttonStates[e.keyCode].state = true;
		if (typeof self.buttonStates[e.keyCode].callback === 'function') {
			self.buttonStates[e.keyCode].callback(e);
		}
		if (self.buttonStates[e.keyCode].preventDefault == 1) {
			e.preventDefault();
		}
	}
	this.keyup = function(e) {
		if (typeof self.buttonStates[e.keyCode] === 'undefined') {
			self.buttonStates[e.keyCode] = {state: false};
		}
		self.buttonStates[e.keyCode].state = false;
	}


	window.addEventListener('mousedown', this.mousedown);
	window.addEventListener('mouseup', this.mouseup);
	window.addEventListener('mousemove', this.mousemove);
	window.addEventListener('keydown', this.keydown);
	window.addEventListener('keyup', this.keyup);

};
Input.prototype.getCursorPosition = function() {
	return this.cursorPosition;
};
Input.prototype.getMouseStates = function(button) {
	return this.mouseStates[button];
};
Input.prototype.getMouseState = function(button) {
	return this.mouseStates[button] ? this.mouseStates[button].state : false;
};
Input.prototype.getButtonState = function(button) {
	return this.buttonStates[button] ? this.buttonStates[button].state : false;
};
Input.prototype.addInputEvent = function(input, callback, preventDefault) {
	if (typeof this.buttonStates[input] === 'undefined') {
		this.buttonStates[input] = {state: false, callback: callback, preventDefault: preventDefault};
	}
};
Input.prototype.clean = function() { 
	// i dont know if listeners are overwritten or not so gonna remove them up just to be safe
	window.removeEventListener('mousedown', this.mousedown);
	window.removeEventListener('mouseup', this.mouseup);
	window.removeEventListener('mousemove', this.mousemove);
	window.removeEventListener('keydown', this.keydown);
	window.removeEventListener('keyup', this.keyup);
};

if (Controller !== undefined)
	Controller.clean();
var Controller = new Input();