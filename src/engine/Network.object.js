function NetObject(sceneObject, isPlayer) {

	this.sceneObject = sceneObject; // reference to a scene object
	this.isPlayer = isPlayer;
	this.prevInputState = new Bitfield();
	this.prevYaw = 0.0;
	this.prevPitch = 0.0;
	this.prevRoll = 0.0;

}

// compares local user scene object with its previous state
// and overwrites with new data
NetObject.prototype.isStateChanged = function() {

	if (this.prevInputState.get() != this.sceneObject.inputState.get()) {
		//this.prevInputState = new Bitfield(this.sceneObject.inputState.get());
		return true;
	}

	if (this.prevYaw != this.sceneObject.yawAccumulator) {
		//this.prevYaw = this.sceneObject.yawAccumulator;
		return true;
	}

	if (this.prevPitch != this.sceneObject.pitchAccumulator) {
		//this.prevPitch = this.sceneObject.pitchAccumulator;
		return true;
	}

	if (this.prevRoll != this.sceneObject.rollAccumulator) {
		//this.prevRoll = this.sceneObject.rollAccumulator;
		return true;
	}
	/*if (this.prevInputState.get() != this.sceneObject.inputState.get() ||
		(this.prevYaw != this.sceneObject.yaw) ||
		(this.prevPitch != this.sceneObject.pitch) ||
		(this.prevRoll != this.sceneObject.roll)) {
		return true;
	}*/
	return false;
};

// pieces together state changes 
NetObject.prototype.buildStateBlob = function() {
	var blob = { type: Network.BlobTypes.State, input: this.sceneObject.inputState.get() };
	//console.log(this.sceneObject.inputState.get(), this.prevInputState.get());
	//blob.input = 
	if (this.prevInputState.get() != this.sceneObject.inputState.get()) {
		//blob.input = this.sceneObject.inputState.get();
		this.prevInputState = new Bitfield(this.sceneObject.inputState.get());
	}
	if (this.prevYaw != this.sceneObject.yaw) {
		if (blob.angles === undefined) {
			blob.angles = [0, 0, 0];
		}
		blob.angles[0] = this.sceneObject.yaw;
		this.prevYaw = this.sceneObject.yawAccumulator;
	}
	if (this.prevPitch != this.sceneObject.pitch) {
		if (blob.angles === undefined) {
			blob.angles = [0, 0, 0];
		}
		blob.angles[1] = this.sceneObject.pitch;
		this.prevPitch = this.sceneObject.pitchAccumulator;
	}
	if (this.prevRoll != this.sceneObject.roll) {
		if (blob.angles === undefined) {
			blob.angles = [0, 0, 0];
		}
		blob.angles[2] = this.sceneObject.roll;
		this.prevRoll = this.sceneObject.rollAccumulator;
	}

	return blob;
};

/* takes received state and applies it to a scene object
	this is used in Network sendFrame class
*/
NetObject.prototype.setState = function(state) {

	// some things the player has total control over, such as pitch, roll, yaw and keyboard state
	if (!this.sceneObject.isPlayer) {
		
		if (state.angles !== undefined) {
			this.prevYaw = this.sceneObject.yaw;
			this.sceneObject.yawAccumulator = state.angles[0];
		
			this.prevPitch = this.sceneObject.pitch;
			this.sceneObject.pitchAccumulator = state.angles[1];

			this.prevRoll = this.sceneObject.roll;
			this.sceneObject.rollAccumulator = state.angles[2];
		}
		
		if (state.input !== undefined) {
			this.prevInputState = new Bitfield(this.sceneObject.inputState.get());
			this.sceneObject.inputState = new Bitfield(state.input);
		}

		if (state.speed !== undefined) {
			this.sceneObject.speed[0] = state.speed[0];
			this.sceneObject.speed[1] = state.speed[1];
			this.sceneObject.speed[2] = state.speed[2];
		}
	}

	//if (this.sceneObject.position)
	if (state.position !== undefined) {
		//if (this.sceneObject.position[0] )
		this.sceneObject.x = state.position[0];
		this.sceneObject.y = state.position[1];
		this.sceneObject.z = state.position[2];
	}

	if (state.bb !== undefined)
		this.sceneObject.bb = new BoundingBox( state.bb[0], state.bb[1], state.bb[2],
												state.bb[3], state.bb[4], state.bb[5] );

};


// mirror of NetObject.java types
NetObject.Types = {};
NetObject.Types.Default = 0; // NetObject
NetObject.Types.Player = 1; // NetObject