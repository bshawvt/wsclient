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
		var ryaw = BadMath.D0TR * this.yaw;
		var rpitch = BadMath.D0TR * this.pitch;

		if (In.pointerLock || In.isMobile) {

			var m = In.getCursorPosition();

			this.yaw += m.dx * Config.input.sensX; 
			this.pitch += m.dy * Config.input.sensY;
			
			this.pitch = Clamp(this.pitch, 1, 179);

			ryaw = BadMath.D0TR * this.yaw;
			rpitch = BadMath.D0TR * this.pitch;

			if (this.attached.isPlayer) {
				this.attached.setYaw(-ryaw);
				this.attached.setPitch(rpitch);
			}

		}

		var syaw = Math.sin(ryaw);
		var cyaw = Math.cos(ryaw);

		var spitch = Math.sin(rpitch);
		var cpitch = Math.cos(rpitch);

		this.object.position.x = ( ( syaw * spitch ) * outterDistance ) + this.attached.object.position.x;
		this.object.position.y = ( ( cyaw * spitch ) * outterDistance ) + this.attached.object.position.y;
		this.object.position.z = (-cpitch * outterDistance) + this.attached.object.position.z + cameraHeight;

		this.object.lookAt(new THREE.Vector3(this.attached.object.position.x, this.attached.object.position.y, this.attached.object.position.z + cameraHeight));

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
