function SceneCube() {
	
	this.position = [1.0, 1.0, 1.0];
	this.geometry = new THREE.BoxGeometry(1, 1, 1);
	this.material = new THREE.MeshBasicMaterial({color: 0xff0000});
	this.object = new THREE.Mesh(this.geometry, this.material);
	
}
SceneCube.prototype.step = function(dt) {
	//console.log(this.mesh);
	this.object.rotation.x += 0.01;
	this.object.rotation.y += 0.01;
};
SceneCube.prototype.draw = function(dt) {
	this.object.rotation.x += 0.01;
	this.object.rotation.y += 0.01;
};