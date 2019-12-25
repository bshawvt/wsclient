function InputController(opts) {
	var self = this;
	this.buttonStates = [];
	this.mouseStates = [];

	this.cursorPosition = {x: 0, y: 0};

	this.touchKeys = [];//[{map: InputController.TEST_MOBILE}]; //
	this.touchSticks = [];//[/*{classNames: "app-bottom app-left app-controller-thumbs-dpad", type: 0}, */
						//{classNames: "app-bottom app-right app-controller-thumbs-vec", type: 1}]; // {classNames: '', type: ''}
	this.virtualMouseVec = [0.0, 0.0]; // 2d vector that is zero when the touch thing isnt active
	this.pointerLock = false;
	
	this.mousedown = function(e) {
		self._mouseDown(e);
	};
	this.mouseup = function(e) {
		self._mouseUp(e);
	};
	this.mousemove = function(e) {
		self._mouseMove(e);
	}
	this.keydown = function(e) {
		self._keyDown(e);
	}
	this.keyup = function(e) {
		self._keyUp(e);
	}


	/*var touchCanvas = new craw({id: "input", w: window.innerWidth - 4, h: window.innerHeight - 4});
	touchCanvas.style.position = "absolute";
	touchCanvas.style.border = "0.12em solid #fff";
	touchCanvas.style.pointerEvents = "none";*/
	//var analogs = [{classNames: "app-bottom app-left app-controller-thumbs-vec", type: 'analog'}, {classNames: "app-bottom app-right app-controller-thumbs-dpad"}];//[{classNames: "app-bottom app-center-horz"}];
	//var keys = [{map: InputController.TEST_MOBILE}];
	//console.log(keys);

	//this.showController({keys: this.touchKeys, sticks: this.touchSticks});//{keys: keys, sticks: this.touchSticks});

	/*this.touchstart = function(e) {
		//console.log("touchstart", e);
		//craw.set(touchCanvas);
		//for(var i = 0; i < e.targetTouches.length; i++) {
			//var touch = e.targetTouches[i];
			//var c = "rgb("+ (Math.floor(Math.random() * 255)) + ", " + (Math.floor(Math.random() * 255)) + ", " + (Math.floor(Math.random() * 255)) + ")";
			//craw.circle({x: touch.clientX, y: touch.clientY, r: 5, f: true, c: c});
		//}
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
	window.addEventListener('touchmove', this.touchmove);*/
	//if (isMobile()) {
		this.showController(opts);
	//}
	window.addEventListener('mousedown', this.mousedown);
	window.addEventListener('mouseup', this.mouseup);
	window.addEventListener('mousemove', this.mousemove);

	window.addEventListener('keydown', this.keydown);
	window.addEventListener('keyup', this.keyup);

};
InputController.prototype._mouseMove = function(e) {
	if (this.pointerLock) {
		// todo: mouse positions in pointerlock rely on screenX/Y
		return;
	}
	this.cursorPosition.x = e.pageX;
	this.cursorPosition.y = e.pageY;
};
InputController.prototype._mouseUp = function(e) {
	if (typeof this.mouseStates[e.button] === 'undefined') {
		this.mouseStates[e.button] = {state: true};
	}
	this.mouseStates[e.button].state = false;
};
InputController.prototype._mouseDown = function(e) {
	// todo: mobile should go into fullscreen on touch
	if (typeof this.mouseStates[e.button] === 'undefined') {
		this.mouseStates[e.button] = {state: true, previousActiveTime: 0, activeTime: 0};
	}
	this.mouseStates[e.button].state = true;
	this.mouseStates[e.button].previousActiveTime = this.mouseStates[e.button].activeTime;
	this.mouseStates[e.button].activeTime = (new Date()).getTime();
};
InputController.prototype._keyDown = function(e) {
	var keyCode = e.keyCode || e;

	if (typeof this.buttonStates[keyCode] === 'undefined') {
		this.buttonStates[keyCode] = {state: true};
	} 
	this.buttonStates[keyCode].state = true;
	if (typeof this.buttonStates[keyCode].callback === 'function') {
		this.buttonStates[keyCode].callback(e);
	}
	if (this.buttonStates[keyCode].preventDefault == 1) {
		e.preventDefault();
	}
};
InputController.prototype._keyUp = function(e) {
	var keyCode = e.keyCode || e;
	if (typeof this.buttonStates[keyCode] === 'undefined') {
		this.buttonStates[keyCode] = {state: false};
	}
	this.buttonStates[keyCode].state = false;
};

