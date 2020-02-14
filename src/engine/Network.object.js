function NetObject(sceneObject) {
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

	this.sceneObject = sceneObject; // reference to a scene object
	
	//this.inputState = new Bitfield();

}
NetObject.prototype.setState = function(state) {
	//this.inputState = new Bitmask();
	this.parent = state.parent || null;
	
	this.position = [state.position[0], state.position[1], state.position[2]];
	this.speed = [state.speed[0], state.speed[1], state.speed[2]];
	
	this.yaw = state.yaw;
	this.pitch = state.pitch;// || this.pitch;
	this.roll = state.roll;// || this.roll;
	
	//this.clientId = -1;
	this.id = state.id;
	this.removed = state.removed; 
	
	//this.type = NetObject.Types.Default; // object type
	
	this.inputState = new Bitfield(state.input);

	//this.sceneObject.
};
// mirror of NetObject.java types
NetObject.Types = {};
NetObject.Types.Default = 0; // NetObject
NetObject.Types.Player = 1; // NetObject