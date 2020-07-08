/* params: opt - width/height = the initial canvas width/height 
	parent = the app content element
	resources = should be an array from Loader.js or similar for adding preloaded assets
		to ResourceManager */
function Game(opt) {
	var self = this;
	var opt = opt || {};
	// opt.resources for preloaded assets
	
	

	this.TimeStep = opt.timeStep || 1000/30; // used by animator, here for convenience
	this.animator = null; // not instanced here because looping begins immediately

	this.dt = 0;

	// scene objects that don't change position, rotation or scale
	this.staticSceneObjects = [];
	this.staticSceneObjectsQueue = [];
	// dynamic scene objects
	this.sceneObjects = [];
	this.sceneObjectsQueue = [];

	this.resource = new ResourceManager(opt.resources);
	var context = { parent: opt.parent, 
		// callback is optional
		width: 1000,//window.innerWidth,
		height: 1000,//window.innerHeight,
		//onresize: this.onResize
		onresize: function(ctx) {
			if (self.animator !== null) { // animator is null until the game starts
				
			}
			ctx.resize(window.innerWidth, window.innerHeight);
		}
	};
	this.context = new Context(context);

	this.startTime = 0xffffffffffffff; // crazy number because it becomes dt after animator starts
	this.tree = null;

}

/* begins main loop because of animator
	should be used to initialize things 

	should be called when a user interacts with the context because a lot of
	things can only be */
Game.prototype.start = function() {
	var self = this;

	if (this.animator !== null && !this.animator.done)
		throw "error: animator is already active";

	this.sceneObjects = [];
	this.sceneObjectsQueue = [];


	//this.camera = new SceneCamera({game: this});//
	//this.sceneObjectsQueue.push(this.camera);

	//var cube = new SceneCube(); 
	//this.sceneObjectsQueue.push(cube);

	// i don't know if it matters but it's probably better to start animator after the other things
	this.animator = new Animator(this);
	this.startTime = this.animator.dt;
	console.log("game started");

	
	/*var s = new ScenePlayer({game: this});
	player = s;
	s.isPlayer = true;
	this.camera.attach(s);
	this.add(s);*/
	craw.set(this.context.canvas);
	for(var i = 0; i < 5000; i++) {
		var obj = {
			neighbors: [],
			vdir: 1,
			hdir: 1,
			speed: 0.1,
			rgb: "rgb(" + Math.floor(Math.random() * 255) + ", " + Math.floor(Math.random() * 255) + ", " + Math.floor(Math.random() * 255) + ")",
			id: i,
			bb: new BoundingBox(10 + Math.random() * 500, 10 + Math.random() * 500, 0, 5, 5, 0),
			step: function(game, unused) {
				var set = this.neighbors;//game.tree.get(this.neighbors);
				var nself = this;
				set.forEach(function(e) {
					if (nself.id !== e.id && nself.bb.intersect2d(e.bb)) {
						var m = Math.floor(Math.random() * 5);
						if (m == 0) {
							nself.vdir = -nself.vdir || 1;
						}
						else if (m==1) {
							nself.hdir = -nself.hdir || 1;
						}
						else if (m==2) {
							nself.hdir = 0;
						}
						else if (m==3) {
							nself.vdir = 0;
						}
						else {
							nself.hdir = -nself.hdir;
							nself.vdir = -nself.vdir;
							nself.speed = Math.random() * 1;
						}
					}
				});

				if (this.bb.x <= 0 || this.bb.x >= game.context.canvas.width) {
					this.hdir = -this.hdir;
				}
				if (this.bb.y <= 0 || this.bb.y >= game.context.canvas.height) {
					this.vdir = -this.vdir;
				}
				
				this.bb.x += this.speed * this.hdir;
				this.bb.y += this.speed * this.vdir;
			},
			draw: function(dt) {
				craw.rect({x: this.bb.x, y: this.bb.y, w: this.bb.xscale, h: this.bb.yscale, c: this.rgb, f: true});
				//console.log(this.bb.x);
			}
		};
		this.add(obj);
	}


};


/* cleanup */
Game.prototype.stop = function() {
	if (this.animator==null) return;
	this.animator.stop();
	this.animator = null;

	this.sceneObjects = [];
	this.sceneObjectsQueue = [];

	console.log("game stopped");
};

/* game logic */
Game.prototype.frame = function(dt) {
	var self = this;
	this.dt = dt;
	this.tree = new GridPartition(2000, this.sceneObjects, 10);
	for(var i = 0; i < this.sceneObjects.length; i++) {
		var item = this.sceneObjects[i];
		if (item.removed) {
			console.log("deleted thing");
			this.scene.remove(item.object);
			this.sceneObjects[i] = this.sceneObjects[this.sceneObjects.length - 1];
			this.sceneObjects.pop();
		}
		item.step(this, this.controller);
	}

};

/* animator will try to execute render as fast as possible
	in most web browsers it will be limited at 60fps */
Game.prototype.render = function(dt) {
	var self = this;

	craw.clear();

	for(var i = 0; i < this.sceneObjects.length; i++) {
		var item = this.sceneObjects[i];
		item.draw(dt);
	}
};

/* functions exactly as render, except animator calls this 
	before stepping frames */
Game.prototype.flush = function() {
	for(var i1 = 0; i1 < this.sceneObjectsQueue.length; i1++) {
		var item = this.sceneObjectsQueue[i1];
		this.sceneObjects.push(item);
		//this.scene.add(item.object);
	}
	/*for(var i2 = 0; i2 < this.staticSceneObjectsQueue.length; i2++) {
		var item = this.staticSceneObjectsQueue[i2];
		this.staticSceneObjects.push(item);
		this.scene.add(item.object);
	}*/
	this.sceneObjectsQueue = [];

};

/* helper to adds objects to the scene */
Game.prototype.add = function(object, static) {
	//console.log("game.add...");
	//console.log(this);
	if (static == true) {
		this.staticSceneObjects.push(object);
	}
	this.sceneObjectsQueue.push(object);
};

