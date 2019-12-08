/* expects opt to have property with canvas id
	a canvas element must exist before the game object can be created */
function Game(opt) {

	this.canvas = document.getElementById(opt.canvas);
	this.context = opt.canvas;
	this.timeStep = opt.timeStep || 1000/30;
}

/* begins main loop */
Game.prototype.start = function() {
	var self = this;
	this.loop = new Animator(this);
};

/* game logic */
Game.prototype.frame = function(dt) {
	console.log(1);
};

/* animator will try to execute render as fast as possible
	in most web browsers it will be limited at 60fps
	can also be used */
Game.prototype.render = function(dt) {
	var self = this;
	craw.set(this.context.canvas.id);
	craw.clear();

};

/* functions exactly as render, except 
	animator calls this before stepping frames */
Game.prototype.flush = function() {
	
};

/* cleanup */
Game.prototype.stop = function() {
	if (this.loop!==null)
		this.loop.stop();
};

// for cleanup on reload
if (typeof app !=="undefined") {
	app.stop();
}

// try to load script after page load
setTimeout(function() {

	new craw({parent: "canvas-1", id: "canvas2d_game"});

	var opt = { canvas: "canvas2d_game" };
	var app = new Game(opt);
	app.start();

}, 100);
