function QuadTree(opt, depth, root) {
	
	if (root == null) {
		this.root = this;
		this.root.MaxDepth = 5;
		this.root.MaxPoints = 2;
	}

	else {
		this.root = root;
	}

	this.divisions = [null, null, null, null];
	this.contents = [];

	this.subdivided = 0;
	this.depth = depth || 0;

	this.x = opt.x || 0;
	this.y = opt.y || 0;
	this.height = opt.height || 200;
	this.width = opt.width || 200;
	
	craw.rect({x: this.x, y: this.y, w: this.width, h: this.height,
		c: opt.color ? opt.color : "#ff0000"}
	);
	//console.log(this.depth);

};

QuadTree.prototype.contains = function(point) {
	if ((point.x >= this.x && point.x <= this.x + this.width) && 
		(point.y >= this.y && point.y <= this.y + this.height)) {
		return true;
	}
	return false;
};

QuadTree.prototype.quadWillContain = function(aabb, point) {

	if ((point.x >= aabb.x && point.x <= aabb.x + aabb.width) && 
		(point.y >= aabb.y && point.y <= aabb.y + aabb.height)) {
		return true;
	}
	return false;

};

QuadTree.prototype._insert = function(point) {
	craw.circle({x: point.x, y: point.y, r: 2});
	//console.log("insert:", this);
	this.contents.push(point);
};

QuadTree.prototype.insert = function(point) {
	
	if (this.depth < this.root.MaxDepth) {
		var depth = this.depth+1;
		var width = this.width/2;
		var height = this.height/2;
		var nw = {x: this.x, 			y: this.y,				width: width, height: height};
		var ne = {x: this.x + width, 	y: this.y,				width: width, height: height};
		var sw = {x: this.x, 			y: this.y + height, 	width: width, height: height};
		var se = {x: this.x + width, 	y: this.y + height, 	width: width, height: height};
		
		if (this.quadWillContain(nw, point)) {
			if (this.divisions[0] === null) {
				this.divisions[0] = new QuadTree(nw, depth, this.root);
				this.subdivided = true;
			}
			this.divisions[0].insert(point);
		}
		else if (this.quadWillContain(ne, point)) {
			if (this.divisions[1] === null) {
				this.divisions[1] = new QuadTree(ne, depth, this.root);
				this.subdivided = true;
			}
			this.divisions[1].insert(point);
		}
		else if (this.quadWillContain(sw, point)) {
			if (this.divisions[2] === null) {
				this.divisions[2] = new QuadTree(sw, depth, this.root);
				this.subdivided = true;
			}
			this.divisions[2].insert(point);
		}
		else if (this.quadWillContain(se, point)) {
			if (this.divisions[3] === null) {
				this.divisions[3] = new QuadTree(se, depth, this.root);
				this.subdivided = true;
			}
			this.divisions[3].insert(point);
		}		
	}
	else {

		this._insert(point);
		//console.log(this);
	}
};

