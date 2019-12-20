/* params: opt - width/height = the initial canvas width/height 
	parent = the app content element
	resources = should be an array from Loader.js or similar for adding preloaded assets
		to ResourceManager */
function Game(opt) {
	var opt = opt || {};
	// opt.resources for preloaded assets
	this.resource = new ResourceManager(opt.resources);

	var context = { parent: opt.parent, 
		// callback is optional
		width: opt.width || window.innerWidth,
		height: opt.height || window.innerHeight,
		onresize: function(ctx) {
			/*var rect = context.canvas.getClientRects()[0]; // keeps resize proportional
			context.resize(window.innerWidth - (rect.x * 2), window.innerHeight - (rect.y * 2));*/
			ctx.resize(window.innerWidth, window.innerHeight);
		}
	};
	this.context = new Context(context);

	this.TimeStep = opt.timeStep || 1000/30; // used by animator, here for convenience
	this.network = null;
	this.animator = null; // not instanced here because looping begins immediately
	this.soundManager = null; // not instanced here because most browsers and mobile flip out 
	this.controller = null;

	this.dynamicObjects = [];
	this.startTime = 0xffffffffffffff; // crazy number because it becomes dt after animator starts
}

/* begins main loop because of animator
	should be used to initialize things 

	should be called when a user interacts with the context because a lot of
	things can only be */
Game.prototype.start = function() {
	var self = this;

	if (this.animator !== null && !this.animator.done)
		throw "error: animator is already active";
	this.soundsManager = new SoundManager();
	this.controller = new InputController();

	this.dynamicObjects = [ {x: 5, y: 5, width: 100, height: 100, res: "gradiant.png", dir: [1, 1, 0], spd: [2.0, 2.0, 0]},
	{x: 200, y: 5, width: 200, height: 200, res: "gradiant.png", dir: [1, 1, 0], spd: [1.0, 1.0, 0]}];
	
	// i don't know if it matters but it's probably better to start animator after the other things
	this.animator = new Animator(this);
	this.startTime = this.animator.dt;
	console.log("started");

};

/* cleanup */
Game.prototype.stop = function() {
	if (this.animator==null) return;
	this.animator.stop();

	this.animator = null;
	this.dynamicObjects = [];
	console.log("stopped");
};

/* game logic */
Game.prototype.frame = function(dt) {
	var self = this;
	var In = this.controller; 

	this.dynamicObjects.forEach(function(e) {
		if (e.res === "gradiant.png" || Math.floor(Math.random() * 5) == 1) {
			e.x += e.dir[0];
			e.y += e.dir[1];
		}
	});

	if (In.getButtonState(InputController.TEST_MOBILE.key)) {
		this.dynamicObjects[0].x = 0.0;
		this.dynamicObjects[0].y = 0.0;

	}

	if (this._tmpInit === undefined)
		if (dt  - this.startTime > 1000) {
			// load a new asset into the game if it doesn't already exist in the resource manager
			var load = new Loader([ "/bin/client/data/4096x4096.png" ], function(done, asset, key) {
			//var load = new Loader([ "/bin/client/data/song1.mp3" ], (done, asset, key) => {
				var res = { type: ResourceManager.GetResourceType(key), data: asset, isLoaded: true };
				self.resource.add(key, res);

				console.log("dynamic load test has finished loading %s", key);

				var snd = new AudioContext();
				//asset.play();
				//asset.data.play();

				resource = asset;
				audiocontext = snd;

			});
			this._tmpInit = 1;
			console.log("dynamic load test has started...");
		}
};

// todo: remove
var audiocontext = 0;
var resource = 0;
function rend(dt, objs, res) {
	var res = res; //= this.resource;
	//this.dynamicObjects.forEach(function(e) {
	objs.forEach(function(e) {
		var img = res.get(e.res);
		//console.log(img);
		if (img == null) img = res.get("default_img");
		//console.log(e.res, img);
		
		craw.img(img.data, {  x: e.x,  y: e.y,  w: e.width,  h: e.height, 
						sx: 0, sy: 0, sw: img.data.width, sh: img.data.height });
	});
}
// todo: ^ remove

/* animator will try to execute render as fast as possible
	in most web browsers it will be limited at 60fps */
Game.prototype.render = function(dt) {
	var self = this;
	craw.set(this.context.canvas.id);
	craw.clear();
	rend(dt, this.dynamicObjects, this.resource);
};

/* functions exactly as render, except animator calls this 
	before stepping frames */
Game.prototype.flush = function() {
	
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