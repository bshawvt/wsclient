function WorldLoader(game) {
	//console.log(data);
	//console.log(JSON.stringify(data));
	
	//console.log(objects);
	this.game = game;

	// free camera stuff for new camera..
	if (this.game.camera != null) {
		this.game.camera.removed = true;
		this.game.camera = null;
	}

	// remove all previous scene objects
	for (var i = 0; i < this.game.sceneObjects.length; i++) {
		this.game.sceneObjects[i].removed = true;
	}

	// remove all previous static scene object references
	this.game.staticSceneObjects = [];
}

WorldLoader.prototype.load = function(data) {
	console.log(this.game);
	try {
		var objects = JSON.parse(data);
		var fn = window[objects.camera.class];
		var cargs = objects.camera.args
		cargs.game = this.game;


		this.game.camera = new fn(cargs);
		this.game.add(this.game.camera);
	}
	catch (e) {
		console.error(e);
	}

	for(var i1 = 0; i1 < objects.static.length; i1++) {
		try {
			var obj = objects.static[i1];
			var fn = window[obj.class];
			obj.args.game = this.game;
			var item = new fn(obj.args);
			this.game.add(item, true);
		}
		catch (e) {
			console.error(e);
		}
	}

	for(var i2 = 0; i2 < objects.dynamic.length; i2++) {
		try {
			var obj = objects.dynamic[i2];
			var fn = window[obj.class];
			obj.args.game = this.game;
			var item = new fn(obj.args);
			this.game.add(item);
		}
		catch (e) {
			console.error(e);
		}
	}
};