QuadTree.prototype.get = function(area, array, suppress) {
	
	var search = [];
	if (array !== undefined) search = array;
	craw.rect({x: area.x, y: area.y, h: area.height, w: area.width});

	for(var i = 0; i < 4; i++) {
		var div = this.divisions[i];
		//var div = {x: 125, y: 125, width: 100, height: 100};

		if (div == null) continue;
		if (this.intersect(area, div)) {
			var d = div.contents;
			console.log(d.length);
			if (d.length > 0) {
				var self = this;
				d.forEach(function(e) {
					if (self.quadWillContain(area, e)) {
						search.push(e);
						craw.circle({x:e.x, y:e.y, r: 4, c: "#0000ff"})
					}
					else
						craw.circle({x:e.x, y:e.y, r: 5})
				});
			}
			if (this.subdivided) {
				var more = div.get(area, search);
				//console.log("ss", more);
				//if (more.length > 0)
					//search = search.concat(more);
			}
		}
		//search = search.concat(div.contents);
		//console.log(search, d);

	}
	return search;

};
QuadTree.prototype.intersect = function(area, div) {
	if (div.width === undefined || div.height === undefined) {
		div.width = 1;
		div.height = 1;
	}
	/*if ((area.x >= div.x && area.x <= div.x + div.width ||
			area.x + area.width >= div.x && area.x + area.width <= div.x + div.width) &&
			(area.y >= div.y && area.y <= div.y + div.height ||
			area.y + area.height >= div.y && area.y + area.height <= div.y + div.height)) {
		return true;
	}
	return false;*/
	var aMinX = area.x;
	var aMaxX = area.x + area.width;
	var aMinY = area.y;
	var aMaxY = area.y + area.height;

	var bMinX = div.x;
	var bMaxX = div.x + div.width;
	var bMinY = div.y;
	var bMaxY = div.y + div.height;
	return (aMinX <= bMaxX && aMaxX >= bMinX) && (aMinY <= bMaxY && aMaxY >= bMinY);
};
/*
QuadTree.prototype.subdivide = function(depth) {
	
	this.subdivided = true;
	this.divisions[0] = new QuadTree({depth: depth, root: this.root, x: this.x, 				y: this.y, 				size: this.s/2, color: "#ff0fff"});
	this.divisions[1] = new QuadTree({depth: depth, root: this.root, x: this.x + (this.s/2), 	y: this.y, 				size: this.s/2, color: "#ff0fff"});
	this.divisions[2] = new QuadTree({depth: depth, root: this.root, x: this.x, 				y: this.y + (this.s/2), size: this.s/2, color: "#ff0fff"});
	this.divisions[3] = new QuadTree({depth: depth, root: this.root, x: this.x + (this.s/2), 	y: this.y + (this.s/2), size: this.s/2, color: "#ff0fff"});

};*/

craw.set("canvas2d-1");
craw.clear();
var tree = new QuadTree({width: 400, height: 400});

for(var i = 0; i < 100; i++) {
	//tree.insert({x: 250 + (i * 10), y: 220 + (i * 10)});
	tree.insert({x: Math.floor(Math.random()*400), y: Math.floor(Math.random()*400)});
}

/*tree.insert({x: 250 + (1 * 10), y: 220 + (0 * 10)});
tree.insert({x: 250 + (2 * 10), y: 220 + (0 * 10)});*/

var t = tree.get({x: 65, y: 80, width: 75, height: 75}, undefined, 0);
console.log(t);
/*tree.get({x: 100, y: 170, width: 45, height: 30}, undefined, 1);
tree.get({x: 160, y: 160, width: 45, height: 30}, undefined, 1);
tree.get({x: 200, y: 110, width: 45, height: 30}, undefined, 1);*/
/*tree.insert({x: 250 + (3 * 10), y: 220 + (0 * 10)});
tree.insert({x: 250 + (4 * 10), y: 220 + (0 * 10)});
tree.insert({x: 270 + (5 * 10), y: 220 + (0 * 10)});

tree.insert({x: 250 + (5 * 10), y: 220 + (0 * 10)});
tree.insert({x: 250 + (5 * 10), y: 220 + (0 * 10)});
tree.insert({x: 250 + (5 * 10), y: 220 + (0 * 10)});*/
/*tree.insert({x: 250 + (5 * 10), y: 220 + (0 * 10)});
tree.insert({x: 250 + (5 * 10), y: 220 + (0 * 10)});

tree.insert({x: 250 + (5 * 10), y: 220 + (0 * 10)});
tree.insert({x: 250 + (5 * 10), y: 220 + (0 * 10)});
tree.insert({x: 250 + (5 * 10), y: 220 + (0 * 10)});
tree.insert({x: 250 + (5 * 10), y: 220 + (0 * 10)});
tree.insert({x: 250 + (5 * 10), y: 220 + (0 * 10)});*/

//console.log(tree);