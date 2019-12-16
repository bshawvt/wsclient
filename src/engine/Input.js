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


	var touchCanvas = new craw({id: "input", w: window.innerWidth - 4, h: window.innerHeight - 4});
	touchCanvas.style.position = "absolute";
	touchCanvas.style.border = "0.12em solid #fff";
	touchCanvas.style.pointerEvents = "none";

	this.touchstart = function(e) {
		//console.log("touchstart", e);
		craw.set(touchCanvas);
		for(var i = 0; i < e.targetTouches.length; i++) {
			var touch = e.targetTouches[i];
			var c = "rgb("+ (Math.floor(Math.random() * 255)) + ", " + (Math.floor(Math.random() * 255)) + ", " + (Math.floor(Math.random() * 255)) + ")";
			craw.circle({x: touch.clientX, y: touch.clientY, r: 5, f: true, c: c});
		}
	}
	this.touchend = function(e) {
		//console.log("touchend", e);
	}
	this.touchcancel = function(e) {
		//console.log("touchcancel", e);
	}
	this.touchmove = function(e) {
		//console.log("touchmove", e);
	}

	window.addEventListener('touchstart', this.touchstart);
	window.addEventListener('touchend', this.touchend);
	window.addEventListener('touchcancel', this.touchcancel);
	window.addEventListener('touchmove', this.touchmove);

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
	// i dont know if listeners are overwritten or not so gonna remove them just to be safe
	window.removeEventListener('mousedown', this.mousedown);
	window.removeEventListener('mouseup', this.mouseup);
	window.removeEventListener('mousemove', this.mousemove);
	window.removeEventListener('keydown', this.keydown);
	window.removeEventListener('keyup', this.keyup);

	window.removeEventListener('touchstart', this.touchstart);
	window.removeEventListener('touchend', this.touchend);
	window.removeEventListener('touchcancel', this.touchcancel);
	window.removeEventListener('touchmove', this.touchmove);

};

if (Controller !== undefined)
	Controller.clean();
var Controller = new Input();