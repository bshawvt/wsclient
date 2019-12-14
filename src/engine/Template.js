/* params: opt - width/height = the initial canvas width/height 
	parent = the app content element
	timeStep = kind of pointless,
	resources = should be an array array from Loader.js or similar for adding preloaded assets
		to ResourceManager */
function Game(opt) {
	var opt = opt || {};
	this.TimeStep = opt.timeStep || 1000/30; // used by animator, here for convenience
	this.network = null; 
	this.animator = null; // not instanced here because looping begins immediately

	var context = { parent: opt.parent, 
		// callback is optional
		width: opt.width || window.innerWidth,
		height: opt.height || window.innerHeight,
		callback: function(context) {
			/*var rect = context.canvas.getClientRects()[0];
			context.resize(window.innerWidth - (rect.x * 2), window.innerHeight - (rect.y * 2));*/
			context.resize(window.innerWidth, window.innerHeight);
		}
	};
	this.context = new Context(context);

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
	
	this.dynamicObjects = [ {x: 5, y: 5, width: 100, height: 100, res: "gradiant.png", dir: [1, 1, 0], spd: [2.0, 2.0, 0]},
	{x: 200, y: 5, width: 200, height: 200, res: "1024x1024.png", dir: [1, 1, 0], spd: [1.0, 1.0, 0]}]
	//this.dynamicObjects.push({x: 5, y: 5, width: 100, height: 100, res: "4096x4096.png"});
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

	//var snd = this.resource.get("496757__erokia__ambient-wave-48-tribute.wav");
	//if (snd ==)

	this.dynamicObjects.forEach(function(e) {
		if (e.res === "gradiant.png" || Math.floor(Math.random() * 5) == 1) {
			//self.start();
			//var x = Math.floor(Math.random() * 5) <= 2 ? e.dir[0] = ~e.dir[0] : e.dir[0];
			//var y = Math.floor(Math.random() * 5) <= 2 ? e.dir[1] = ~e.dir[1] : e.dir[1];
			e.x += e.dir[0];
			e.y += e.dir[1];
		}
	});

	if (this._tmpInit === undefined)
		if (dt  - this.startTime > 1000) {
			// load a new asset into the game if it doesn't already exist in the resource manager
			var load = new Loader([ "/bin/client/data/496757__erokia__ambient-wave-48-tribute.wav" ], (done, asset, key) => {
				self.resource.add(key, asset);
			
				console.log(asset);
				console.log("dynamic load test has finished loading %s", key);

				var snd = new AudioContext();
				var src = snd.createBufferSource();
				var buffer = snd.decodeAudioData(asset.data, function(buf) {
					buffer = buf;
				}, function(e){
					console.log(e);
				});
				src.buffer = buffer;
				src.connect(snd.destination);
				src.start(0);


			});
			this._tmpInit = 1;
			console.log("dynamic load test has started...");
		}
};

function rend(dt, objs, res) {
	var res = res; //= this.resource;
	objs.forEach(function(e) {
		var img = res.get(e.res);
		if (img == null) img = res.get("default_img");
		//console.log(img);
		
		craw.img(img, {  x: e.x,  y: e.y,  w: e.width,  h: e.height, 
						sx: 0, sy: 0, sw: img.width, sh: img.height });//, sw: e.width, sh: e.height});
		//craw.rect({		 x: e.x,  y: e.y,  w: img.width,  h: img.height });
		//craw.img(img, {x: e.x, y: e.y, w: e.width * 2, h: e.height * 2, sw: e.width, sh: e.height});
	});
}

/* animator will try to execute render as fast as possible
	in most web browsers it will be limited at 60fps */
Game.prototype.render = function(dt) {
	var self = this;
	craw.set(this.context.canvas.id);
	craw.clear();
	rend(dt, this.dynamicObjects, this.resource);
	/*this.dynamicObjects.forEach(function(e) {
		var img = self.resource.get(e.res);
		if (img == null) img = self.resource.get("default_img");
		//console.log(img);
		
		craw.img(img, {  x: e.x,  y: e.y,  w: img.width/2,  h: img.height/2, 
						sx: 0, sy: 0, sw: img.width/16, sh: img.height/16 });//, sw: e.width, sh: e.height});
		//craw.rect({		 x: e.x,  y: e.y,  w: img.width,  h: img.height });
		//craw.img(img, {x: e.x, y: e.y, w: e.width * 2, h: e.height * 2, sw: e.width, sh: e.height});
	});*/
};

/* functions exactly as render, except animator calls this 
	before stepping frames */
Game.prototype.flush = function() {
	
};
/* a callback called when context has been resized 
	doesn't really need to be here, but whatever */
/*Game.prototype.resize = function(context) {
	*//*var rect = context.canvas.getClientRects()[0];
	context.resize(window.innerWidth - (rect.x * 2), window.innerHeight - (rect.y * 2));*/
	/*context.resize(window.innerWidth, window.innerHeight);
};*/

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