// a camera that orbits around the player character
function SceneCamera() {
	
	this.attached = null; 
	this.object = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	this.object.position.z = 5;
	this.drawable = false;
	

	//console.log(this);

}
SceneCamera.prototype = Object.create(SceneObject.prototype);
SceneCamera.prototype.constructor = SceneCamera;

SceneCamera.prototype.step = function(dt, controller) {
	
};

SceneCamera.prototype.update = function(dt, In) {
	if (this.attached !== null) {

		
		//this.object.rotation.x = -(Math.PI/180 * m.x ) * 0.05;
		//this.object.rotation.z = (Math.PI/180 * m.y ) * 0.05;
		
		//console.log(this.yaw);//yaw, this.pitch);
		if (In.pointerLock || In.isMobile) {

			var m = In.getCursorPosition();
			//console.log("dx: " + m.dx);
			//console.log("yaw before accumulator: " + this.yaw);
			//console.log("yaw after accumulator: " + this.yaw);
			//(Math.PI/180 * m.dx ) * In.sensX;//((Math.PI/180 * m.dx ) * In.sensX) % (Math.PI * 2);
			this.yaw += m.dx * Config.input.sensX; 
			this.pitch += m.dy * Config.input.sensY;
			this.pitch = Clamp(this.pitch, 0, 180);
			//console.log(this.pitch);

			var yaw = ((Math.PI/180) * this.yaw);// % (Math.PI * 2);
			var pitch = (Math.PI/180) * this.pitch;//Clamp((Math.PI/180) * this.pitch, 0.01, 3.14);// % (Math.PI * 2);
			
			var outterDistance = 5;

			if (this.attached.isPlayer) {
				this.attached.setYaw(-yaw);
			}


			this.object.position.x = ( ( Math.sin(yaw) * Math.sin(pitch) ) * outterDistance ) + this.attached.object.position.x;
			this.object.position.y = ( ( Math.cos(yaw) * Math.sin(pitch) ) * outterDistance ) + this.attached.object.position.y;
			this.object.position.z = (-Math.cos(pitch) * outterDistance) + this.attached.object.position.z + 2;
		}

		//this.object.position.x = this.attached.object.position.x;
		//this.object.position.y = this.attached.object.position.y;
		//this.object.position.z = this.attached.object.position.z + 5;

		//console.log(In.getCursorPosition());
		//console.log(In.getCursorPosition());


		this.object.up = new THREE.Vector3(0, 0, 1);
		this.object.lookAt(new THREE.Vector3(this.attached.object.position.x, this.attached.object.position.y, this.attached.object.position.z));

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
