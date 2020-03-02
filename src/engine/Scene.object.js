function SceneObject() {
	
	this.parent = null;
	
	this.id = 0; // world id, set when added to the simulation
	this.angles = [0.0, 0.0, 0.0]; // yaw pitch roll
	this.moveDirection = [0.0, 0.0, 0.0];
	this.speed = [0.0, 0.0, 0.0];
	this.inputState = new Bitfield();
	this.removed = false; 
	this.type = NetObject.Types.Default; // object type
	this.isPlayer = false; // set by createGameObjectFromMessage to designate object as belonging to the local user

	// threejs
	this.geometry = new THREE.BoxGeometry(1, 1, 1);
	this.material = new THREE.MeshBasicMaterial({color: 0xff0000});
	this.object = new THREE.Mesh(this.geometry, this.material);
	
}
/*MyNewSceneObject.prototype = Object.create(SceneObject.prototype);
MyNewSceneObject.prototype.constructor = MyNewSceneObject;*/

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



// copy of Types from NetObject.java
SceneObject.Types = {};
SceneObject.Types.NetObject = 0;
SceneObject.Types.Player = 1;
SceneObject.Types.SentientCube = 2;