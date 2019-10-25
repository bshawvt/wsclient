function QuadTree(parent) {

	this.parent = parent || {};
	this.x = parent.x || 0;
	this.y = parent.y || 0;
	this.s = parent.s || 200;

	this.capacity = parent.capacity || 1;

	this.sectors = [null, null, null, null];
	this.subdivided = false;
}

QuadTree.prototype.subdivide = function() {


	var t = {
				x: this.x - (this.s / 2), 
				y: this.y - (this.s / 2),
				s: this.s / 2
			}
	this.sections[0] = new QuadTree({x, y, w, h});
	this.sections[1] = new QuadTree();
	this.sections[2] = new QuadTree();
	this.sections[3] = new QuadTree();
};

//new QuadTree();