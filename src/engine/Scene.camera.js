// a camera that orbits around the player character
function SceneCamera(scene) {
	
	this.attached = null; 
	this.object = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	this.object.position.z = -5;
	this.drawable = false;
	this.pitch = 150;

	//console.log(this);

}
SceneCamera.prototype = Object.create(SceneObject.prototype);
SceneCamera.prototype.constructor = SceneCamera;

SceneCamera.prototype.step = function(game, controller) {
	
};
// basically step but called by the render method
SceneCamera.prototype.update = function(game, In) {
	if (this.attached !== null) {

		if (In.pointerLock || In.isMobile) {

			var m = In.getCursorPosition();

			this.yaw += m.dx * Config.input.sensX; 
			this.pitch += m.dy * Config.input.sensY;
			this.pitch = Clamp(this.pitch, 1, 179);

			var yaw = ((Math.PI/180) * this.yaw);
			var pitch = (Math.PI/180) * this.pitch;
			var outterDistance = 2;

			if (this.attached.isPlayer) {
				this.attached.setYaw(-yaw);
			}

			var cameraHeight = 1.5;
			this.object.position.x = ( ( Math.sin(yaw) * Math.sin(pitch) ) * outterDistance ) + this.attached.object.position.x;
			this.object.position.y = ( ( Math.cos(yaw) * Math.sin(pitch) ) * outterDistance ) + this.attached.object.position.y;
			this.object.position.z = (-Math.cos(pitch) * outterDistance) + this.attached.object.position.z + cameraHeight;
		}

		this.object.lookAt(new THREE.Vector3(this.attached.object.position.x, this.attached.object.position.y, this.attached.object.position.z));
		this.object.up = new THREE.Vector3(0, 0, 1);

	}
};
SceneCamera.prototype.draw = function(dt) {
	// body...
};

SceneCamera.prototype.attach = function(object) {
	this.attached = object;
};
SceneCamera.prototype.resize = function(width, height) {
	this.object.aspect = width / height;
	this.object.updateProjectionMatrix();
};
