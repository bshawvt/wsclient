function ScenePlayer(scene) {
	
	this.inputState = new Bitfield();
	this.prevInputState = new Bitfield();
	this.parent = null;
	
	this.angles = [0.0, 0.0, 0.0]; // yaw pitch roll
	//this.position = [0.0, 0.0, 0.0];
	this.moveDirection = [0.0, 0.0, 0.0];
	this.speed = [0.0, 0.0, 0.0];
	
	//this.clientId = -1;
	this.id = 0; // world id, set when added to the simulation
	this.removed = false; 
	
	this.type = 0;//NetObject.Types.Default; // object type
	this.isPlayer = false;

	this.geometry = new THREE.BoxGeometry(0.5, 0.5, 1);
	this.material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});
	this.object = new THREE.Mesh(this.geometry, this.material);

	this.lastJumpTime = 0;

	/*this.yaw = 0.0;
	this.pitch = 0.0;
	this.roll = 0.0;
	this.newYaw = 0.0;
	this.newPitch = 0.0;
	this.newRoll = 0.0;*/

	//this.object.up = new THREE.Vector3(0, 0, 1);
	this.bbObject = new SceneBoundingBox(scene, this);
	scene.add(this.bbObject);
	
};
ScenePlayer.prototype = Object.create(SceneObject.prototype);
ScenePlayer.prototype.constructor = ScenePlayer;

ScenePlayer.prototype.setState = function(state) {
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

ScenePlayer.prototype.step = function(scene, In) {
	
	// todo: the controller stuff shouldn't be part of a scene object
	if (this.isPlayer) {

		var diff = (this.yawAccumulator - this.yaw) / 3;
		this.yaw += diff;

		// getting client state updates
		
		// shoot
		if (In.getMouseState(InputController.MAP_FIRE.key)) {
			this.inputState.add(InputController.MAP_FIRE.bit);
			this.inputState.subtract(InputController.MAP_ALTFIRE.bit);
		}
		else if (In.getMouseState(InputController.MAP_ALTFIRE.key)) {
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

		//this.speed[0] = Clamp(this.speed[0], -0.5, 0.5);
		//this.speed[1] = Clamp(this.speed[1], -0.5, 0.5);

		//this.moveDirection[0] = Math.sin(-this.yaw);
		//this.moveDirection[1] = Math.cos(-this.yaw);
	}
	

	var dirX = 0;
	var dirY = 0;

	var strafe = 0;

	// client prediction
	// attack
	if (this.inputState.compare(InputController.MAP_FIRE.bit)) {
		console.log("fire");
	}
	else if (this.inputState.compare(InputController.MAP_ALTFIRE.bit)) {
		console.log("alt fire");
	}
	else {

	}

	// jump
	if (this.inputState.compare(InputController.MAP_JUMP.bit) && this.lastJumpTime+1000 < scene.dt ) {
		console.log("jump");
	}
	else {

	}

	// action
	if (this.inputState.compare(InputController.MAP_ACTION.bit)) {
		console.log("action");
	}
	else {

	}

	// forward and reverse
	if (this.inputState.compare(InputController.MAP_FORWARD.bit)) {
		this.speed[0] -= 0.01;
	}
	else if (this.inputState.compare(InputController.MAP_BACKWARD.bit)) {
		this.speed[0] += 0.01;
	}
	else {
		this.speed[0] -= (this.speed[0]/2) / 2;
	}
	// strafe
	if (this.inputState.compare(InputController.MAP_LEFT.bit)) {
		this.speed[1] -= 0.01;
		this.strafe = (Math.PI / 180) * 90;
	}
	else if (this.inputState.compare(InputController.MAP_RIGHT.bit)) {
		this.speed[1] += 0.01;
		this.strafe = (Math.PI / 180) * 90;
	}
	else {
		this.speed[1] -= (this.speed[1]/2) / 2;
	}



	if (this.prevInputState.get() != this.inputState.get()) {

	}

	this.speed[0] = Clamp(this.speed[0], -0.14, 0.14);
	this.speed[1] = Clamp(this.speed[1], -0.09, 0.09);


	//this.speed[2] = -0.05;
	//this.moveDirection[2] = 1;
	//this.moveDirection[0] = Math.sin(-(this.yaw + strafe));//this.yaw);
	//this.moveDirection[1] = Math.cos(-(this.yaw + strafe));//this.yaw);

	this.object.position.x += Math.sin(-this.yaw) * (this.speed[0]);
	this.object.position.y += Math.cos(-this.yaw) * (this.speed[0]);
	
	//if (has)
	this.object.position.z += this.moveDirection[2] * (this.speed[2]);

	// strafe
	this.object.position.x += Math.sin(-(this.yaw + this.strafe)) * (this.speed[1]);
	this.object.position.y += Math.cos(-(this.yaw + this.strafe)) * (this.speed[1]);
	this.object.position.z += this.moveDirection[2] * (this.speed[2]);

	// updating the child meshs so it doesn't look snappy
	this.bbObject.setPosition(this.object.position.x, this.object.position.y, this.object.position.z);
	this.bbObject.setBounds(this.object.position.x, this.object.position.y);

	//console.log(this.speed);

};

ScenePlayer.prototype.draw = function(dt) {
	//this.object.rotation.x += 0.01;
	//this.object.rotation.y += 0.01;
	//this.object.rotation.z += 0.01;
	//this.object.
	this.object.rotation.z = this.yaw;
};

