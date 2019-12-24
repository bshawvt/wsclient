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
	this.dynamicObjectsQueue = [];
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

	InputController.MAP_LEFT = {key: 65, map: "A", bitmask: 1};
	InputController.MAP_RIGHT = {key: 68, map: "D", bitmask: 2};
	InputController.MAP_FORWARD = {key: 87, map: "W", bitmask: 4};
	InputController.MAP_BACKWARD = {key: 83, map: "S", bitmask: 8};

	var keyMaps = [{ initial: {bottom: true, center: true}, map: InputController.MAP_FIRE = {key: 32, map: "SPACE", bitbask: 16} }];
	var touchMaps = [{ initial: {bottom: true, center: false}, type: 1, vm: true }, { initial: {bottom: true, right: true}, maps: []}];
	this.controller = new InputController({keys: keyMaps, sticks: touchMaps});
	//this.controller.showController({keys: keyMaps, sticks: touchMaps});

	this.dynamicObjects = [ {x: 5, y: 5, width: 50, height: 50, res: {sprite: "spritesheet_1024x1024.png", offx: 256, offy: 0, size: 128}, dir: [0, 0, 0], spd: [1.0, 1.0, 0]},
	/*{x: 200, y: 5, width: 200, height: 200, res: "gradiant.png", dir: [0, 0, 0], spd: [0.0, 0.0, 0]}*/];
	this.dynamicObjectsQueue = [];	
	// i don't know if it matters but it's probably better to start animator after the other things
	this.animator = new Animator(this);
	this.startTime = this.animator.dt;
	console.log("started");

	// per app specific
	this.attackedTime = 0;


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
		if (e.expires)
			if (dt > e.expires) {
				if (dt > e.expires + 1000) {
					e.removed = true;
				}
				e.res.offx = 384;
				e.spd[0] = 0.0;
				e.spd[1] = 0.0;
			}
		e.x += e.dir[0] * e.spd[0];
		e.y += e.dir[1] * e.spd[1];
	});

	/*if (In.getButtonState(InputController.TEST_MOBILE.key)) {
		this.dynamicObjects[0].x = 0.0;
		this.dynamicObjects[0].y = 0.0;
	}*/

	//console.log(In.getCursorPosition());
	if (In.getButtonState(InputController.MAP_FIRE.key) && dt > this.attackedTime + 200) {
		this.attackedTime = dt;
		var p = this.dynamicObjects[0];
		d1 = p.dir[0] != 0.0 ? p.dir[0] : -1 + Math.random() * 2;
		d2 = p.dir[1] != 0.0 ? p.dir[1] : -1 + Math.random() * 2;
		var dabomb = {expires: dt + 2000, x: p.x, y: p.y, width: 50, height: 50, res: {sprite: "spritesheet_1024x1024.png", offx: 512, offy: 0, size: 128}, dir: [d1, d2, 0], spd: [4.0, 4.0, 0]}
		this.dynamicObjectsQueue.push(dabomb);

		var snd = this.resource.get("Cat_mewing.mp3")
		if (snd) {
			snd.data.play();
		}
		//In.consumeButtonState(InputController.MAP_FIRE.key);
	}
		/*this.dynamicObjects[0].spd[0] += 0.05;
		this.dynamicObjects[0].spd[1] += 0.05;
		this.dynamicObjects[0].spd[0] = Clamp(this.dynamicObjects[0].spd[0], 0, 2);
		this.dynamicObjects[0].spd[1] = Clamp(this.dynamicObjects[0].spd[1], 0, 2);
		console.log(this.dynamicObjects[0].spd[0], this.dynamicObjects[0].spd[1]);
		//if (this.dynamicObjects[0].spd[0] >= 0.0) this.dynamicObjects[0].spd[0] = 10.0;
		//if (this.dynamicObjects[0].spd[1] >= 0.0) this.dynamicObjects[0].spd[1] = 10.0;
	}
	else {
		this.dynamicObjects[0].spd[0] -= 0.15;
		this.dynamicObjects[0].spd[1] -= 0.15;
		this.dynamicObjects[0].spd[0] = Clamp(this.dynamicObjects[0].spd[0], 0, 2);
		this.dynamicObjects[0].spd[1] = Clamp(this.dynamicObjects[0].spd[1], 0, 2);
		//if (this.dynamicObjects[0].spd[0] <= 0.0) this.dynamicObjects[0].spd[0] = 0.0;
		//if (this.dynamicObjects[0].spd[1] <= 0.0) this.dynamicObjects[0].spd[1] = 0.0;
	}*/
	var pos = In.getCursorPosition();
	//console.log(pos);
	var pos2 = Math.atan2(-pos.y, pos.x);
	//console.log(pos2);
	this.dynamicObjects[0].x = pos.x;//Clamp(In.virtualMouseVec[0], -1.0, 1.0);//Clamp(pos.x, -1.0, 1.0);//pos.x;//Clamp(In.virtualMouseVec[0], -1.0, 1.0);//pos.x;
	this.dynamicObjects[0].y = pos.y;//Clamp(In.virtualMouseVec[1], -1.0, 1.0);//Clamp(pos.y, -1.0, 1.0);//Clamp(In.virtualMouseVec[1], -1.0, 1.0);//pos.y;
	//console.log(pos);



	//this.dynamicObjects[0].x += this.dynamicObjects[0].dir[0] * this.dynamicObjects[0].spd[0];
	//this.dynamicObjects[0].y += this.dynamicObjects[0].dir[1] * this.dynamicObjects[0].spd[1];

		//this.dynamicObjects[0].y = In.getCursorPosition().y;
	

	if (this._tmpInit === undefined)
		if (dt  - this.startTime > 1000) {
			// load a new asset into the game if it doesn't already exist in the resource manager
			//var load = new Loader([ "/bin/client/data/4096x4096.png" ], function(done, asset, key) {
			var load = new Loader([ "/bin/client/data/Cat_mewing.mp3" ], (done, asset, key) => {
				var res = { type: ResourceManager.GetResourceType(key), data: asset, isLoaded: true };
				self.resource.add(key, res);

				console.log("dynamic load test has finished loading %s", key);
				console.log(this, res, key);

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

/* animator will try to execute render as fast as possible
	in most web browsers it will be limited at 60fps */
Game.prototype.render = function(dt) {
	var self = this;
	craw.set(this.context.canvas.id);
	craw.clear();
	//rend(dt, this.dynamicObjects, this.resource);
	var res = this.resource;
	this.dynamicObjects.forEach(function(e) {
		var img = res.get(e.res.sprite);
		//console.log(img);
		if (img == null) img = res.get("default_img");
		//console.log(e.res, img);
		
		craw.img(img.data, {  x: Math.floor(e.x),  y: Math.floor(e.y),  w: e.width,  h: e.height, 
						sx: e.res.offx, sy: e.res.offy, sw: e.res.size, sh: e.res.size });// sw: img.data.width, sh: img.data.height });
	});
};

/* functions exactly as render, except animator calls this 
	before stepping frames */
Game.prototype.flush = function() {
	for(var i1 = 0; i1 < this.dynamicObjectsQueue.length; i1++) {
		var item = this.dynamicObjectsQueue[i1];
		this.dynamicObjects.push(item);
	}
	this.dynamicObjectsQueue = [];

	for(var i2 = 0; i2 < this.dynamicObjects.length; i2++) {
		var item = this.dynamicObjects[i2];
		if (item.removed) {
			this.dynamicObjects[i2] = this.dynamicObjects[this.dynamicObjects.length - 1];
			//this.dynamicObjects[i2] = undefined;
			this.dynamicObjects.pop();
		}
	}
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