InputController.prototype.consumeButtonState = function(key) {
	this.buttonStates[key].state = false;
};

InputController.prototype.getCursorPosition = function() {
	this.cursorPosition.x += this.virtualMouseVec[0];
	this.cursorPosition.y += this.virtualMouseVec[1];
	return this.cursorPosition;
};
InputController.prototype.getMouseStates = function(button) {
	return this.mouseStates[button];
};
InputController.prototype.getMouseState = function(button) {
	return this.mouseStates[button] ? this.mouseStates[button].state : false;
};
InputController.prototype.getButtonState = function(button) {
	return this.buttonStates[button] ? this.buttonStates[button].state : false;
};
InputController.prototype.addInputEvent = function(input, callback, preventDefault) {
	if (typeof this.buttonStates[input] === 'undefined') {
		this.buttonStates[input] = {state: false, callback: callback, preventDefault: preventDefault};
	}
};
InputController.prototype.clean = function() { 
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

InputController.prototype.showController = function(opts) {
	var self = this;

	var html = document.createElement('div');
	html.setAttribute("id", "app-controller");
	document.body.appendChild(html);

	var edit = document.createElement('div');
	edit.setAttribute("class", "app-controller-edit app-right");
	var edit_virtualMouseSens = document.createElement("input");
	edit_virtualMouseSens.type = "range";
	edit.appendChild(edit_virtualMouseSens);
	edit.onclick = function() {
		if (this.toggled) {
			this.toggled = false;
			edit.setAttribute("class", "app-controller-edit app-right");
		}
		else {
			this.toggled = true;
			edit.setAttribute("class", "app-controller-edit-active app-right");
		}
	}
	//edit
	html.appendChild(edit);

	var imprintOffset = 9; // accumulation of each elements border sizes and thumb element


	for(var i = 0; i < opts.keys.length; i++) {
		var key = {};

		var o = opts.keys[i];
		console.log(opts);
		(function(opt) {
			key = document.createElement('div');

			var classNames = ['app-controller-key'];
			

			//classNames = classNames.join(" ");
			key.setAttribute('class', classNames.join(" "));
			html.appendChild(key);
			var rect = key.getClientRects()[0];
			console.log(rect, rect.left - rect.width);
			// window.innerWidth is always returning before context is focused for some reason 
			var sW = window.screen.availWidth;
			var sH = window.screen.availHeight;

			var initialWidth = Config.orientation === "landscape" ? sH : sW;
			var initialHeight = Config.orientation === "landscape" ? sW : sH;
			console.log(sW, sH);
			if (opt.initial !== undefined) {
				if (opt.initial.x) key.style.left = opt.initial.x + "px";
				if (opt.initial.y) key.style.top = opt.initial.y + "px";
				if (opt.initial.left) {
					//key.style.left = (0) + "px";
				}
				if (opt.initial.right) {
					var xoff = (opt.initial.xoff || 0) + 30; // 30 = margin * 2
					key.style.left = (initialWidth - rect.width - xoff ) + "px";
				}
				if (opt.initial.top) {
					//key.style.top = opt.initial.y + "px";
				}
				if (opt.initial.bottom) {
					var yoff = (opt.initial.yoff || 0) + 30; // 30 = margin * 2
					key.style.top = (initialHeight - rect.height - yoff ) + "px";
				}
				if (opt.initial.center !== undefined) {
					//key.style.left = ((initialWidth/2) - (((rect.width + 20) * opts.keys.length)/2) + ((rect.width + 10) * i)) + "px";
					var xoff = opt.initial.center.xoff || 0;
					var yoff = opt.initial.center.yoff || 0;
					if (opt.initial.center.x) {
						//key.style.left = ((initialWidth/2) - ((rect.width * xline)/2) - (rect.width * (xline-1))) + "px";
					}
					if (opt.initial.center.y) {
						//key.style.top = ((initialHeight/2) - ((rect.height * yline)/2) - (rect.height * (yline-1))) + "px";
					}
				}
				//if (opt.initial.) classNames.push("app-left");
				//if (opt.initial.right) classNames.push("app-right");
			}
			/*if (center) {
				key.style.left = ((width/2) - (((rect.width + 20) * opts.keys.length)/2) + ((rect.width + 10) * i)) + "px";
			}*/
			//key.style.left = (60 * i) + "px";
			//console.log(opts.keys[i], opts.keys);
			//console.log(opt);
			key.innerText = opt.map.map;//opts.keys[i];
			
			/* i dont think these listeners need to be removed later on since they're attached to an element */
			key.addEventListener('touchstart', function(e) {
				self._keyDown(opt.map.key);
				//window.navigator.vibrate(50);
				e.preventDefault();
			});

			key.addEventListener('touchend', function(e) {
				self._keyUp(opt.map.key);

			});

			
		})(o);
		//var result = r(o);
		//html.appendChild(result);
	}


	for(var i = 0; i < opts.sticks.length; i++) {

		var o = opts.sticks[i];
		(function(opt) {
			var classNames = ["app-controller-thumbs"];
			if (opt.initial !== undefined) {
				if (opt.initial.top) classNames.push("app-top");
				if (opt.initial.bottom) classNames.push("app-bottom");
				if (opt.initial.left) classNames.push("app-left");
				if (opt.initial.right) classNames.push("app-right");
				if (opt.initial.center) classNames.push("app-center-horz");
			}

			if (opt.type == 1) {
				classNames.push("app-controller-thumbs-vec");
			}
			else {
				classNames.push("app-controller-thumbs-dpad");
			}

			//classNames = classNames.join(" ");
			
			analog = document.createElement('div');
			analog.setAttribute('class', classNames.join(" "));

			//var rect = analog.getClientRects()[0];



			var imprint = document.createElement('div');
			imprint.setAttribute('class', 'app-controller-thumbs-imprint');
			

			analog.addEventListener('touchstart', function(e) {
				// targetTouches is getting lost some how.. i don't want to fix this, i want it to suffer
				//alert((this.getClientRects()[0].x + " " + this.getClientRects()[0].y));
				var rect = this.getClientRects()[0];
				var touches = [];
				for(var i1 = 0; i1 < 10; i1++) {
					touches[i1] = e.targetTouches[i1] !== undefined ? { x: e.targetTouches[i1].clientX, y:  e.targetTouches[i1].clientY } : undefined;
				}
				for(var i2 = 0; i2 < touches.length; i2++) {
					if (touches[i2] === undefined) continue;
					//alert(Math.floor(touches[i].x - rect.x) + "px")
					var rect2 = {
						x: rect.left, 
						y: rect.top, 
						width: rect.width, 
						height: rect.height, 
						centerx: rect.left + (rect.width/2),
						centery: rect.top + (rect.height/2)
					};

					this.children[0].style.left = Math.floor((touches[i2].x - imprintOffset) - rect2.x) + "px";
					this.children[0].style.top = Math.floor((touches[i2].y - imprintOffset) - rect2.y) + "px";
					//console.log( touches[i2].x - rect2.centerx );
					//this.children[0].style.left = Math.floor((touches[i2].x - imprintOffset) - rect2.width) + "px";
					//this.children[0].style.top	= Math.floor((touches[i2].y - imprintOffset) - rect2.height) + "px";

					/*this.children[0].style.left = Math.floor((touches[i2].x + imprintOffset) - rect.left) + "px";
					this.children[0].style.top	= Math.floor((touches[i2].y + imprintOffset) - rect.top) + "px";*/
				}
				window.navigator.vibrate(50);
				e.preventDefault();
			});
			analog.addEventListener('touchend', function(e) {
				var rect = this.getClientRects()[0];
				var rect2 = {
					x: rect.left, 
					y: rect.top, 
					width: rect.width, 
					height: rect.height, 
					centerx: rect.left + (rect.width/2),
					centery: rect.top + (rect.height/2)
				};
				var touches = [];
				for(var i1 = 0; i1 < 10; i1++) {
					touches[i1] = e.targetTouches[i1] !== undefined ? { x: e.targetTouches[i1].clientX, y:  e.targetTouches[i1].clientY } : undefined;
				}
				for(var i2 = 0; i2 < touches.length; i2++) {
					if (touches[i2] === undefined) continue;
					
					// a 'normal' virtual stick
					if (opt.type == 1) {

					}
					// virtual mouse thing
					else if (opt.type == 2) {
						//this.virtualMouseVec[0] = vector[0];
						//this.virtualMouseVec[1] = vector[1];
						//self.cursorPosition.x += ((( touches[i2].x - rect2.centerx ) / rect2.width) * 2 );
						//self.cursorPosition.y += ((( touches[i2].y - rect2.centery ) / rect2.height) * 2 );
					}
					// a dpad
					else {

					}
					if (opt.vm) {
						self.virtualMouseVec[0] = 0.0;//vector[0];
						self.virtualMouseVec[1] = 0.0;//vector[1];
					}
					console.log("asdasd");
				}
				if (opt.vm) {
					self.virtualMouseVec[0] = 0.0;//vector[0];
					self.virtualMouseVec[1] = 0.0;//vector[1];
				}
				this.children[0].style.left = Math.floor((rect2.width/2) - imprintOffset) + "px";
				this.children[0].style.top = Math.floor((rect2.height/2) - imprintOffset) + "px";
			});
			analog.addEventListener('touchcancel', function(e) {
				console.log(e);

			});

			//if (('ontouchmove' in document.documentElement) !== false)
			analog.addEventListener('touchmove', function(e) {
				//alert("asdasd");
				var rect = this.getClientRects()[0];
				
				var touches = [];
				for(var i1 = 0; i1 < 10; i1++) {
					touches[i1] = e.targetTouches[i1] !== undefined ? { x: e.targetTouches[i1].clientX, y:  e.targetTouches[i1].clientY } : undefined;
				}
				for(var i2 = 0; i2 < touches.length; i2++) {
					if (touches[i2] === undefined) continue;

					var rect2 = {
						x: rect.left, 
						y: rect.top, 
						width: rect.width, 
						height: rect.height, 
						centerx: rect.left + (rect.width/2),
						centery: rect.top + (rect.height/2)
					};

					var vector = [];
					vector[0] =	((( touches[i2].x - rect2.centerx ) / rect2.width) * 2 );
					vector[1] = ((( touches[i2].y - rect2.centery ) / rect2.height) * 2 );
					// a 'normal' virtual stick
					if (opt.type == 1) {

					}
					// virtual mouse thing
					else if (opt.type == 2) {

						//self.cursorPosition.x += ((( touches[i2].x - rect2.centerx ) / rect2.width) * 2 );
						//self.cursorPosition.y += ((( touches[i2].y - rect2.centery ) / rect2.height) * 2 );
					}
					// a dpad
					else {

					}
					if (opt.vm) {
						self.virtualMouseVec[0] = vector[0];
						self.virtualMouseVec[1] = vector[1];
					}
					// update position 
					this.children[0].style.left = Math.floor((touches[i2].x - imprintOffset) - rect2.x) + "px";
					this.children[0].style.top = Math.floor((touches[i2].y - imprintOffset) - rect2.y) + "px";
				}
				window.navigator.vibrate(10);
			});
			/*else
				analog.addEventListener('mousemove', function(e) {
					//alert("asdasd");
					var rect = this.getClientRects()[0];
					
					var touches = [];
					touches[0] = e.targetTouches[0] !== undefined ? { x: e.targetTouches[0].clientX, y:  e.targetTouches[0].clientY } : undefined;
					touches[1] = e.targetTouches[1] !== undefined ? { x: e.targetTouches[1].clientX, y:  e.targetTouches[1].clientY } : undefined;
					touches[2] = e.targetTouches[2] !== undefined ? { x: e.targetTouches[2].clientX, y:  e.targetTouches[2].clientY } : undefined;
					touches[3] = e.targetTouches[3] !== undefined ? { x: e.targetTouches[3].clientX, y:  e.targetTouches[3].clientY } : undefined;
					touches[4] = e.targetTouches[4] !== undefined ? { x: e.targetTouches[4].clientX, y:  e.targetTouches[4].clientY } : undefined;
					touches[5] = e.targetTouches[5] !== undefined ? { x: e.targetTouches[5].clientX, y:  e.targetTouches[5].clientY } : undefined;
					touches[6] = e.targetTouches[6] !== undefined ? { x: e.targetTouches[6].clientX, y:  e.targetTouches[6].clientY } : undefined;
					touches[7] = e.targetTouches[7] !== undefined ? { x: e.targetTouches[7].clientX, y:  e.targetTouches[7].clientY } : undefined;
					touches[8] = e.targetTouches[8] !== undefined ? { x: e.targetTouches[8].clientX, y:  e.targetTouches[8].clientY } : undefined;
					touches[9] = e.targetTouches[9] !== undefined ? { x: e.targetTouches[9].clientX, y:  e.targetTouches[9].clientY } : undefined;

					for(var i = 0; i < touches.length; i++) {
						if (touches[i] === undefined) continue;
						//alert(Math.floor(touches[i].x - rect.x) + "px")
						this.children[0].style.left = Math.floor(touches[i].x - rect.x) + "px";
						this.children[0].style.top = Math.floor(touches[i].y - rect.y) + "px";
					}
				});*/

			analog.appendChild(imprint);
			html.appendChild(analog);

		})(o);

	}

	

};

/*InputController.MOVE_LEFT = {key: 65, map: "A", bitmask: 1};
InputController.MOVE_RIGHT = {key: 68, map: "D", bitmask: 2};
InputController.MOVE_FORWARD = {key: 87, map: "W", bitmask: 4};
InputController.MOVE_BACKWARD = {key: 83, map: "S", bitmask: 8};


// ui 
InputController.TOGGLE_CONSOLE = {key: 9, map: "TAB"};
InputController.TOGGLE_CHAT = {key: 9, map: "TAB"};*/



// more debugs
//InputController.TEST_MOBILE = {key: 32, map: "SPACE"};




// a lot of these are wrong but still useful for certain instances
InputController.MOUSE_LEFT = 0;
InputController.MOUSE_MIDDLE = 1;
InputController.MOUSE_RIGHT = 2;
InputController.MOUSE_EX1 = 3;
InputController.MOUSE_EX2 = 4;
InputController.MOUSE_EX3 = 5;
InputController.MOUSE_EX4 = 6;
InputController.MOUSE_EX5 = 7;

InputController.KEY_BACKSPACE = 8;
InputController.KEY_TAB = 9;
InputController.KEY_ENTER = 13;
InputController.KEY_SHIFT = 16;
InputController.KEY_CTRL = 17;
InputController.KEY_ALT = 18;
InputController.KEY_PAUSE = 19;
InputController.KEY_CAPSLOCK = 20;
InputController.KEY_ESCAPE = 27;
InputController.KEY_SPACE = 32;
InputController.KEY_PAGEUP = 33;
InputController.KEY_PAGEDOWN = 34;
InputController.KEY_END = 35;
InputController.KEY_HOME = 36;

InputController.KEY_ARROW_LEFT = 37;
InputController.KEY_ARROW_UP = 38;
InputController.KEY_ARROW_RIGHT = 39;
InputController.KEY_ARROW_DOWN = 40;

InputController.KEY_INSERT = 45;
InputController.KEY_DELETE = 46;

InputController.KEY_0 = 48;
InputController.KEY_1 = 49;
InputController.KEY_2 = 50;
InputController.KEY_3 = 51;
InputController.KEY_4 = 52;
InputController.KEY_5 = 53;
InputController.KEY_6 = 54;
InputController.KEY_7 = 55;
InputController.KEY_8 = 56;
InputController.KEY_9 = 57;

InputController.KEY_A = 65;
InputController.KEY_B = 66;
InputController.KEY_C = 67;
InputController.KEY_D = 68;
InputController.KEY_E = 69;
InputController.KEY_F = 70;
InputController.KEY_G = 71;
InputController.KEY_H = 72;
InputController.KEY_I = 73;
InputController.KEY_J = 74;
InputController.KEY_K = 75;
InputController.KEY_L = 76;
InputController.KEY_M = 77;
InputController.KEY_N = 78;
InputController.KEY_O = 79;
InputController.KEY_P = 80;
InputController.KEY_Q = 81;
InputController.KEY_R = 82;
InputController.KEY_S = 83;
InputController.KEY_T = 84;
InputController.KEY_U = 85;
InputController.KEY_V = 86;
InputController.KEY_W = 87;
InputController.KEY_X = 88;
InputController.KEY_Y = 89;
InputController.KEY_Z = 90;

InputController.KEY_LWINDOWKEY = 91;
InputController.KEY_RWINDOWKEY = 92;
InputController.KEY_SELECT = 93;

InputController.KEY_NUMPAD_0 = 96;
InputController.KEY_NUMPAD_1 = 97;
InputController.KEY_NUMPAD_2 = 98;
InputController.KEY_NUMPAD_3 = 99;
InputController.KEY_NUMPAD_4 = 100;
InputController.KEY_NUMPAD_5 = 101;
InputController.KEY_NUMPAD_6 = 102;
InputController.KEY_NUMPAD_7 = 103;
InputController.KEY_NUMPAD_8 = 104;
InputController.KEY_NUMPAD_9 = 105;

InputController.KEY_MULTIPLY = 106;
InputController.KEY_ADD = 107;
InputController.KEY_SUBTRACT = 109;
InputController.KEY_DECIMAL = 110;
InputController.KEY_DIVIDE = 111;

InputController.KEY_F1 = 112;
InputController.KEY_F2 = 113;
InputController.KEY_F3 = 114;
InputController.KEY_F4 = 115;
InputController.KEY_F5 = 116;
InputController.KEY_F6 = 117;
InputController.KEY_F7 = 118;
InputController.KEY_F8 = 119;
InputController.KEY_F9 = 120;
InputController.KEY_F10 = 121;
InputController.KEY_F11 = 122;
InputController.KEY_F12 = 123;

InputController.KEY_NUMLOCK = 144;
InputController.KEY_SCROLLOCK = 145;
InputController.KEY_SEMICOLON = 186;
InputController.KEY_EQUAL = 187;
InputController.KEY_COMMA = 188;
InputController.KEY_DASH = 189;
InputController.KEY_PERIOD = 190;
InputController.KEY_FORWARDSLASH = 191;
InputController.KEY_GRAVE = 192;
InputController.KEY_OPENBRACKET = 219;
InputController.KEY_BACKSLASH = 220;
InputController.KEY_CLOSEBRACKET = 221;
InputController.KEY_QUOTE = 222;