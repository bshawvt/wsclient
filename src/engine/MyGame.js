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
	this.soundManager = null; // not instanced here because most browsers and mobile flip out 
	this.network = new Network(this); // the login token needs to be used immediately
	this.controller = null;

	this.scene = null;
	this.renderer = null;
	this.camera = null;

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
		width: window.innerWidth,
		height: window.innerHeight,
		//onresize: this.onResize
		onresize: function(ctx) {
			if (self.animator !== null) { // animator is null until the game starts
				self.camera.resize(window.innerWidth, window.innerHeight);
				self.renderer.setSize(window.innerWidth, window.innerHeight);
			}
			ctx.resize(window.innerWidth, window.innerHeight);
		}
	};
	this.context = new Context(context);

	this.startTime = 0xffffffffffffff; // crazy number because it becomes dt after animator starts

	var worldloader = new WorldLoader(this);
	this.worldloader = worldloader;
	new Loader(["/bin/client/data/map.dat"], function(done, data, resourceName) {
		//var worldFile = JSON.parse(Bytes2Ascii(new Int8Array(data.data)).join(""));
		worldloader.load(Bytes2Ascii(new Int8Array(data.data)).join(""));
	});
	
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

	/*InputController.MAP_LEFT = {key: 65, map: "A", bitmask: 1}
	InputController.MAP_RIGHT = {key: 68, map: "D", bitmask: 2}
	InputController.MAP_FORWARD = {key: 87, map: "W", bitmask: 4}
	InputController.MAP_BACKWARD = {key: 83, map: "S", bitmask: 8}*/

	var keyMaps = [	{ position: {center: true, bottom: true, yoff: 5, xoff: -30}, map: 
						InputController.MAP_FIRE = {id: "M1", key: 0, map: "MOUSE1", bit: 16} },
					{ position: {center: true, bottom: true, yoff: 5, xoff: -30}, map: 
						InputController.MAP_ALTFIRE = {id: "M2", key: 2, map: "MOUSE2", bit: 32} },
					{ position: {center: true, left: true, bottom: true, yoff: 60, xoff: -30}, map: 
						InputController.MAP_JUMP = {id: "SPACE", key: 32, map: "SPACE", bit: 64}	},
					{ position: {center: true, bottom: true, yoff: 5, xoff: 30}, map: 
						InputController.MAP_ACTION = {id: "F", key: 70, map: "F", bit: 128}	}];
	var touchMaps = [	{ initial: {bottom: true, right: true}, type: 2},//maps: []}, 
						{ initial: {bottom: true, right: false}, type: 1, maps: {
								left: InputController.MAP_LEFT = {key: 65, map: "A", bit: 1}, 
								right: InputController.MAP_RIGHT = {key: 68, map: "D", bit: 2}, 
								top: InputController.MAP_FORWARD = {key: 87, map: "W", bit: 4}, 
								bottom: InputController.MAP_BACKWARD = {key: 83, map: "S", bit: 8}}}];

	// todo: mouse wheel needs mobile controller element
	var mouseWheel = { initial: {bottom: true, center: true}};
	this.controller = new InputController({keys: keyMaps, sticks: touchMaps, sliders: [mouseWheel]});

	this.sceneObjects = [];
	this.sceneObjectsQueue = [];

	

	this.network.start();

	//this.camera = new SceneCamera({game: this});//
	//this.sceneObjectsQueue.push(this.camera);

	// threejs setup
	this.scene = new THREE.Scene();
	this.renderer = new THREE.WebGLRenderer({canvas: this.context.canvas});
	this.renderer.setSize(window.innerWidth, window.innerHeight);
	this.renderer.setClearColor(0xc8c8ff);

	//var cube = new SceneCube(); 
	//this.sceneObjectsQueue.push(cube);

	// i don't know if it matters but it's probably better to start animator after the other things
	this.animator = new Animator(this);
	this.startTime = this.animator.dt;
	console.log("game started");
	

	// per app specific stuff 
	this.worldloader.reload();
	
	/*var s = new ScenePlayer({game: this});
	player = s;
	s.isPlayer = true;
	this.camera.attach(s);
	this.add(s);*/


};


/* cleanup */
Game.prototype.stop = function() {
	if (this.animator==null) return;
	this.animator.stop();
	this.animator = null;
	
	this.network.close();
	this.network = null;

	this.sceneObjects = [];
	this.sceneObjectsQueue = [];

	console.log("game stopped");
};

/* game logic */
Game.prototype.frame = function(dt) {
	var self = this;
	this.dt = dt;
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

	this.network.sendFrame();
	//this.controller.reset();

};

/* animator will try to execute render as fast as possible
	in most web browsers it will be limited at 60fps */
Game.prototype.render = function(dt) {
	var self = this;
	if (this.camera == null) return;
	this.camera.setLocalState(this, this.controller);

	for(var i = 0; i < this.sceneObjects.length; i++) {
		var item = this.sceneObjects[i];
		item.draw(dt);
	}

	this.renderer.render(this.scene, this.camera.object);
	this.controller.reset();
};

/* functions exactly as render, except animator calls this 
	before stepping frames */
Game.prototype.flush = function() {
	for(var i1 = 0; i1 < this.sceneObjectsQueue.length; i1++) {
		var item = this.sceneObjectsQueue[i1];
		this.sceneObjects.push(item);
		this.scene.add(item.object);
	}
	/*for(var i2 = 0; i2 < this.staticSceneObjectsQueue.length; i2++) {
		var item = this.staticSceneObjectsQueue[i2];
		this.staticSceneObjects.push(item);
		this.scene.add(item.object);
	}*/
	this.sceneObjectsQueue = [];
	//this.staticSceneObjectsQueue = [];
	this.controller.update();

};

/* helper to adds objects to the scene */
Game.prototype.add = function(object, static) {
console.log("game.add...");
	console.log(this);
	if (static == true) {
		this.staticSceneObjects.push(object);
	}
	this.sceneObjectsQueue.push(object);
};

/* takes a network message blob and creates a new scene object
for the game before returning a scene object */
Game.prototype.createGameObjectFromMessage = function(message) {
	var type = message.objectType;
	var obj = null;
	switch(type) {
		case SceneObject.Types.Player: {
			obj = new ScenePlayer({game: this});
			if (message.me) {
				obj.isPlayer = true;
				this.camera.attach(obj);
			}
			break;
		}
		case SceneObject.Types.Default:
		default: {
			break;
		}
	}
	if (obj == null) return;
	this.sceneObjectsQueue.push(obj);
	return obj;
};