function QuadTree(maxDepth, x, y, width, height, objects, parent, bb, depth) {
	var self = this;

	if ( parent === undefined) {
		this.constructor_root(maxDepth, x, y, width, height, objects);
	}
	else {
		this.constructor_child(parent, bb, depth);
	}
};

QuadTree.prototype.constructor_root = function(maxDepth, x, y, width, height, objects) {
	var self = this;

	this.root = this;
	this.container = [];
	this.divisions = [null, null, null, null];
	this.divided = false;

	

	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.maxDepth = maxDepth;
	this.depth = 0;

	this.bb = new BoundingBox(x, y, 0, width, height, 0);

	objects.forEach((e) => {
		self.insert(e);
		//craw.rect({x: e.bb.x, y: e.bb.y, w: e.bb.xscale, h: e.bb.yscale, f: true, c:"#ffff00"});
	});
	//craw.rect({x: this.x, y: this.y, w: this.width, h: this.height});
};

QuadTree.prototype.constructor_child = function(parent, bb, depth) {
	var self = this;

	this.root = parent.root;
	this.bb = bb;
	
	this.container = [];
	this.divisions = [null, null, null, null];
	this.maxDepth = this.root.maxDepth;
	this.depth = depth;
	
	this.x = Math.floor(bb.x);
	this.y = Math.floor(bb.y);

	this.width = Math.floor(bb.xscale);
	this.height = Math.floor(bb.yscale);

	this.divided = false;

	//craw.rect({x: this.x, y: this.y, w: this.width, h: this.height});

};

QuadTree.prototype.insert = function(object) {
	if (this.depth < this.maxDepth) {
		var halfWidth = this.width/2;
		var halfHeight = this.height/2;
	

		var bbs = [ new BoundingBox(this.x, 			this.y, 			0, halfWidth, halfHeight, 0), // ne
					new BoundingBox(this.x + halfWidth, this.y, 			0, halfWidth, halfHeight, 0), // nw 
					new BoundingBox(this.x, 			this.y + halfHeight,0, halfWidth, halfHeight, 0), // se
					new BoundingBox(this.x + halfWidth, this.y + halfHeight,0, halfWidth, halfHeight, 0) ];

		var bigBoyCount = 0; // if > 1 then this fits inside multiple quads
		var quad = 0; // the division index that this object would fit in if count is 1
		for(var i = 0; i < 4; i++) {
			if (bigBoyCount > 1) break;
			if (bbs[i].intersect2d(object.bb)) {
				bigBoyCount++;
				quad = i;
			}

		}

		// fits it only one quad
		if (bigBoyCount == 1) {
			if (this.divisions[quad] == null) {
				this.divisions[quad] = new QuadTree(undefined, undefined , undefined, undefined, undefined, undefined, 
				this, bbs[quad], this.depth+1);
			}
			this.divisions[quad].divided = true;
			this.divisions[quad].insert(object); // now try to insert deeper into the tree
		}
		// fits in multiple quads so instead insert in the previous node
		else {
			this.container.push(object);
		}
	}

	else {
		this.container.push(object);
	}
};

QuadTree.prototype.get = function(rectbb, callback) {
	var set = [];
	set = this.get_recurse(rectbb, set, callback);
	return set;
};

QuadTree.prototype.get_recurse = function(rectbb, set) {
	for(var i = 0; i < 4; i++) {
		if (this.divisions[i] != null) {
			if (rectbb.intersect2d(this.divisions[i].bb)) {
				set = set.concat(this.divisions[i].container);
				if (this.divisions[i].divided) {
					this.divisions[i].get_recurse(rectbb, set);
				}
			}

		}
	}
	return set;
}