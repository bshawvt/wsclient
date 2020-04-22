function SceneBoundingBox(scene, parent, xscale, yscale, zscale) {
	
	this.inputState = new Bitfield();
	this.prevInputState = new Bitfield();
	this.parent = undefined;
	
	this.angles = [0.0, 0.0, 0.0]; // yaw pitch roll
	//this.position = [0.0, 0.0, 0.0];
	this.moveDirection = [0.0, 0.0, 0.0];
	this.speed = [0.025, 0.025, 0.0];   
	
	//this.clientId = -1;
	this.id = 0; // world id, set when added to the simulation
	this.removed = false; 
	
	this.type = 0;//NetObject.Types.Default; // object type
	this.isPlayer = false;

	this.parent = parent;

	this.geometry = new THREE.BoxGeometry(xscale, yscale, zscale);

	var tx = xscale/2;
	var ty = yscale/2;
	var tz = zscale/2;
	if (parent.translateGeometry) {
		tx = xscale;//
		ty = yscale;//
		tz = zscale;//
	}
	this.geometry.applyMatrix( new THREE.Matrix4().makeTranslation(tx, ty, tz ) );
	this.material = new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true});
	this.object = new THREE.Mesh(this.geometry, this.material);
	//this.object.applyMatrix( new THREE.Matrix4().makeTranslation(tx, ty, tz ) );
	//if (Math.floor(Math.random()  * 25) != 1) {
	//	scene.add(new SceneBoundingBox(scene, this));
	//}
	
};
SceneBoundingBox.prototype = Object.create(SceneObject.prototype);
SceneBoundingBox.prototype.constructor = ScenePlayer;

SceneBoundingBox.prototype.step = function(dt, controller) {
	/*if (this.parent != undefined) {
		this.object.position.x = this.parent.object.position.x;
		this.object.position.y = this.parent.object.position.y;
		this.object.position.z = this.parent.object.position.z;
	}*/
};
SceneBoundingBox.prototype.setBounds = function(x, y, z) {
	//this.object.scale(x, y, z);
};
SceneBoundingBox.prototype.draw = function(dt) {

};

