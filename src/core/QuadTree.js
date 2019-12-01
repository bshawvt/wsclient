function QuadTree(parent) {

	parent = parent || {};
	this.x = parent.x || 0;
	this.y = parent.y || 0;
	this.s = parent.s || 400;

	this.contents = [];
	this.capacity = parent.capacity || 2;

	this.divisions = [null, null, null, null];
	this.subdivided = false;

	craw.rect({x: this.x, y: this.y, w: this.s, h: this.s});
	//console.log(this);
}

QuadTree.prototype.subdivide = function(object) {
	this.subdivided = true;
	this.divisions[0] = new QuadTree({x: this.x, y: this.y, s: this.s / 2});
	this.divisions[1] = new QuadTree({x: this.x + (this.s / 2), y: this.y, s: this.s / 2});
	this.divisions[2] = new QuadTree({x: this.x, y: this.y + (this.s / 2), s: this.s / 2});
	this.divisions[3] = new QuadTree({x: this.x + (this.s / 2), y: this.y + (this.s / 2), s: this.s / 2});


};
QuadTree.prototype.contains = function(object) {
	if (object.x >= this.x && object.x <= this.x + this.s &&	
			object.y >= this.y && object.y <= this.y + this.s) {
		return true;
	}
	return false;
};
QuadTree.prototype.push = function(object) {
	
	if (!this.contains(object)) return;

	if (this.contents.length <= this.capacity) {
		this.contents.push(object);
	}
	else { 
		if (!this.subdivided)
			this.subdivide();

		if (this.divisions[0].contains(object)) {
			this.divisions[0].push(object)
		}
		else if (this.divisions[1].contains(object)) {
			this.divisions[1].push(object)
		}
		else if (this.divisions[2].contains(object)) {
			this.divisions[2].push(object)
		}
		else {
			this.divisions[3].push(object);
		}
		
	}

	craw.circle({x: object.x, y: object.y, r: 2, f: true, c: "#ff0000"});

};
QuadTree.prototype.get = function(rect, array) {
	var gets = [];
	if (array !== undefined)
		gets = array;
	rect.c = "#0fff10";
	rect.weight = 4;
	craw.rect(rect);

	if (!(	rect.x - rect.s > this.x + this.s || rect.x + rect.s < this.x - this.s ||
			rect.y - rect.s > this.y + this.s || rect.y + rect.s < this.y - this.s)) {

		this.contents.forEach((item) => {
			//gets.push(item);
			if (item.x >= rect.x && item.x <= rect.x + rect.s &&	
				item.y >= rect.y && item.y <= rect.y + rect.s) {
				gets.push(item);
			}
		});

		if (this.subdivided) {
			gets = this.divisions[0].get(rect, gets);
			gets = this.divisions[1].get(rect, gets);
			gets = this.divisions[2].get(rect, gets);
			gets = this.divisions[3].get(rect, gets);
		}

	}

	for(var i = 0; i < gets.length; i++) {
		var item = gets[i];
		craw.circle(item);
	}

	return gets;
};

//new QuadTree();
//new QuadTree();

craw.set("canvas2d-1")
			craw.clear(); 
			var t = new QuadTree(); 
			for(var i = 0; i < 25; i++) {
				t.push({x: 20 + (i * 5) + 25, y: 35});
			}
			t.get({x: 60, y: 15, w: 75, h: 75, s: 75});

			craw.set("canvas2d-2")
			craw.clear(); 
			var t = new QuadTree(); 
			for(var i = 0; i < 100; i++) {
				t.push({ x: Math.floor(Math.random() * 300), y: Math.floor(Math.random() * 300) });
			}
			t.get({x: 60, y: 15, w: 75, h: 75, s: 75});