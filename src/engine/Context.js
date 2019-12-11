/* context class should try to handle most canvas related things such as resizing
	or generating a canvas for the main application to use
	if opt has a callback function then the class will call it each time the window sends
	a resize event */
function Context(opt) {
	var self = this;

	// create the canvas element
	this.canvas = document.createElement('canvas');
	this.canvas.id = (new Date()).getTime();


	this.canvas.width = opt.width || 400;
	this.canvas.height = opt.height || 400;

	// using em because it seems to give the best results for desktop and mobile
	//this.canvas.style.width = this.canvas.width/16 + "em";
	//this.canvas.style.height = this.canvas.height/16 + "em";

	var parent = document.body;
	if (opt.parent !== undefined) {
		console.log(opt.parent);
		parent = opt.parent;
	}

	parent.appendChild(this.canvas);

	if (typeof opt.callback === "function") {
		this.callback = function() {
			opt.callback(self);
		}
		window.addEventListener('resize', self.callback);
	}

}

// clean up and removes listener
Context.prototype.clean = function() {
	window.removeEventListener('resize', this.callback);
};

Context.prototype.resize = function(width, height) {
	this.canvas.width = width;
	this.canvas.height = height;

	//this.canvas.style.width = width/16 + "em";
	//this.canvas.style.height = height/16 + "em";

	//this.canvas.style.width = width + "px";
	//this.canvas.style.height = height + "px";
};