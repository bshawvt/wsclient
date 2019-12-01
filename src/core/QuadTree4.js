function QuadTree(opt) {
	this.x = opt.x || 0;
	this.y = opt.y || 0;
	this.width = opt.width || 200;
	this.height = opt.height || 200;


	this.minX = this.x;
	this.maxX = this.x + this.width;

	this.minY = this.y;
	this.maxY = this.y + this.height;




	/*this.bMinX = b.x;
	this.bMaxX = b.x + b.width;
	this.bMinY = b.y;
	this.bMaxY = b.y + b.height;*/

	this.divisions = [null, null, null, null]
	this.subdivided = false;

	craw.rect({x: this.x, y: this.y, w: this.width, h: this.height, c: "#ff0000"})
}

QuadTree.prototype.subdivide = function() {
};

QuadTree.prototype.insert = function(point) {
	// body...
};
QuadTree.prototype.contains = function() {
	// body...
};
QuadTree.prototype.intersect = function(a, b) {
	/*var aMinX = a.x;
	var aMaxX = a.x + a.width;
	var aMinY = a.y;
	var aMaxY = a.y + a.height;

	var bMinX = b.x;
	var bMaxX = b.x + b.width;
	var bMinY = b.y;
	var bMaxY = b.y + b.height;*/
	return (a.minX <= b.maxX && a.maxX >= b.minX) && (a.minY <= b.maxY && a.maxY >= bminY);



};
QuadTree.prototype.get = function() {
	// body...
};



craw.set("canvas2d-1");
craw.clear();
var tree = new QuadTree({width: 400, height: 400});

for(var i = 0; i < 100; i++) {
	//tree.insert({x: 250 + (i * 10), y: 220 + (i * 10)});
	tree.insert({x: Math.floor(Math.random()*400), y: Math.floor(Math.random()*400)});
}

/*tree.insert({x: 250 + (1 * 10), y: 220 + (0 * 10)});
tree.insert({x: 250 + (2 * 10), y: 220 + (0 * 10)});*/

var t = tree.get({x: 175, y: 100, width: 75, height: 75}, undefined, 0);
console.log(t);