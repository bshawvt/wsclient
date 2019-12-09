/* expects opt to have property with canvas id
	a canvas element must exist before the game object can be created */
function Game(opt) {
	var opt = opt || {};
	this.TimeStep = opt.timeStep || 1000/30; // used by animator, here for convenience
	this.network = null; 
	this.animator = null; // not instanced here because looping begins immediately
	this.context = new Context({ callback: this.resize });

	// opt.resources for preloaded assets
	this.resource = opt.resources || { images: [], sounds: [], models: [] };
	console.log(opt);
}

/* begins main loop 
	should be used to */
Game.prototype.start = function() {
	var self = this;
	if (this.animator !== null) {
		console.error();
	}
	this.animator = new Animator(this);
};
/* cleanup */
Game.prototype.stop = function() {
	if (this.animator!==null)
		this.animator.stop();
};

/* game logic */
Game.prototype.frame = function(dt) {
	var self = this;
	//console.log(true);
	if (Math.floor(Math.random() * 200) == 1) {
		if (this.resource.images["gradiant.png"] === undefined) {
			var load = new Loader([ "/bin/client/data/gradiant.png" ], function(done, asset) {
				self.resource.images.push(load.resource.images);
			});

		}
	}
};

/* animator will try to execute render as fast as possible
	in most web browsers it will be limited at 60fps
	can also be used */
Game.prototype.render = function(dt) {
	var self = this;
	craw.set(this.context.canvas.id);
	craw.clear();

	var img = this.resource.images["gradiant.png"];
	if (img)
	craw.img(img, {x: 0, y: 0, w: 200, h: 200, sw: 200, sh: 200});

};

/* functions exactly as render, except 
	animator calls this before stepping frames */
Game.prototype.flush = function() {
	
};
/* a callback called when context has been resized */
Game.prototype.resize = function(context) {
	//context.resize(window.innerWidth - 30, window.innerHeight - 30);
	context.resize(window.innerWidth - 1, window.innerHeight - 1);
};

/*
// attempt to load app
if (typeof app !=="undefined") {
	app.stop();
	console.log(app);
}
var app = undefined;
setTimeout(function() {

	new craw({parent: "canvas-1", id: "canvas2d_game"});

	var opt = { canvas: "canvas2d_game" };
	app = new Game(opt);
	app.start();

}, 100);
*/