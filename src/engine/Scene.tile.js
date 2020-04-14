function SceneTile() {
	
	this.inputState = new Bitfield();
	this.parent = null;
	
	this.angles = [0.0, 0.0, 0.0]; // yaw pitch roll
	//this.position = [0.0, 0.0, 0.0];
	this.moveDirection = [0.0, 0.0, 0.0];
	this.speed = [1.0, 1.0, 0.0];
	
	//this.clientId = -1;
	this.id = 0; // world id, set when added to the simulation
	this.removed = false; 
	
	this.type = 0;//NetObject.Types.Default; // object type
	this.isPlayer = false;

	this.geometry = new THREE.BoxGeometry(10, 10, 1);
	this.material = new THREE.MeshBasicMaterial({color: 0x0f0f0f});
	this.object = new THREE.Mesh(this.geometry, this.material);
	this.object.position.z = -1;
	
};
SceneTile.prototype = Object.create(SceneObject.prototype);
SceneTile.prototype.constructor = SceneTile;

SceneTile.prototype.setState = function(state) {
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

SceneTile.prototype.step = function(dt, controller) {
	
	// todo: the controller stuff shouldn't be part of a scene object
	if (this.isPlayer) {
		this.speed[0] = 0.01;
		this.speed[1] = 0.01;
		var In = controller;
		

		if (In.getButtonState(InputController.MAP_BACKWARD.key)) {
			this.inputState.add(InputController.MAP_BACKWARD.bit);
		}
		else {
			this.inputState.subtract(InputController.MAP_BACKWARD.bit);
		}

		if (In.getButtonState(InputController.MAP_FORWARD.key)) {
			this.inputState.add(InputController.MAP_FORWARD.bit);
		}
		else {
			this.inputState.subtract(InputController.MAP_FORWARD.bit);
		}
		

		if (In.getButtonState(InputController.MAP_LEFT.key)) {
			this.inputState.add(InputController.MAP_LEFT.bit);
		}
		else {
			this.inputState.subtract(InputController.MAP_LEFT.bit);
		}
		
		if (In.getButtonState(InputController.MAP_RIGHT.key)) {
			this.inputState.add(InputController.MAP_RIGHT.bit);
		}
		else {
			this.inputState.subtract(InputController.MAP_RIGHT.bit);
		}



	}

	//if ()

	this.object.position.x += this.moveDirection[0] * this.speed[0];
	this.object.position.y += this.moveDirection[1] * this.speed[1];
	this.object.position.z += this.moveDirection[2] * this.speed[2];

};

SceneTile.prototype.draw = function(dt) {
	//this.object.rotation.x += 0.01;
	//this.object.rotation.y += 0.01;
};

