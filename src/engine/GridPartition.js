function GridPartition(size, objects, ratio) {
	this.cellIndex = 0;
	this.lastIndex = 0;
	this.cells = [];

	this.ratio = ratio;
	this.size = size;
	this.columns = this.size / this.ratio;
	craw.rect({x: 0, y: 0, w: 400, h: 400, c: "#f00"});

	for(var i = 0; i < objects.length; i++) {
		this.insert(objects[i]);
		craw.rect({x: objects[i].bb.x, y: objects[i].bb.y, w: objects[i].bb.xscale, h: objects[i].bb.yscale})
	}

}

GridPartition.prototype.get = function(x, y, x2, y2) {
	//craw.rect({x: x2, y: y2, w: 2, h: 2, f: true, c: "#00ff00"});
	var i = x + this.columns * y;
	return this.cells[i] || [];
};
GridPartition.prototype.insert = function(object) {
	
	var x = Math.floor(object.bb.x / this.ratio);
	var y = Math.floor(object.bb.y / this.ratio);
	var i = x + this.columns * y;

	var dx = x * this.ratio;
	var dy = y * this.ratio;
	
	if (this.cells[i] === undefined) {
		this.cells[i] = new ObjectList(object);
		craw.rect({x: dx, y: dy, w: this.ratio, h: this.ratio, f: false, c: "#f00"});
	}
	else {
		this.cells[i].fastAdd(object);
	}

	// nearest neighbors
	// cell we belong to
	object.neighbors = this.cells[i];




	//console.log(x, y, i);

};