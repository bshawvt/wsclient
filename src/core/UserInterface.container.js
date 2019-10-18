function Container(opt) {
	/* all containers should prolly inherit this class prolly
	*/
	this.container = null;
	//this.events = new UIBehaviors(this);
	this.title = "";
	this.x = 5;
	this.y = 5;
	this.w = 200; // width and height should probably match the container min/max size values
	this.h = 100;
	this.removed = false;
	this.hidden = false;

	if (opt !== undefined) {
		if (opt.title !== undefined) {
			this.title = opt.title;
		}
		if (opt.removable !== undefined) {
			this.removable = opt.removable;
		}
		if (opt.minimizable !== undefined) {
			this.minimizable = opt.minimizable;
		}
		if (opt.resizable !== undefined) {
			this.resizable = opt.resizable;
		}
		if (opt.x !== undefined) {
			this.x = opt.x;
		}
		if (opt.y !== undefined) {
			this.y = opt.y;
		}
		if (opt.w !== undefined) {
			this.w = opt.w;
		}
		if (opt.h !== undefined) {
			this.h = opt.h;
		}

	}
}
Container.prototype.updateCallback = function() {
	return null;
};
Container.prototype.update = function(opt) {
	/* alter container properties and other behaviors
	*/
	if (opt.pushIndex !== undefined) {
		if (opt.pushIndex == true) {// todo: i really don't like doing this
			this.container.style.zIndex = ++window.topIndex;
		}
	}
	if (opt.pushIndexHigh !== undefined) {
		this.container.style.zIndex = 10000000;
	}
	if (opt.x !== undefined) {
		this.x = opt.x;
	}
	if (opt.y !== undefined) {
		this.y = opt.y;
	}
	if (opt.w !== undefined) {
		this.w = opt.w;
		this.container.style.width = this.w + "px";
	}
	if (opt.h !== undefined) {
		this.h = opt.h;
		this.container.style.height = this.h + "px";
	}
	if (opt.snap !== undefined) {
		if (opt.snap.left !== undefined) {
			this.x = 5;
		} else if (opt.snap.right !== undefined) {
			this.x = (window.innerWidth - this.w) - 7;
		}
		if (opt.snap.left !== undefined && opt.snap.right !== undefined) {
			this.x = (window.innerWidth - this.w) / 2;
		}

		if (opt.snap.top !== undefined) {
			this.y = 5;
		} else if (opt.snap.bottom !== undefined) {
			this.y = (window.innerHeight - this.h) - 7;
		}
		if (opt.snap.top !== undefined && opt.snap.bottom !== undefined) {
			this.y = (window.innerHeight - this.h) / 2;
		}

		if (opt.snap.center !== undefined) {
			this.y = (window.innerHeight - this.h) / 2;
			this.x = (window.innerWidth - this.w) / 2;
		}
	}

	//this.x = clamp(this.x, 0, window-)

	this.container.style.left = this.x + "px";
	this.container.style.top = this.y + "px";

};
Container.prototype.addElement = function(opt, parent) {
	/* attempts to create a new node then append it to either this.container or parent if it's defined
	*/
	var element = this.createNodeElement(opt);
	if (parent!==undefined) {
		parent.appendChild(element);
	} 
	else {
		this.container.appendChild(element);
	}

	this.addZIndexEvent(element);
	return element;
};
Container.prototype.createNodeElement = function(opt) {
	/* should only ever be directly used when defining this.container
		opt properties:
			<opt.name value='opt.value'>
	*/
	if (opt.name == undefined || opt.name == null)  return;
	
	var node = document.createElement(opt.name); 
	if (opt.className !== undefined) {
		node.className = opt.className;// !== undefined ? opt.className : "");
	}

	if (opt.attributes !== undefined) {
		// add anything that is not covered by opt
		for(var i = 0; i < opt.attributes.length; i++) {
			node.setAttribute(opt.attributes[i].name, opt.attributes[i].value);
		}
	}
	if (opt.id !== undefined) {
		node.id = opt.id;
	}
	if (opt.value !== undefined) {
		node.value = opt.value;
	}

	var textNode = null;
	if (opt.text !== undefined) {
		textNode = document.createTextNode(opt.text);
		node.appendChild(textNode);
	}

	if (opt.type !== undefined) {
		node.type = opt.type;
	}
	return node;
};
Container.prototype.appendContainer = function() {
	/* should only ever be directly used once, at the end of the container constructor
	*/
	document.body.appendChild(this.container);
};
Container.prototype.addText = function(msg, parent, classNames) {
	// for coloring text quake style but takes an integar as rgb
	// todo: this does not work well with text elements that are meant to be changed
	var color = "text-color-white ";
	var classNames = classNames === undefined ? "" : classNames;
	if (typeof msg === "string") {
		var lines = msg.split(/(\^+\d*)/);
		for(var i = 0; i < lines.length; ++i) {
			if (lines[i].length > 0) {
				var style = "";
				if (lines[i][0] == "^") {
					var selector = parseInt(lines[i].replace("^", ''), 10);
					style = "color: " + int2rgb(selector);

					this.addElement({name: "span", className: classNames,
								text: lines[++i], // print next message because ^# came first
								attributes: [{name: "style", value: style}]}, parent); // print next line
				}
				else { // a regular message with no color styling
					this.addElement({name: "span", className: color + classNames, 
								text: lines[i]}, parent);
				}
			}
		};
	}
	else {
		this.addElement({name: "span", className: color, 
								text: msg}, parent);
	}
};

