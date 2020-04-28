function ScenePlayer(game) {
	
	this.inputState = new Bitfield();
	this.prevInputState = new Bitfield();
	this.parent = null;
	
	this.position = [0.0, 0.0, 0.0];
	this.speed = [0.0, 0.0, 0.0]; // ws, strafe, gravity
	
	//this.clientId = -1;
	this.id = 0; // world id, set when added to the simulation
	this.removed = false; 
	
	this.type = 0;//NetObject.Types.Default; // object type
	this.isPlayer = false;
	this.translateGeometry = false;
	this.geometry = new THREE.BoxGeometry(0.5, 0.5, 1);
	//this.geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0.5/2, 0.5/2, 1/2 ) );
	//this.geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, 1/2 ) );
	//this.geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0.5/2, 0.5/2, 0 ) );
	this.material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});
	this.object = new THREE.Mesh(this.geometry, this.material);
	//this.object.applyMatrix( new THREE.Matrix4().makeTranslation( 0.5, 0.5, 1 ) );
	//this.geometry.matrixAutoUpdate = false;
	//this.identity = this.geometry.clone(true);
	//this.object.applyMatrix( new THREE.Matrix4().makeTranslation( 0.5/2, 0.5/2, 1/2 ) );

	//this.object.applyMatrix( new THREE.Matrix4().makeTranslation( 0.5/2, 0.5/2, 1/2 ) );
	//this.object.updateMatrix();

	this.lastJumpTime = 0;
	this.canJump = true;
	this.isJumping = false;

	/*this.yaw = 0.0;
	this.pitch = 0.0;
	this.roll = 0.0;
	this.newYaw = 0.0;
	this.newPitch = 0.0;
	this.newRoll = 0.0;*/

	//this.object.up = new THREE.Vector3(0, 0, 1);
	//this.bbObject = new SceneBoundingBox(scene, this, 0.71, 0.71, 1);
	//this.yawAccumulator = 90;
	//this.yaw = 90;
	//this.pitchAccumulator = 140;
	//this.pitch = 140;
	this.position[2] = 1.01;
	this.bb = new BoundingBox(0, 0, 0, 0.71, 0.71, 1, this, game);
	//scene.add(this.bbObject);
	
};
ScenePlayer.prototype = Object.create(SceneObject.prototype);
ScenePlayer.prototype.constructor = ScenePlayer;

ScenePlayer.prototype.setState = function(state) {
	//this.inputState = new Bitmask();
	this.parent = state.parent || null;
	
	if (state.positions !== undefined) {
		this.position[0] = state.position[0];
		this.position[1] = state.position[1];
		this.position[2] = state.position[2];
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
	

	var ydiff = (this.yawAccumulator - this.yaw) / 3;
	this.yaw += ydiff;

	var pdiff = (this.pitchAccumulator - this.pitch) / 3;
	this.pitch += pdiff;

	var rdiff = (this.rollAccumulator - this.roll) / 3;
	this.roll += rdiff;

	// player is in control of this object and controls input state
	if (this.isPlayer ) {	
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
	}
	

	var dirX = 0;
	var dirY = 0;

	var strafe = 0;
	//var shifty = 0.25; // debug for freeroam camera

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
	if (this.inputState.compare(InputController.MAP_JUMP.bit)) {
		if (this.canJump && this.lastJumpTime + 500 < scene.dt ) {
			this.lastJumpTime = scene.dt;
			this.speed[2] = 0.25;
			this.canJump = false;
			this.isJumping = true;
		}
	}
	else {
		this.isJumping = false;
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



	// has been in flight for too long
	if (this.isJumping && scene.dt > this.lastJumpTime + 250)  {
		this.isJumping = false;
	}
	if (this.isJumping) {
		this.speed[2] += 0.05;
	}
	else {
		this.speed[2] -= 0.05;
	}

	
	
	this.speed[0] = Clamp(this.speed[0], -0.25, 0.25);
	this.speed[1] = Clamp(this.speed[1], -0.15, 0.15);
	this.speed[2] = Clamp(this.speed[2], -0.5, 0.25);

	// more fake collision stuff
	var fx = this.position[0] + (Math.sin(-this.yaw) * (this.speed[0]));
	var fy = this.position[1] + (Math.cos(-this.yaw) * (this.speed[0]));;

	fx += Math.sin(-(this.yaw + this.strafe)) * (this.speed[1]);
	fy += Math.cos(-(this.yaw + this.strafe)) * (this.speed[1]);
	var fz = this.position[2] + this.speed[2];
	var hasCollided = false;
	var hasCollidedFall = false;
	var fellOn = undefined;
	var futureBB = new BoundingBox(fx, fy, this.position[2], 0.71, 0.71, 1);
	var futureFallBB = new BoundingBox(fx, fy, fz, 0.71, 0.71, 1);
	for(var i = 0; i < scene.tiles.length; i++) {
		var item = scene.tiles[i];
		if (item.bb.intersect3d(futureBB)) {
			hasCollided = true;
		}
		if (item.bb.intersect3d(futureFallBB)) {
			hasCollidedFall = true;
			fellOn = item.bb;
		}
	}

	if (!hasCollided) {
		this.position[0] += Math.sin(-this.yaw) * (this.speed[0]);
		this.position[1] += Math.cos(-this.yaw) * (this.speed[0]);

		this.position[0] += Math.sin(-(this.yaw + this.strafe)) * (this.speed[1]);
		this.position[1] += Math.cos(-(this.yaw + this.strafe)) * (this.speed[1]);
	}
	else {
		this.speed[0] = 0.0;
		this.speed[1] = 0.0;
	}
	
	if (!hasCollidedFall) {
		this.position[2] += this.speed[2];
	}
	else {
		this.canJump = true;
		this.isJumping = false;
		if (fellOn !== undefined) {
			//this.position[2] = fellOn.z + fellOn.zscale;
			//this.position[2] = fellOn.z + fellOn.zscale + 0.01;//fellOn.z + fellOn.zscale);
			this.speed[2] = 0.0;
			//console.log(this.position[2]);
		}
	}

	// player mesh origin is around its center so adding things
	this.object.position.x = this.position[0] + ((0.71)/2);
	this.object.position.y = this.position[1] + ((0.71)/2);
	this.object.position.z = this.position[2] + 0.5;
	//console.log(this.speed);
	this.bb.set(this.position[0], this.position[1], this.position[2], 0.71, 0.71, 1);
};

ScenePlayer.prototype.draw = function(dt) {

	

	this.object.rotation.z = this.yaw;

};

