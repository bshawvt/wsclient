function SceneObject(scene) {
	
	this.parent = undefined;
	
	this.id = 0; // world id, set when added to the simulation
	//this.angles = [0.0, 0.0, 0.0]; // yaw pitch roll
	//this.moveDirection = [0.0, 0.0, 0.0];
	this.speed = [0.0, 0.0, 0.0];
	this.inputState = new Bitfield();
	//this.prevInputState = new Bitfield();
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
//SceneObject.prototype.angles = [0.0, 0.0, 0.0]; // yaw pitch roll
SceneObject.prototype.position = [0.0, 0.0, 0.0]; // [x y z] eventually added to threejs object position vector
SceneObject.prototype.speed = [0.0, 0.0, 0.0]; // [forward/backward, strafe, jump/fall] speed of scene object
SceneObject.prototype.inputState = null;//new Bitfield();
//SceneObject.prototype.prevInputState = null;//new Bitfield();
SceneObject.prototype.removed = false; // set to true to remove 
SceneObject.prototype.type = 0;//NetObject.Types.Default; // object type
SceneObject.prototype.isPlayer = false; // set by createGameObjectFromMessage, designates object as belonging to the local user
SceneObject.prototype.drawable = false; // true if object can be drawn
SceneObject.prototype.bb = undefined; // boundingbox object

// threejs
SceneObject.prototype.geometry = null;// new THREE.BoxGeometry(1, 1, 1);
SceneObject.prototype.material = null;// new THREE.MeshBasicMaterial({color: 0xff0000});
SceneObject.prototype.object = null;// new THREE.Mesh(this.geometry, this.material);
SceneObject.prototype.translateGeometry = true; // sets coordinate system maybe

// current angle
SceneObject.prototype.yaw = 0.0;
SceneObject.prototype.pitch = 0.0;
SceneObject.prototype.roll = 0.0;
// new angle
SceneObject.prototype.yawAccumulator = 0.0;
SceneObject.prototype.pitchAccumulator = 0.0;
SceneObject.prototype.rollAccumulator = 0.0;

SceneObject.prototype.strafe = 0.0; // 

/*MyNewSceneObject.prototype = Object.create(SceneObject.prototype);
MyNewSceneObject.prototype.constructor = MyNewSceneObject;*/

SceneObject.prototype.setPosition = function(x, y, z) {
	this.object.position.x = x;
	this.object.position.y = y;
	this.object.position.z = z;
};

// sets the state of a scene object that the local user is in control of
SceneObject.prototype.setLocalState = function(In) {

	// shoot
	if (In.getButtonState(InputController.MAP_FIRE.key)) {
		this.inputState.add(InputController.MAP_FIRE.bit);
		this.inputState.subtract(InputController.MAP_ALTFIRE.bit);
	}
	else if (In.getButtonState(InputController.MAP_ALTFIRE.key)) {
		this.inputState.add(InputController.MAP_ALTFIRE.bit);
		this.inputState.subtract(InputController.MAP_FIRE.bit);
	}
	else {
		this.inputState.subtract(InputController.MAP_FIRE.bit);
		this.inputState.subtract(InputController.MAP_ALTFIRE.bit);
	}

	// jump
	if (In.getButtonState(InputController.MAP_JUMP.key)) {
		this.inputState.add(InputController.MAP_JUMP.bit);
	}
	else {
		this.inputState.subtract(InputController.MAP_JUMP.bit);
	}

	// action
	if (In.getButtonState(InputController.MAP_ACTION.key)) {
		this.inputState.add(InputController.MAP_ACTION.bit);
	}
	else {
		this.inputState.subtract(InputController.MAP_ACTION.bit);
	}

	// movement
	// accelerate
	if (In.getButtonState(InputController.MAP_FORWARD.key)) {
		this.inputState.add(InputController.MAP_FORWARD.bit);
	}
	else {
		this.inputState.subtract(InputController.MAP_FORWARD.bit);
	}
	// decelerate
	if (In.getButtonState(InputController.MAP_BACKWARD.key)) {
		this.inputState.add(InputController.MAP_BACKWARD.bit);
	}
	else {
		this.inputState.subtract(InputController.MAP_BACKWARD.bit);
	}
	// strafe left
	if (In.getButtonState(InputController.MAP_LEFT.key)) {
		this.inputState.add(InputController.MAP_LEFT.bit);
	}
	else {
		this.inputState.subtract(InputController.MAP_LEFT.bit);
	}
	// strafe right
	if (In.getButtonState(InputController.MAP_RIGHT.key)) {
		this.inputState.add(InputController.MAP_RIGHT.bit);
	}
	else {
		this.inputState.subtract(InputController.MAP_RIGHT.bit);
	}
};

/*SceneObject.prototype.setState = function(state) {
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

};*/

SceneObject.prototype.step = function(dt, controller) {

};

SceneObject.prototype.draw = function(dt) {

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