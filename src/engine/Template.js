/* params: opt - 
	timeStep = kind of pointless,
	resources = should be an array array from Loader.js or similar for adding preloaded assets
		to ResourceManager */
function Game(opt) {
	var opt = opt || {};
	this.TimeStep = opt.timeStep || 1000/30; // used by animator, here for convenience
	this.network = null; 
	this.animator = null; // not instanced here because looping begins immediately
	this.context = new Context({ width: window.innerWidth, height: window.innerHeight, callback: this.resize });

	// opt.resources for preloaded assets
	this.resource = new ResourceManager(opt.resources);
	this.dynamicObjects = [];
	this.startTime = 0xffffffffffffff;
}
/* begins main loop because of animator
	should be used to initialize things */
Game.prototype.start = function() {
	var self = this;

	if (this.animator !== null && !this.animator.done)
		throw "error: animator is already active";
	this.animator = new Animator(this);
	this.startTime = this.animator.dt;
	
	this.dynamicObjects = [ {x: 5, y: 5, width: 100, height: 100, res: "gradiant.png"} ];//,
	//{x: 200, y: 5, width: 200, height: 200, res: "gradiant.png"}]
	//this.dynamicObjects.push({x: 5, y: 5, width: 100, height: 100, res: "4096x4096.png"});

};
/* cleanup */
Game.prototype.stop = function() {
	if (this.animator==null) return;
	this.animator.stop();

	this.animator = null;
	this.dynamicObjects = [];

};

/* game logic */
Game.prototype.frame = function(dt) {
	var self = this;

	this.dynamicObjects.forEach(function(e) {
		if (Math.floor(Math.random() * 7) == 5) {
			//self.start();
			//e.x = Math.floor(Math.random() * window.innerWidth);
			//e.y = Math.floor(Math.random() * window.innerHeight);
		}
	});

	if (this._tmpInit === undefined)
		if (dt  - this.startTime > 5000) {
			// load a new asset into the game if it doesn't already exist in the resource manager
			var load = new Loader([ "/bin/client/data/gradiant.png" ], (done, asset, key) => {
				self.resource.add(key, asset);
			});
			this._tmpInit = 1;
			console.log("asdasd");
		}
};

/* animator will try to execute render as fast as possible
	in most web browsers it will be limited at 60fps */
Game.prototype.render = function(dt) {
	var self = this;
	craw.set(this.context.canvas.id);
	craw.clear();

	this.dynamicObjects.forEach(function(e) {
		var img = self.resource.get(e.res);
		if (img == null) img = self.resource.get("default_img");
		//console.log(img);
		
		craw.img(img, {  x: e.x,  y: e.y,  w: img.width,  h: img.height, 
						sx: 0, sy: 0, sw: img.width, sh: img.height });//, sw: e.width, sh: e.height});
		//craw.rect({		 x: e.x,  y: e.y,  w: img.width,  h: img.height });
		//craw.img(img, {x: e.x, y: e.y, w: e.width * 2, h: e.height * 2, sw: e.width, sh: e.height});
	});

};

/* functions exactly as render, except animator calls this 
	before stepping frames */
Game.prototype.flush = function() {
	
};
/* a callback called when context has been resized 
	doesn't really need to be here, but whatever */
Game.prototype.resize = function(context) {
	context.resize(window.innerWidth, window.innerHeight);
};

/*if (typeof app !=="undefined") {
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