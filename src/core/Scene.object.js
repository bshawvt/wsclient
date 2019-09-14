function SceneObject(opt) { // template scene object
	this.x = 0.0;
	this.y = 0.0;
	this.z = 0.0;

	if (opt !== undefined) { // optional parameters
		if (opt.expires !== undefined) { // 
			this.expires = opt.expires;
		}
		if (opt.x !== undefined) { // 
			this.x = opt.x;
		}
		if (opt.y !== undefined) { // 
			this.y = opt.y;
		}
	}
	this.object3d = null;
	this.delete = false; // SceneManager will delete any scene object when delete is set to true
	//this._smid = 0; // this id is used by SceneManager and should be treated as read only
}
SceneObject.prototype.update = function(state) {
	/* template requirement, all scene objects should have this method
	SceneObject.update() is called by SceneManager.step() ~30 times per frame
	scene parameter is a reference to the SceneManager to keep scene objects mostly autonomous
	*/
	if (state.dt > this.expires) {
		this.delete = true;
	}
};
SceneObject.prototype.render = function(state) {
	/* template requirement, all scene objects should have this method
	todo: should this even be a thing?
	*/
};
SceneObject.prototype.getObject = function() {
	/* template requirement, all scene objects should have this method
	returns a ThreeJS Object3D
	*/
	return this.object3d;
};
SceneObject.prototype.setState = function(state) {
	/* state change integration 
	*/
};