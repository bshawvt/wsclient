// a camera that orbits around the player character
function SceneCamera(args) {
	console.log("scenecamera hello world");
	//if (args !== undefined) {
	var game = args.game || undefined;
	var x = args.x || 0.0;
	var y = args.y || 0.0;
	var z = args.z || 0.0;
	var xscale = args.xscale || 0;
	var yscale = args.yscale || 0;
	var zscale = args.zscale || 0;
	var yaw = args.yaw || 0.0;
	var pitch = args.pitch || 0.0;
	//}
	
	this.attached = null; 
	this.object = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	
	this.object.position.x = x;//0.33;
	this.object.position.y = y;//0.52;
	this.object.position.z = z;
	this.drawable = false;
	this.pitch = pitch;
	this.yaw = yaw;

	//this.pitchAccumulator = 40;
	//this.pitch = 40;

	//console.log(this);
	this.object.up = new THREE.Vector3(0, 0, 1);

}
SceneCamera.prototype = Object.create(SceneObject.prototype);
SceneCamera.prototype.constructor = SceneCamera;

SceneCamera.prototype.step = function(game, controller) {
	
};
// basically step but called by the render method
SceneCamera.prototype.setLocalState = function(game, In) {
	if (this.attached !== null) {

		var outterDistance = 2.5;
		var cameraHeight = 0.75;
		if (In.pointerLock || In.isMobile) {

			var m = In.getCursorPosition();

			this.yaw += m.dx * Config.input.sensX; 
			this.pitch += m.dy * Config.input.sensY;
			this.pitch = Clamp(this.pitch, 1, 179);

			var yaw = ((Math.PI/180) * this.yaw);
			var pitch = (Math.PI/180) * this.pitch;
			

			if (this.attached.isPlayer) {
				this.attached.setYaw(-yaw);
				this.attached.setPitch(pitch);
			}
			/*x: 1.0125080457438629, y: 2.4403491003932296, z: 1.0879759493841572
				UserInterface.js?v=1587977542286:94 pitch: 61, yaw: 17.5*/

			
			this.object.position.x = ( ( Math.sin(yaw) * Math.sin(pitch) ) * outterDistance ) + this.attached.object.position.x;
			this.object.position.y = ( ( Math.cos(yaw) * Math.sin(pitch) ) * outterDistance ) + this.attached.object.position.y;
			this.object.position.z = (-Math.cos(pitch) * outterDistance) + this.attached.object.position.z + cameraHeight;
		}

		this.object.lookAt(new THREE.Vector3(this.attached.object.position.x, this.attached.object.position.y, this.attached.object.position.z + cameraHeight));
		//this.object.up = new THREE.Vector3(0, 0, 1);

	}
	//console.log("x: " + this.object.position.x + ", y: " + this.object.position.y + ", z: " + this.object.position.z);
	//console.log("pitch: " + this.pitch + ", yaw: " + this.yaw);
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
