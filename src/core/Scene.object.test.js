function TestSceneObject(opt) {
	SceneObject.call(this, opt);
	var geometry = new THREE.BoxGeometry(1, 1, 1);
	var material = new THREE.MeshBasicMaterial({color: 0x0000ff});
	this.object3d = new THREE.Mesh(geometry, material);
	this.object3d.position.x = this.x;
	this.object3d.position.y = this.y;
	this.object3d.position.z = Math.random() * 1;
	//console.log(this);
	this.lastUpdate = 0;
	this.b = 0.01;///(1+Math.random() * 2);
}
TestSceneObject.prototype = Object.create(SceneObject.prototype);
TestSceneObject.prototype.constructor = TestSceneObject;

TestSceneObject.prototype.update = function(state) {
	if (this.object3d.position.z > 1) this.b = -this.b;
	else if (this.object3d.position.z < 0) this.b = -this.b;
	this.object3d.position.z += this.b;
};