function SceneCube() {
	
	this.inputState = new Bitfield();
	this.parent = null;
	
	this.position = [0.0, 0.0, 0.0];
	this.moveDirection = [0.0, 0.0, 0.0];
	this.speed = [0.0, 0.0, 0.0];
	
	this.yaw = 0.0;
	this.pitch = 0.0;
	this.roll = 0.0;
	
	//this.clientId = -1;
	this.id = 0; // world id, set when added to the simulation
	this.removed = false; 
	
	this.type = NetObject.Types.Default; // object type

	this.geometry = new THREE.BoxGeometry(this.position[0], this.position[1], this.position[2]);
	this.material = new THREE.MeshBasicMaterial({color: 0xff0000});
	this.object = new THREE.Mesh(this.geometry, this.material);
	
}
SceneCube.prototype.setState = function(state) {
	//this.inputState = new Bitmask();
	this.parent = state.parent || null;
	
	this.object.position.x = state.position[0];// = new THREE.Vector3([state.position[0], state.position[1], state.position[2]]);
	this.object.position.y = state.position[1];
	this.object.position.z = state.position[2];
	//this.moveDirection = [state.moveDirection[0], state.moveDirection[1], state.moveDirection[2]];
	//this.speed = [state.speed[0], state.speed[1], state.speed[2]];
	
	this.yaw = state.yaw;
	this.pitch = state.pitch;// || this.pitch;
	this.roll = state.roll;// || this.roll;
	
	//this.clientId = -1;
	this.id = state.id;
	//this.removed = false; 
	
	//this.type = NetObject.Types.Default; // object type
	
	this.inputState = new Bitfield(state.input);

	//this.sceneObject.
};
SceneCube.prototype.step = function(dt) {
	if (this.inputState.compare()) {

	}
	//console.log(this.mesh);
	//this.object.rotation.x += 0.01;
	//this.object.rotation.y += 0.01;
};
SceneCube.prototype.draw = function(dt) {
	//this.object.rotation.x += 0.01;
	//this.object.rotation.y += 0.01;
};