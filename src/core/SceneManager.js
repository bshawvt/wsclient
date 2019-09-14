/* scenemanager.js automagically manages all scene objects
*/
function SceneManager(invoker) {
	this.scene = new THREE.Scene();
	this.objects = []; // the scene objects list
	this.queue = [];
	this.idCounter = 0; // used by SceneManager.add() to give each object a unique identifier
	this.activeCamera = new SceneCamera();
}
SceneManager.prototype.step = function(state) {
	/* update all objects with the current state
	*/
	this.flush(); 
	for(var i = 0; i < this.objects.length; ++i) {
		try {
			var item = this.objects[i];
			if (item.delete !== undefined) {
				if (item.delete == true) {
					this.remove(item);
					continue;
				}
			}
			item.update(state);
		}
		catch (error) {
			console.error("Warning: SceneManager.step has failed for an object", this.objects[i], error);
		}
	}
};
SceneManager.prototype.render = function(state) {
	/* todo: having a render method for each object might not be a good idea
	when threejs has it's own way of rendering geometry
	*/
	for(var i = 0; i < this.objects.length; ++i) {
		try {
			var item = this.objects[i];
			item.render(state);
		}
		catch (error) {
			console.error(error);
		}
	}
};
SceneManager.prototype.add = function(object) {
	if (object.getObject() === null) {
		console.error("Warning: SceneManager.add tried to add an object with no object3d", object);
		return;
	}
	object._smid = this.idCounter++;
	this.queue.push({object: object, remove: false});
};
SceneManager.prototype.remove = function(object) {
	/* SceneManager.step() will call this method whenever a scene object has the property 'delete: true' prior to updating it
	*/
	this.queue.push({object: object, remove: true});

};
SceneManager.prototype.flush = function() {
	/* used before each SceneManager.step() to add or remove scene objects 
	*/
	for(var i = 0; i < this.queue.length; ++i) {
		var item = this.queue[i];
		if (item.remove == true) {
			this._remove(item.object._smid);
		}
		else {
			this.objects.push(item.object);
			this.scene.add(item.object.getObject());
			//console.log("added item: ", item.object);
		}
	}
	this.queue = [];
};
SceneManager.prototype._remove = function(smid) {
	/* search for an object by _smid value and remove it from the scene objects list
	this should only be called by SceneManager.flush();
	*/
	for(var i = 0; i < this.objects.length; ++i) {
		if (this.objects[i]._smid == smid) {
			//console.log("removed item: ", this.objects[i]);
			this.scene.remove(this.objects[i].getObject());
			this.objects[i] = this.objects[this.objects.length - 1];
			this.objects.pop();
			break;
		}
	}
};