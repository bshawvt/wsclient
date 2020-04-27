function BoundingBox(x, y, z, xscale, yscale, zscale, parent, scene) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.xscale = xscale;
	this.yscale = yscale;
	this.zscale = zscale;

	if (scene !== undefined) {
		this.sceneObject = new SceneBoundingBox(scene, this, xscale, yscale, zscale);
		this.sceneObject.setPosition(x, y, z);
		scene.add(this.sceneObject);
	}
	//this.sceneObject.setBounds(xscale, yscale, zscale);

	
}

BoundingBox.prototype.x = 0;
BoundingBox.prototype.y = 0;
BoundingBox.prototype.z = 0;
BoundingBox.prototype.xscale = 0;
BoundingBox.prototype.yscale = 0;
BoundingBox.prototype.zscale = 0;

BoundingBox.prototype.intersect3d = function(bb) {
	var ax = this.x;
	var ay = this.y;
	var az = this.z;
	var au = this.x + this.xscale;
	var av = this.y + this.yscale;
	var aw = this.z + this.zscale;

	var bx = bb.x;
	var by = bb.y;
	var bz = bb.z;
	var bu = bb.x + bb.xscale;
	var bv = bb.y + bb.yscale;
	var bw = bb.z + bb.zscale;

	return (ax <= bu && au >= bx && // x
				ay <= bv && av >= by && // y
					az <= bw && aw >= bz); // z
}
BoundingBox.prototype.intersect2d = function(bb) {
	var ax = this.x;
	var ay = this.y;
	var az = this.z;
	var au = this.x + this.xscale;
	var av = this.y + this.yscale;
	//var aw = this.z + this.zscale;

	var bx = bb.x;
	var by = bb.y;
	var bz = bb.z;
	var bu = bb.x + bb.xscale;
	var bv = bb.y + bb.yscale;
	//var bw = bb.z + bb.zscale;

	return (ax <= bu && au >= bx && // x
				ay <= bv && av >= by);// && // y
}
BoundingBox.prototype.set = function(x, y, z, xscale, yscale, zscale) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.xscale = xscale;
	this.yscale = yscale;
	this.zscale = zscale;

	if (this.sceneObject !== undefined) {

		this.sceneObject.setPosition(x, y, z);
		this.sceneObject.setBounds(xscale, yscale, zscale);

	}
};

/*public boolean intersect(ObjectBoundingBox bb) {
	double ax = x;
	double ay = y;
	double aw = x + width;
	double ah = y + height;
	
	double bx = bb.x;
	double by = bb.y;
	double bw = bb.x + bb.width;
	double bh = bb.y + bb.height;

	return ((ax <= bw && aw >= bx && ay <= bh && ah >= by));
}*/