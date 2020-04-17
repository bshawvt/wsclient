function SceneObject(scene) {
	
	this.parent = undefined;
	
	this.id = 0; // world id, set when added to the simulation
	this.angles = [0.0, 0.0, 0.0]; // yaw pitch roll
	this.moveDirection = [0.0, 0.0, 0.0];
	this.speed = [0.0, 0.0, 0.0];
	this.inputState = new Bitfield();
	this.prevInputState = new Bitfield();
	this.removed = false; 
	this.type = 0;//NetObject.Types.Default; // object type
	this.isPlayer = false; // set by createGameObjectFromMessage to designate object as belonging to the local user
	this.drawable = false; // true if object can be drawn



	// threejs
	this.geometry = new THREE.BoxGeometry(1, 1, 1);
	this.material = new THREE.MeshBasicMaterial({color: 0xff0000});
	this.object = new THREE.Mesh(this.geometry, this.material);
	//scene.add(new SceneObject());
}
SceneObject.prototype.parent = undefined;
SceneObject.prototype.id = 0; // world id, set when added to the simulation
SceneObject.prototype.angles = [0.0, 0.0, 0.0]; // yaw pitch roll
SceneObject.prototype.moveDirection = [0.0, 0.0, 0.0];
SceneObject.prototype.speed = [0.0, 0.0, 0.0];
SceneObject.prototype.inputState = null;//new Bitfield();
SceneObject.prototype.prevInputState = null;//new Bitfield();
SceneObject.prototype.removed = false; 
SceneObject.prototype.type = 0;//NetObject.Types.Default; // object type
SceneObject.prototype.isPlayer = false; // set by createGameObjectFromMessage to designate object as belonging to the local user
SceneObject.prototype.drawable = false; // true if object can be drawn

// threejs
SceneObject.prototype.geometry = null;// new THREE.BoxGeometry(1, 1, 1);
SceneObject.prototype.material = null;// new THREE.MeshBasicMaterial({color: 0xff0000});
SceneObject.prototype.object = null;// new THREE.Mesh(this.geometry, this.material);

SceneObject.prototype.yaw = 0.0;
SceneObject.prototype.pitch = 0.0;
SceneObject.prototype.roll = 0.0;
SceneObject.prototype.yawAccumulator = 0.0;
SceneObject.prototype.pitchAccumulator = 0.0;
SceneObject.prototype.rollAccumulator = 0.0;
SceneObject.prototype.strafe = 0.0;
/*MyNewSceneObject.prototype = Object.create(SceneObject.prototype);
MyNewSceneObject.prototype.constructor = MyNewSceneObject;*/

SceneObject.prototype.setPosition = function(x, y, z) {
	this.object.position.x = x;
	this.object.position.y = y;
	this.object.position.z = z;
};

SceneObject.prototype.setState = function(state) {
	//this.inputState = new Bitmask();
	this.parent = state.parent || null;
	
	if (state.positions !== undefined) {
		this.object.position.x = state.position[0];
		this.object.position.y = state.position[1];
		this.object.position.z = state.position[2];
	}
	
	if (state.speed !== undefined) {
		this.speed[0] = state.speed[0];
		this.speed[1] = state.speed[1];
		this.speed[2] = state.speed[2];
	}

	if (state.davids !== undefined) {
		this.angles[0] = state.davids[0];
		this.angles[1] = state.davids[1];
		this.angles[2] = state.davids[2];
	}

	if (state.id !== undefined) {
		this.id = state.id;
	}
	
	if (state.removed !== undefined) {
		this.removed = state.removed; 	
	}

	if (state.input !== undefined) {
		this.inputState = new Bitfield(state.input);
	}

};
SceneObject.prototype.step = function(dt, controller) {
	if (this.inputState.compare()) {

	}

	if (!this.isPlayer) {
		this.object.position.x +=  ((-1 + Math.random() * 2) + 0.0001) / 2
		this.object.position.y +=  ((-1 + Math.random() * 2) + 0.0001) / 2
	}

};
SceneObject.prototype.draw = function(dt) {
	//this.object.rotation.x += 0.01;
	//this.object.rotation.y += 0.01;
};
SceneObject.prototype.setYaw = function(v) {
	this.yawAccumulator = v;
};
SceneObject.prototype.setPitch = function(v) {
	this.pitchAccumulator = v;
};
SceneObject.prototype.setRoll = function(v) {
	this.rollAccumulator = v;
};


// copy of Types from NetObject.java
SceneObject.Types = {};
SceneObject.Types.NetObject = 0;
SceneObject.Types.Player = 1;
SceneObject.Types.SentientCube = 2;