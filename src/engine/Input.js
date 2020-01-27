// every time I come back to this class i only bring more sadness and despair
function InputController(opts) {
	var self = this;
	this.buttonStates = [];
	this.mouseStates = [];

	this.cursorPosition = {x: 0, y: 0};

	this.touchSettings = {sensX: 1, sensY: 1, 
		diagonalOffset: 0, 
		feedback: { start: 25, move: 25, enabled: true }
	};
	this.touchKeys = [];//[{map: InputController.TEST_MOBILE}]; //
	this.touchSticks = [];//[/*{classNames: "app-bottom app-left app-controller-thumbs-dpad", type: 0}, */
						//{classNames: "app-bottom app-right app-controller-thumbs-vec", type: 1}]; // {classNames: '', type: ''}
	this.virtualMouseVec = [0.0, 0.0]; // 2d vector that is zero when the touch thing isnt active
	this.pointerLock = false;

	this.controllerElements = []; //
	
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

	//if (isMobile()) {
		this._createMobileController(opts);
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

InputController.prototype.getCursorPosition = function() {
	this.cursorPosition.x += (this.virtualMouseVec[0] * this.touchSettings.sensX);
	this.cursorPosition.y += (this.virtualMouseVec[1] * this.touchSettings.sensY);
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


/* creates the settings menu thing for the mobile controller */
InputController.prototype._createSettingsElements = function(html) {
	var self = this;

	var toggle = document.createElement('div');
	toggle.setAttribute("class", "app-controller-edit app-right app-transparent");

	var edit = document.createElement('div');
	edit.setAttribute("class", "app-controller-edit-activate app-hidden");

	function closeSettings() {
		edit.setAttribute("class", "app-hidden");
		toggle.setAttribute("class", "app-controller-edit app-right app-transparent");
	}

	function openSettings() {
		edit.setAttribute("class", "app-controller-edit-activate");
		toggle.setAttribute("class", "app-controller-edit app-hidden");
	}

	toggle.onclick = function() {
		openSettings();	
	}
	
	var edit_l1container = document.createElement('div');
	edit_l1container.setAttribute("class", "app-controller-settings-group");
	var edit_label1 = document.createElement('label');
	edit_label1.innerText = "Virtual Mouse X Sensitivity:";
	
	var edit_virtualMouseSensX = document.createElement("input");
	edit_virtualMouseSensX.setAttribute("class", "app-slider");
	edit_virtualMouseSensX.type = "range";
	edit_virtualMouseSensX.min = 1;
	edit_virtualMouseSensX.max = 10;
	edit_virtualMouseSensX.value = 1;

	var edit_l2container = document.createElement('div');
	edit_l2container.setAttribute("class", "app-controller-settings-group");
	var edit_label2 = document.createElement('label');
	edit_label2.innerText = "Virtual Mouse Y Sensitivity:";

	var edit_virtualMouseSensY = document.createElement("input");
	edit_virtualMouseSensY.setAttribute("class", "app-slider");
	edit_virtualMouseSensY.type = "range";
	edit_virtualMouseSensY.min = 1;
	edit_virtualMouseSensY.max = 10;
	edit_virtualMouseSensY.value = 1;

	var edit_l3container = document.createElement('div');
	edit_l3container.setAttribute("class", "app-controller-settings-group");
	var edit_label3 = document.createElement('label');
	edit_label3.innerText = "D-Pad Diagonal Dead Zone:";

	var edit_diagDeadZone = document.createElement("input");
	edit_diagDeadZone.setAttribute("class", "app-slider");
	edit_diagDeadZone.type = "range";
	edit_diagDeadZone.min = -15;
	edit_diagDeadZone.max = 15;
	edit_diagDeadZone.value = 0;

	var edit_l4container = document.createElement('div');
	edit_l4container.setAttribute("class", "app-controller-settings-group");
	var edit_label4 = document.createElement('label');
	edit_label4.innerText = "Global Controller Opacity:";

	var edit_controllerOpacity = document.createElement("input");
	edit_controllerOpacity.setAttribute("class", "app-slider");
	edit_controllerOpacity.type = "range";
	edit_controllerOpacity.min = 0;
	edit_controllerOpacity.max = 10;
	edit_controllerOpacity.value = 10;

	edit_controllerOpacity.onchange = function(e) {
		self.controllerElements.forEach(function(e) {
			e.style.opacity = edit_controllerOpacity.value / 10;
		});
	}

	var edit_l5container = document.createElement('div');
	edit_l5container.setAttribute("class", "app-controller-settings-group");
	var edit_label5 = document.createElement('label');
	edit_label5.innerText = "Use Tactile Feedback? ";
	edit_label5.for = "tactileFeedback";

	var edit_checkbox = document.createElement("input");
	edit_checkbox.setAttribute("class", "app-checkbox");
	edit_checkbox.type = "checkbox";
	edit_checkbox.id = "tactileFeedback";
	edit_checkbox.checked = self.touchSettings.feedback.enabled;
	edit_checkbox.onchange = function(e) {
		self.touchSettings.feedback.enabled = this.checked;
	}
	
	var edit_l6container = document.createElement('div');
	edit_l6container.setAttribute("class", "app-controller-settings-group");
	var edit_label6 = document.createElement('label');
	edit_label6.innerText = "Screen Element Settings:";


	var edit_container = document.createElement("div");
	edit_container.setAttribute("class", "app-controller-settings-group");

	var edit_elementSettings = document.createElement("select");
	edit_elementSettings.setAttribute("class", "app-selector");

	var edit_item = document.createElement("div");
	
	var eldefault = document.createElement("option");
	eldefault.innerText = "- Choose an option -";
	edit_elementSettings.appendChild(eldefault);
	
	for(var i = 0; i<self.controllerElements.length;i++) {
		var el = document.createElement("option");
		var item = self.controllerElements[i];
		el.innerText = item.innerText.length > 0 ? item.innerText : "Controller";
		el.value = i;
		edit_elementSettings.appendChild(el);
	}

	edit_elementSettings.onchange = function(a, b) {
		
		for (var i = 0; edit_container.children.length; i++) {
			edit_container.children[i].remove();
		};
		if (isNaN(a.target.value)) return;

		var control = self.controllerElements[parseInt(a.target.value)];
		var rect = control.getClientRects()[0];//control.getBoundingClientRect();
		var itemX = rect.left;
		var itemY = rect.top;

		var itemContainer = document.createElement("div");
		
		var xLabel = document.createElement("label");
		xLabel.innerText = "Location X:";

		var itemXSlider = document.createElement("input");
		itemXSlider.setAttribute("class", "app-slider");
		itemXSlider.type = "range";
		itemXSlider.min = 0;
		itemXSlider.max = window.screen.availWidth - (rect.width*2);
		itemXSlider.value = itemX;
		itemXSlider.oninput = function(e) {
			control.style.left = this.value + "px";
		};

		var yLabel = document.createElement("label");
		yLabel.innerText = "Location Y:";

		var itemYSlider = document.createElement("input");
		itemYSlider.setAttribute("class", "app-slider");
		itemYSlider.type = "range";
		itemYSlider.min = 0;
		itemYSlider.max = window.screen.availHeight - rect.height;
		itemYSlider.value = itemY;
		itemYSlider.oninput = function(e) {
			control.style.top = this.value + "px";
			//yLabel.innerText = "Location Y:";
		};
		
		xLabel.appendChild(document.createElement("br"));
		xLabel.appendChild(itemXSlider);

		yLabel.appendChild(document.createElement("br"));
		yLabel.appendChild(itemYSlider);


		itemContainer.appendChild(xLabel);
		itemContainer.appendChild(document.createElement("br"));
		itemContainer.appendChild(yLabel);
		itemContainer.appendChild(document.createElement("br"));
		edit_container.appendChild(itemContainer);

	}

	//edit_container.appendChild(edit_label5);
	//edit_label5.appendChild(document.createElement("br"));
	edit_label6.appendChild(document.createElement("br"));
	edit_label6.appendChild(edit_elementSettings);
	edit_label6.appendChild(document.createElement("br"));
	edit_container.appendChild(edit_item);
	//edit_container.appendChild(edit_item);




	

	/*edit_elementSettings.onchange = function(e) {
		self.controllerElements.forEach(function(e) {
			e.style.opacity = edit_controllerOpacity.value / 10;
		});
	}*/

	var edit_save = document.createElement('button');
	edit_save.setAttribute("class", "app-buttons");
	edit_save.innerText = "Save";
	edit_save.onclick = function(e) {
		self.touchSettings.sensX = parseInt(edit_virtualMouseSensX.value);
		self.touchSettings.sensY = parseInt(edit_virtualMouseSensY.value);
		self.touchSettings.diagonalOffset = parseInt(edit_diagDeadZone.value);

		closeSettings();
		//e.stopPropagation();
	}

	var edit_cancel = document.createElement('button');
	edit_cancel.setAttribute("class", "app-buttons");
	edit_cancel.innerText = "Close";
	edit_cancel.onclick = function(e) {
		closeSettings();
		//e.stopPropagation();
	}

	var edit_default = document.createElement('button');
	edit_default.setAttribute("class", "app-buttons");
	edit_default.innerText = "Set to Default";
	edit_default.onclick = function(e) {
		edit_virtualMouseSensX.value = 1;
		edit_virtualMouseSensY.value = 1;
		edit_diagDeadZone.value = 0;
		
		self.touchSettings.sensX = parseInt(edit_virtualMouseSensX.value);
		self.touchSettings.sensY = parseInt(edit_virtualMouseSensY.value);
		self.touchSettings.diagonalOffset = parseInt(edit_diagDeadZone.value);
	}

	edit_label1.appendChild(document.createElement("br"));
	edit_label1.appendChild(edit_virtualMouseSensX);
	edit_l1container.appendChild(edit_label1);

	edit_label2.appendChild(document.createElement("br"));
	edit_label2.appendChild(edit_virtualMouseSensY);
	edit_l2container.appendChild(edit_label2);

	edit_label3.appendChild(document.createElement("br"));
	edit_label3.appendChild(edit_diagDeadZone);
	edit_l3container.appendChild(edit_label3);

	edit_label4.appendChild(document.createElement("br"));
	edit_label4.appendChild(edit_controllerOpacity);
	edit_l4container.appendChild(edit_label4);

	edit_label5.appendChild(edit_checkbox);
	edit_l5container.appendChild(edit_label5);

	edit_label6.appendChild(document.createElement("br"));
	edit_label6.appendChild(edit_container);
	edit_l6container.appendChild(edit_label6);


	edit.appendChild(edit_save);
	edit.appendChild(edit_cancel);
	edit.appendChild(edit_default);
	edit.appendChild(document.createElement("br"));
	edit.appendChild(document.createElement("br"));
	edit.appendChild(edit_l6container);
	edit.appendChild(document.createElement("br"));
	edit.appendChild(edit_l1container);
	edit.appendChild(document.createElement("br"));
	edit.appendChild(edit_l2container);
	edit.appendChild(document.createElement("br"));
	edit.appendChild(edit_l3container);
	edit.appendChild(document.createElement("br"));
	edit.appendChild(edit_l4container);
	edit.appendChild(document.createElement("br"));
	edit.appendChild(edit_l5container);
	edit.appendChild(document.createElement("br"));

	//edit
	html.appendChild(toggle);
	html.appendChild(edit);

};
/* params: { keys: [], sticks: [] }
	keys:
		{
			[
				position: - set the initial location
					{ 
						right: undefined, -- snap to a location on the screen
						left: true,
						center: undefined,
						top: false,
						bottom: true,

						xoff: undefined, -- repositioning snapped element
						yoff: -10,
					}
				map: InputController.MAP_* {
					id: "Jump", -- displayed as innerText for keys
					key: 32, -- a key code
					map: "SPACE", -- predicted key that needs to be pressed
					bitmask: 16 -- for network sync
				}
			]
		}
	sticks:
		{
			[
				position: - set the initial location
					{ 
						right: undefined,
						left: true,
						center: false,

						type: undefined, - can be undefined/0(=sets vector based on distance, for mobile games only), 1(=maps become dpad), 2(=sets cursor pos)

						xoff: undefined, - offsets to use 
						yoff: -10,

					}
				maps: [ InputController.MAP_* Object, ... ]
			]
		}
	*/
InputController.prototype._createMobileController = function(opts) {
	var self = this;
	var orientation = GetOrientation();

	var html = document.createElement('div');
	html.setAttribute("id", "app-controller");
	document.body.appendChild(html);

	var imprintOffset = 9; // accumulation of each elements border sizes and thumb element	

	var initialWidth = window.screen.availWidth || 0;
	var initialHeight = window.screen.availHeight || 0;
	//console.log(orientation, );
	if (orientation !== Config.orientation) {
		initialHeight = window.screen.availWidth || 0;
		initialWidth = window.screen.availHeight || 0;
	}

	for(var i = 0; i < opts.keys.length; i++) {
		var key = {};

		var o = opts.keys[i];
		console.log(opts);
		(function(opt) {
			key = document.createElement('div');

			//var classNames = ['app-controller-key'];
			

			//classNames = classNames.join(" ");
			key.setAttribute('class', "app-controller-key");
			html.appendChild(key);
			var rect = key.getClientRects()[0];

			// window.innerWidth is always returning before context is focused and in fullscreen
			if (opt.position !== undefined) {
				var xoff = opt.position.xoff || 0;
				var yoff = opt.position.yoff || 0;

				if (opt.position.left) {
					//key.style.left = (0) + "px";
					key.style.left = ( xoff ) + "px";
				}
				if (opt.position.right) {
					key.style.left = (initialWidth - (rect.width + (rect.width/2)) - xoff ) + "px";
				}
				if (opt.position.top) {
					key.style.top = yoff + "px";
				}
				if (opt.position.bottom) {
					key.style.top = (initialHeight - (rect.height + (rect.height/2)) - yoff ) + "px";
				}
				if (opt.position.center) {
					key.style.left = (((initialWidth - rect.width)/2) - xoff ) + "px";
				}

			}

			var keyDiv = document.createElement("div");
			keyDiv.innerText = opt.map.id;//opts.keys[i];
			key.appendChild(keyDiv);
			
			/* i dont think these listeners need to be removed later on since they're attached to an element */
			key.addEventListener('touchstart', function(e) {
				self._keyDown(opt.map.key);
				e.preventDefault();
			});

			key.addEventListener('touchend', function(e) {
				self._keyUp(opt.map.key);

			});

			self.controllerElements.push(key);

			
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
				classNames.push("app-controller-thumbs-dpad");
			}
			else {
				classNames.push("app-controller-thumbs-vec");
			}
			
			analog = document.createElement('div');
			analog.setAttribute('class', classNames.join(" "));

			var imprint = document.createElement('div');
			imprint.setAttribute('class', 'app-controller-thumbs-imprint');
			

			analog.addEventListener('touchstart', function(e) {
				// targetTouches is getting lost some how.. i don't want to fix this, i want it to suffer
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

					var vector = [];
					vector[0] =	((( touches[i2].x - rect2.centerx ) / rect2.width) * 2 );
					vector[1] = ((( touches[i2].y - rect2.centery ) / rect2.height) * 2 );
					// a dpad
					if (opt.type == 1) {

					}
					// virtual mouse thing
					else if (opt.type == 2) {
						self.virtualMouseVec[0] = vector[0];
						self.virtualMouseVec[1] = vector[1];
					}
					// a 'normal' virtual stick
					else {
						var f = opt.initial.right ? "right" : "left";
						self.touchSticks[f] = [vector[0], vector[1]];
					}

					this.children[0].style.left = Math.floor((touches[i2].x - imprintOffset) - rect2.x) + "px";
					this.children[0].style.top = Math.floor((touches[i2].y - imprintOffset) - rect2.y) + "px";

				}
				if (self.touchSettings.feedback.enabled)
					window.navigator.vibrate(self.touchSettings.feedback.start);
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
				if (opt.type == 1) {
					self._keyUp(opt.maps.left.key);
					self._keyUp(opt.maps.top.key);
					self._keyUp(opt.maps.right.key);
					self._keyUp(opt.maps.bottom.key);
				}
				else if (opt.type == 2) {
					self.virtualMouseVec[0] = 0.0;//vector[0];
					self.virtualMouseVec[1] = 0.0;//vector[1];
				}
				else {
					var f = opt.initial.right ? "right" : "left";
					self.touchSticks[f] = [0.0, 0.0];
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

					// a dpad
					if (opt.type == 1) {

						var dOffset = self.touchSettings.diagonalOffset;
						if (Math.sqrt((vector[0] * vector[0]) + (vector[1] * vector[1])) > 0.5) {

							var p = Math.atan2(-vector[1], vector[0]);
							var deg = Math.round(p/Math.PI*180);
							if (deg < 0) deg+=360;
							
							// this made oddwarg sad
							var left = deg > 150 && deg < 210;
							var right = deg < 45 || deg > 330;
							var top = deg > 60 && deg < 120;
							var bottom = deg > 240 && deg < 300;
							var rightTop = deg < 60 - dOffset && deg > 30 + dOffset;
							var rightBot = deg < 330 - dOffset && deg > 300 + dOffset;
							var leftTop = deg > 120 + dOffset && deg < 150 - dOffset;
							var leftBot = deg > 210 + dOffset && deg < 240 - dOffset;
							
							// right
							if (right || rightBot || rightTop)
								self._keyDown(opt.maps.right.key);
							else
								self._keyUp(opt.maps.right.key);

							// left 
							if (left || leftTop || leftBot)
								self._keyDown(opt.maps.left.key);
							else
								self._keyUp(opt.maps.left.key);

							// top
							if (top || leftTop || rightTop)
								self._keyDown(opt.maps.top.key);
							else
								self._keyUp(opt.maps.top.key);

							// bottom
							if (bottom || leftBot || rightBot)
								self._keyDown(opt.maps.bottom.key);
							else
								self._keyUp(opt.maps.bottom.key);
						
						}
						else {
							self._keyUp(opt.maps.right.key);
							self._keyUp(opt.maps.left.key);
							self._keyUp(opt.maps.top.key);
							self._keyUp(opt.maps.bottom.key);
						}

					}
					// virtual mouse thing
					else if (opt.type == 2) {
						self.virtualMouseVec[0] = vector[0];
						self.virtualMouseVec[1] = vector[1];
					}
					// a 'normal' virtual stick
					else {
						var f = opt.initial.right ? "right" : "left";
						self.touchSticks[f] = [vector[0], vector[1]];
					}
					// update position 
					this.children[0].style.left = Math.floor((touches[i2].x - imprintOffset) - rect2.x) + "px";
					this.children[0].style.top = Math.floor((touches[i2].y - imprintOffset) - rect2.y) + "px";
				}
				if (self.touchSettings.feedback.enabled)
					window.navigator.vibrate(self.touchSettings.feedback.move);
			});

			analog.appendChild(imprint);

			self.controllerElements.push(analog);
			html.appendChild(analog);

		})(o);

	}

	this._createSettingsElements(html);

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