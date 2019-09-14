function Input(invoker) {
	var self = this;
	this.buttonStates = [];
	this.mouseStates = [];

	this.cursorPosition = {x: 0, y: 0};

	this.pointerLock = false;

	window.addEventListener('mousedown', function(e) {
		// todo: mobile should go into fullscreen on touch
		if (typeof self.mouseStates[e.button] === 'undefined') {
			self.mouseStates[e.button] = {state: true, previousActiveTime: 0, activeTime: 0};
		}
		self.mouseStates[e.button].state = true;
		self.mouseStates[e.button].previousActiveTime = self.mouseStates[e.button].activeTime;
		self.mouseStates[e.button].activeTime = (new Date()).getTime();
	});
	window.addEventListener('mouseup', function(e) {
		if (typeof self.mouseStates[e.button] === 'undefined') {
			self.mouseStates[e.button] = {state: true};
		}
		self.mouseStates[e.button].state = false;
	});
	window.addEventListener('mousemove', function(e) {
		if (self.pointerLock) {
			// todo: mouse positions in pointerlock rely on screenX/Y
			return;
		}
		//console.log(e);
		self.cursorPosition.x = e.pageX;
		self.cursorPosition.y = e.pageY;
	});

	window.addEventListener('keydown', function(e) {
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
	});
	window.addEventListener('keyup', function(e) {
		if (typeof self.buttonStates[e.keyCode] === 'undefined') {
			self.buttonStates[e.keyCode] = {state: false};
		}
		self.buttonStates[e.keyCode].state = false;
	});
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
	/* remapping is not supported and my poo brain hasn't let me figure out a solution for that yet
	instead it's best to just create a new keydown listener
	*/
	if (typeof this.buttonStates[input] === 'undefined') {
		this.buttonStates[input] = {state: false, callback: callback, preventDefault: preventDefault};
	}
};
var Controller = null;
