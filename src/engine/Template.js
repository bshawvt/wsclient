/* expects opt to have property with canvas id
	a canvas element must exist before the game object can be created */
function Game(opt) {
	var opt = opt || {};
	this.TimeStep = opt.timeStep || 1000/30; // used by animator, here for convenience
	this.network = null; 
	this.animator = null; // not instanced here because looping begins immediately
	this.context = new Context({ callback: this.resize });

	// opt.resources for preloaded assets
	this.resource = new ResourceManager(opt.resources)//opt.resources || new Array();// { images: [], sounds: [], models: [] };
	//console.log(this.resource, this.resource.images, this.resource.images["floors.png"]);
	this.tiles = [{x: 5, y: 5, width: 100, height: 100, res: "gradiant.png"}];
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

	this.tiles.forEach(function(e) {
		e.x = Math.floor(Math.random() * 200);
		e.y = Math.floor(Math.random() * 200);
	});

	if (Math.floor(Math.random() * 25) == 2)
	if (this.resource.get('gradiant.png') == null) {
		var load = new Loader([ "/bin/client/data/gradiant.png" ], (done, asset, key) => {
			//if (done) {
			console.log("???", key);
			//}
			self.resource.add(key, asset);
			//this.resource[key] = asset;
			//console.log(this.resource);
		});

	} 
	// dynamic resource load test
	/*if (Math.floor(Math.random() * 100) == 1) {
		//console.log(this.resource.images["gradiant.png"]);
		if (this.resource["gradiant.png"] === undefined) {
			var load = new Loader([ "/bin/client/data/gradiant.png", "/bin/client/data/floors.png" ], (done, asset, key) => {
				//if (done) {
					console.log(key);
				//}
				//this.resource[key] = asset;
				//console.log(this.resource);
			});*/
			/*function(done, asset) {
				//console.log(load.resource.images);
				if (done) {
					console.log(self.resource, load.resource);
					var t = load.resource.concat(self.resource);
					console.log(t);
					//self.resource = self.resource.concat(load.resource);
					//console.log(self.resource);
				}
			});*/

		/*}
	}*/
};

/* animator will try to execute render as fast as possible
	in most web browsers it will be limited at 60fps
	can also be used */
Game.prototype.render = function(dt) {
	var self = this;
	craw.set(this.context.canvas.id);
	craw.clear();

	this.tiles.forEach(function(e) {
		var img = self.resource.get(e.res);
		if (img == null) img = self.resource.get("default");
		craw.img(img, {x: e.x, y: e.x, w: e.width, h: e.height, sw: e.width, sh: e.height});
	});
	/*var img = this.resource.get("gradiant.png");//this.resource["gradiant.png"];
	if (img)
	craw.img(img, {x: 0, y: 0, w: 200, h: 200, sw: 200, sh: 200});*/

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