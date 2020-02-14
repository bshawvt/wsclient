function SceneCamera() {
	
	this.attached = null; 
	this.object = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	this.object.position.z = 5;

	//console.log(this);

}
SceneCamera.prototype = Object.create(SceneObject.prototype);
SceneCamera.prototype.constructor = SceneCamera;

SceneCamera.prototype.step = function(dt, controller) {

};

SceneCamera.prototype.update = function(dt) {
	if (this.attached !== null) {
		this.object.position.x = this.attached.object.position.x;
		this.object.position.y = this.attached.object.position.y;
		this.object.position.z = this.attached.object.position.z + 5;
	}
};
SceneCamera.prototype.draw = function(first_argument) {
	// body...
};

SceneCamera.prototype.attach = function(object) {
	this.attached = object;
};
SceneCamera.prototype.resize = function(width, height) {
	this.object.aspect = width / height;
	this.object.updateProjectionMatrix();
};