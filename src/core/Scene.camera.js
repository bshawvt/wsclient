function SceneCamera(opt) {
	/* float above the scene with ASDW controls to pan
	
	*/
	var self = this;
	this.object3d = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 0.1, 1000);
	this.object3d.up = new THREE.Vector3(0, 0, 1);
	this.object3d.position.x = 5.0;//-10.0;
	this.object3d.position.y = 5.0;//-10.0;
	this.object3d.position.z = 5.0;//15.0;
	this.object3d.lookAt(new THREE.Vector3(0.0, 0.0, 0.0))

	this.active = false;
}

SceneCamera.prototype.update = function(vec3) {
	if (this.active == false) return;

};
SceneCamera.prototype.getObject = function() {
	return this.object3d;
};


SceneCamera.prototype.resize = function() {
	
	this.object3d.aspect = window.innerWidth/window.innerHeight;
	this.object3d.updateProjectionMatrix();

	// orth camera requirement
	/*this.camera.left = 		-this.camera.aspect * viewSize / 2;//-window.innerWidth;// / 2;
	this.camera.right = 	this.camera.aspect * viewSize / 2;//window.innerWidth;// / 2;
	this.camera.top = 		-viewSize / 2;//-window.innerHeight;// / 2;
	this.camera.bottom = 	viewSize / 2;//window.innerHeight;// / 2;*/
};