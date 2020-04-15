function ScenePlayer() {
	
	this.inputState = new Bitfield();
	this.prevInputState = new Bitfield();
	this.parent = null;
	
	this.angles = [0.0, 0.0, 0.0]; // yaw pitch roll
	//this.position = [0.0, 0.0, 0.0];
	this.moveDirection = [0.0, 0.0, 0.0];
	this.speed = [0.025, 0.025, 0.0];
	
	//this.clientId = -1;
	this.id = 0; // world id, set when added to the simulation
	this.removed = false; 
	
	this.type = 0;//NetObject.Types.Default; // object type
	this.isPlayer = false;

	this.geometry = new THREE.BoxGeometry(1, 1, 1);
	this.material = new THREE.MeshBasicMaterial({color: 0xff0000});
	this.object = new THREE.Mesh(this.geometry, this.material);

	/*this.yaw = 0.0;
	this.pitch = 0.0;
	this.roll = 0.0;
	this.newYaw = 0.0;
	this.newPitch = 0.0;
	this.newRoll = 0.0;*/

	//this.object.up = new THREE.Vector3(0, 0, 1);
	
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

ScenePlayer.prototype.step = function(dt, controller) {
	
	// todo: the controller stuff shouldn't be part of a scene object
	if (this.isPlayer) {
		var In = controller;
		//var m = In.getCursorPosition();
		//if (Math.round(this.yaw * 100000) != Math.round(this.yawAccumulator * 100000)) {
			//console.log("sup");
			var diff = (this.yawAccumulator - this.yaw) / 3;

			/*if (diff >= -0.000 && diff <= 0.000) {
				console.log("A?!");
			}*/
			this.yaw += diff;//Math.sqrt((diff * diff) + (this.yaw * this.yaw));
			/*console.log(diff >= -0.000); 
			console.log(diff <= 0.000);
			console.log(diff);*/
			//console.log(this.yaw);
			//console.log(this.yawAccumulator);
			//console.log((this.yawAccumulator - this.yaw) / 5);
		//}
		//else {
		//	this.yawAccumulator = this.yaw;
		//}

		/*var yaw = -(Math.PI/180 * m.x ) * In.sensX;
		var yaw90 = -((Math.PI/180) * m.x * 90) * In.sensX;
		var pitch = -(Math.PI/180 * m.y ) * In.sensY;*/


		/*this.yaw += m.dx * In.sensX; 
		this.pitch += m.dy * In.sensY;//(Math.PI/180 * m.dy ) * In.sensX;//Clamp((Math.PI/180 * m.dy ) * In.sensX, 0.01, 3.14);
		
		var yaw = (-(Math.PI/180) * this.yaw) % (Math.PI * 2);
		var pitch = (-(Math.PI/180) * this.pitch);
		var outterDistance = 5;*/
		//this.object.rotation.y = -(Math.PI/180 * m.x ) * 0.05;
		//this.yaw += m.dx * In.sensX; 
		//this.pitch += m.dy * In.sensY;
		//this.pitch = Clamp(this.pitch, 0, 180);
		//console.log(this.pitch);

		//var yaw = -((Math.PI/180) * this.yaw) % (Math.PI * 2);
		//var pitch = -(Math.PI/180) * this.pitch;

		//this.object.rotation.z = yaw;
		//console.log(this.object.rotation.z);
		
		if (In.getMouseState(InputController.MAP_FIRE.key)) {
			this.inputState.add(InputController.MAP_FIRE.bit);
		}
		else {
			this.inputState.subtract(InputController.MAP_FIRE.bit);
		}


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

		var dirX = 0;
		var dirY = 0;
		// client prediction
		if (this.inputState.compare(InputController.MAP_FORWARD.bit)) {
			this.speed[0] = -0.25;
			//dirX = ( ( Math.sin(yaw) ) );
			//dirY = ( ( Math.cos(yaw) ) );
		}
		else if (this.inputState.compare(InputController.MAP_BACKWARD.bit)) {
			this.speed[0] = 0.25;
			//dirX = ( ( Math.sin(yaw) ) );
			//dirY = ( ( Math.cos(yaw) ) );
		}
		else {
			this.speed[0] = 0;
		}

		if (this.inputState.compare(InputController.MAP_LEFT.bit)) {
			this.speed[1] = -0.25;
			//dirX += ( Math.sin( yaw90 ) );
			//dirY += ( Math.cos( yaw90 ) );
		}
		else if (this.inputState.compare(InputController.MAP_RIGHT.bit)) {
			this.speed[1] = 0.25;
			//dirX += ( Math.sin( yaw90 ) );
			//dirY += ( Math.cos( yaw90 ) );
		}
		else {
			this.speed[1] = 0;
		}

		if (this.prevInputState.get() != this.inputState.get()) {

		}

		/*var yaw = (Math.PI/180 * m.x ) * In.sensX;
		var pitch = Clamp((Math.PI/180) * In.sensY, 0.01, 3.14);
		var outterDistance = 5;*/

		//this.object.rotation.x = -(Math.PI/180 * m.x ) * 0.05;
		//this.object.rotation.z = (Math.PI/180 * m.y ) * 0.05;
		
		//this.moveDirection[0] = Math.sin(yaw);
		//this.moveDirection[1] = Math.cos(yaw);
		//this.moveDirection[2] = (-Math.cos(pitch) * outterDistance) + this.attached.object.position.z + 1.5;
		//while(this.yaw != this.newYaw) {
		
		//console.log(this.yaw);
		
		//console.log(Math.sqrt(this.newYaw * this.newYaw + this.yaw * this.yaw));
	
		//}
	}
	this.moveDirection[0] = Math.sin(-this.yaw);
	this.moveDirection[1] = Math.cos(-this.yaw);
	//if ()

	this.object.position.x += this.moveDirection[0] * (this.speed[0] + this.speed[1]);
	this.object.position.y += this.moveDirection[1] * (this.speed[0] + this.speed[1]);
	this.object.position.z += this.moveDirection[2] * this.speed[2];

};

ScenePlayer.prototype.draw = function(dt) {
	//this.object.rotation.x += 0.01;
	//this.object.rotation.y += 0.01;
	//this.object.rotation.z += 0.01;
	//this.object.
	this.object.rotation.z = this.yaw;
};