// events
Container.prototype.addRemoveEvent = function(element) {
	var self = this;
	function remove() {
		document.body.removeChild(self.container);
		self.removed = true;
	}
	element.addEventListener("click", remove);
};
Container.prototype.hide = function(opt) {
	/* hide the element doi
	*/
	var className = "ui-default-collapsed";
	if (opt !== undefined) {
		if (opt.className !== undefined) {
			className = opt.className;
		}
		if (opt == 1) {
			className = "ui-hidden";
		}

	}
	var regex = new RegExp("(?:^|\\s)" + className + "(?!\\S)", 'g');

	if (!this.hidden) {
		this.hidden = true;
		this.container.className += " " + className;
		for(var i = 0; i < this.container.children.length; i++) { // hide container contents because position: absolute; and im at my breaking point with css rn
			var chillens = this.container.children[i];
			if (chillens.className.match('no-hide') == null) {
				chillens.className += " ui-hide"; 
			}
		}
	}
	else {
		this.hidden = false;
		this.container.className = this.container.className.replace(regex , '');
		for(var i = 0; i < this.container.children.length; i++) { // unhiding container contents
			var chillens = this.container.children[i];
			if (chillens.className.match('no-hide') == null) {
				chillens.className = chillens.className.replace(/(?:^|\s)ui-hide(?!\S)/g, '');
			}
		}
	}
	
};
Container.prototype.addHideEvent = function(element, opt) {
	/* hides a container and its children by adding or removing its collapsed/hidden className
	*/
	var self = this;

	function hide(opt) {
		self.hide(opt);
	}
	element.addEventListener("click", hide);
};
Container.prototype.addZIndexEvent = function(element) {
	/* pushes the elements container and children to the top most z index
	*/
	var self = this;
	function activate() {
		self.update({pushIndex: true});
	}

	element.addEventListener("mousedown", activate);
	element.addEventListener("touchstart", activate);
};
Container.prototype.addDragEvent = function(element, resize) {
	/* allows an elements container and children to be moved if the element has been clicked
	if resize is true then then it updates container width and height to the cursor from the bottom right corner
	*/
	var self = this;
	var d = { x: 0, y: 0 };
	function release(e) { // removes all listeners set by grab
		d = { x: 0, y: 0 };
		document.removeEventListener("mouseup", release);
		document.removeEventListener("mousemove", move);

		document.removeEventListener("touchend", release);
		document.removeEventListener("touchmove", move);
	}
	function move(e) {
		var evt = new InputEvent(e);
		var rect = self.container.getBoundingClientRect();

		var x = clamp(evt.x - d.x, 0, window.innerWidth - rect.width - 5);
		var y = clamp(evt.y - d.y, 0, window.innerHeight - rect.height - 5);
		var w = clamp(evt.x - rect.left, 0, window.innerWidth - rect.left - 5);
		var h = clamp(evt.y - rect.top, 25, window.innerHeight - rect.top - 5);
		
		if (resize===true) {
			//console.log(w, h);
			self.update({w: w, h: h});
		}
		else {
			self.update({x: x, y: y});
		}
	}
	function grab(e) {
		var evt = InputEvent(e);
		var rect = self.container.getBoundingClientRect();
		d = {x: evt.x - rect.left, y: evt.y - rect.top };
		
		document.addEventListener("mouseup", release);
		document.addEventListener("mousemove", move);

		document.addEventListener("touchend", release);
		document.addEventListener("touchmove", move);
	}

	element.addEventListener("mousedown", grab);
	element.addEventListener("touchstart", grab);
};