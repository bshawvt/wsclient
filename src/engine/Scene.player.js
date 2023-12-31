function ScenePlayer(args) {
	//if (args !== undefined) {
		console.log("sceneplayer hello world");
	var game = args.game || undefined;
	var x = args.x || 0;
	var y = args.y || 0;
	var z = args.z || 1.01;
	var xscale = args.xscale || 0.71;
	var yscale = args.yscale || 0.71;
	var zscale = args.zscale || 1;
	//}

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
	this.z = z;//1.01;
	// 0.71
	this.bb = new BoundingBox(x, y, z, xscale, yscale, zscale, this, game);
	//scene.add(this.bbObject);
	
};
ScenePlayer.prototype = Object.create(SceneObject.prototype);
ScenePlayer.prototype.constructor = ScenePlayer;
var _Spd = [0.0, 0.0, 0.0];
ScenePlayer.prototype.step = function(scene, In) {

	if (this.isPlayer)
		this.setLocalState(In);

	var ydiff = (this.yawAccumulator - this.yaw) / 3;
	this.yaw += ydiff;

	var pdiff = (this.pitchAccumulator - this.pitch) / 3;
	this.pitch += pdiff;

	var rdiff = (this.rollAccumulator - this.roll) / 3;
	this.roll += rdiff;

	// client prediction
	// attack
	if (this.inputState.compare(InputController.MAP_FIRE.bit) != 0) {
		console.log("fire");
	}
	else if (this.inputState.compare(InputController.MAP_ALTFIRE.bit) != 0) {
		console.log("alt fire");
	}
	else {

	}

	// jump
	if (this.inputState.compare(InputController.MAP_JUMP.bit) != 0) {

	}
	else {

	}

	// action
	if (this.inputState.compare(InputController.MAP_ACTION.bit) != 0) {

	}
	else {

	}

	var strafe = 0.0;
	var accel = false;
	var dir = 0.0;
	// forward and reverse
	if (this.inputState.compare(InputController.MAP_FORWARD.bit) != 0) {
		this.speed[0] = -0.1;
	}
	else if (this.inputState.compare(InputController.MAP_BACKWARD.bit) != 0) {
		this.speed[0] = 0.1;
	}
	else {
		this.speed[0] = 0;
	}

	// strafe
	if (this.inputState.compare(InputController.MAP_LEFT.bit) != 0) {
		this.speed[1] = 0.1;
		//strafe = (Math.PI / 180) * 90;
	}
	else if (this.inputState.compare(InputController.MAP_RIGHT.bit) != 0) {
		this.speed[1] = -0.1;
		//strafe = (Math.PI / 180) * 90;
	}
	else {
		this.speed[1] = 0.0;
		strafe = 0.0;
	}

	//var yaw = BadMath.D0TR / this.yaw;
	//console.log(Math.sin(this.yaw));

	this.speed[2] = 0.0;

	//var pitch = BadMath.D0TR * this.pitch;
	var nx = Math.sin(-this.yaw) * this.speed[0];
	var ny = Math.cos(-this.yaw) * this.speed[0];
	var nz = this.speed[2];

	if (this.speed[1] != 0.0) {

		nx += Math.sin(-this.yaw + BadMath.D90TR) * this.speed[1];
		ny += Math.cos(-this.yaw + BadMath.D90TR) * this.speed[1];
	}

	

	this.x += nx;
	this.y += ny;
	this.z += nz;

	/* player mesh origin is around its center so adding things
		this is purely visual and does not affect prediction afaik */
	this.object.position.x = this.x + ((0.71)/2);
	this.object.position.y = this.y + ((0.71)/2);
	this.object.position.z = this.z + 0.5;
	//console.log(this.speed);
	this.bb.set(this.x, this.y, this.z, 0.71, 0.71, 1);
};

ScenePlayer.prototype.draw = function(dt) {

	

	this.object.rotation.z = this.yaw;

};

