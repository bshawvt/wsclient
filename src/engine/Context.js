/* context class should try to handle most canvas related things such as resizing
	or generating a canvas for the main application to use
	if opt has a callback function then the class will call it each time the window sends
	a resize event 

	for mobile devices it will lock orientation to either landscape or portrait */
function Context(opt) {
	var self = this;

	// create the canvas element
	this.canvas = document.createElement('canvas');
	this.canvas.id = (new Date()).getTime();
	//this.parent = opt.parent || window;

	this.canvas.width = opt.width || 400;
	this.canvas.height = opt.height || 400;

	// prevents calling event emitter more than once after user has activated the context
	this.hasActivated = false;

	// used to tell things that the user has focused on the canvas
	this.onactive = new EventManager(); 

	// using em because it seems to give the best results for desktop and mobile
	//this.canvas.style.width = this.canvas.width/16 + "em";
	//this.canvas.style.height = this.canvas.height/16 + "em";

	this.activate = function() {
		self.onActivate();
		//console.log("context has activated");
	}
	this.canvas.onclick = this.activate;

	this.parent = document.body;
	if (opt.parent !== undefined)
		this.parent = opt.parent;
	this.parent.appendChild(this.canvas);

	// some of my projects don't need to be have a resizeable canvas
	if (typeof opt.onresize === "function") {
		this.onresize = function() {
			opt.onresize(self);
		}
		window.addEventListener('resize', self.onresize);
	}

}

/* onActivate is used to tell the application that the user has clicked on the canvas
	and want to start the main application.
	for mobile devices it will initiate fullscreen and lock orientation to Config.orientation if it's not undefined 

	the activate event is emitted only once */
Context.prototype.onActivate = function() {

	if (isMobile()) {
		console.log("context has found its way into mobileland");
		// force mobile devices into fullscreen when they tap the canvas
		ToggleFullscreen(null, true);
		// prolly not worth it but maybe saves some time when orientation doesn't need to be changed 
		if (Config.orientation!==undefined && GetOrientation() !== Config.orientation) {
			MobileOrientation(Config.orientation);
		}
	}
	else { // non-mobile users only need onclick to call onActivate once
		//this.canvas.onclick = undefined;
		if (this.hasActivated) {
			this.canvas.requestPointerLock = this.canvas.requestPointerLock || this.canvas.mozRequestPointerLock;
			this.canvas.requestPointerLock();
		}
	}

	if (this.hasActivated) // prevent sending more than one activated event
		return;
	
	this.hasActivated = true;
	this.onactive.emit("activated");

};

// clean up and removes listener
Context.prototype.clean = function() { // todo:
	window.removeEventListener('resize', this.callback);
};

Context.prototype.resize = function(width, height) {
	this.canvas.width = width;
	this.canvas.height = height;

	//this.canvas.style.width = width/16 + "em";
	//this.canvas.style.height = height/16 + "em";
};