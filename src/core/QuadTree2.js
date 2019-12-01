function QuadTree(parent) {

	parent = parent || {};
	this.x = parent.x;
	this.y = parent.y;
	this.s = parent.s;

	this.contents = [];
	this.capacity = 1;//parent.capacity || 2;

	this.divisions = [null, null, null, null];
	this.subdivided = false;
	
	craw.rect({x: this.x, y: this.y, w: this.s, h: this.s, c: "#ff00f0"});
	//craw.rect({x: this.x, y: this.y, w: this.s/2, h: this.s/2, c: "#ff00f0"});
	//craw.rect({x: this.x + this.s/2, y: this.y, w: this.s/2, h: this.s/2, c: "#ff00f0"});
	//craw.rect({x: this.x, y: this.y + this.s/2, w: this.s/2, h: this.s/2, c: "#ff00f0"});
	//craw.rect({x: this.x + this.s/2, y: this.y + this.s/2, w: this.s/2, h: this.s/2, c: "#ff00f0"});
	//craw.rect({x: this.x/2, y: this.y/2, w: this.s/2, h: this.s/2, c: "#ff00f0"});*/
	//craw.rect({x: this.x, y: this.y, w: this.s, h: this.s, c: "#ff00f0"});
	//craw.rect({x: this.x, y: this.y, w: this.s, h: this.s, c: "#ff00f0"});
	//craw.rect({x: this.x, y: this.y, w: this.s, h: this.s, c: "#ff00f0"});
	
	console.log("new quad: ", this);
}

QuadTree.prototype.subdivide = function(object) {
	this.subdivided = true;
	this.divisions[0] = new QuadTree({x: this.x, y: this.y, s: this.s / 2});
	this.divisions[1] = new QuadTree({x: this.x + this.s/2, y: this.y, s: this.s / 2});
	this.divisions[2] = new QuadTree({x: this.x, y: this.y + this.s/2, s: this.s / 2});
	this.divisions[3] = new QuadTree({x: this.x + this.s/2, y: this.y + this.s/2, s: this.s / 2});

};
QuadTree.prototype.contains = function(object) {
	if (object.x >= this.x && object.x <= this.x + this.s &&	
			object.y >= this.y && object.y <= this.y + this.s) {
		return true;
	}
	return false;
};
QuadTree.prototype.insert = function(object) {
	console.log(this, object);
	craw.circle({x: object.x, y: object.y, r: 2, f: true, c: "#ff0000"});

	
	

	if (!this.contains(object)) return false;
	
	
	else if (!this.subdivided) {
			this.subdivide();
	}
	if (this.contents.length < this.capacity) {
		this.contents.push(object);
		return true;
	}
	if (this.subdivided) {
		if (this.divisions[0].insert(object)) {
			//craw.rect({x: this.divisions[0].x/2, y: this.divisions[0].y/2, w: this.divisions[0].s/2, h: this.divisions[0].s/2});
			return true;
		}
		if (this.divisions[1].insert(object)) {
			//craw.rect({x: this.divisions[1].x/2, y: this.divisions[1].y/2, w: this.divisions[1].s/2, h: this.divisions[1].s/2});
			return true;
		}
		if (this.divisions[2].insert(object)) {
			//craw.rect({x: this.divisions[2].x/2, y: this.divisions[2].y/2, w: this.divisions[2].s/2, h: this.divisions[2].s/2});
			return true;
		}
		if (this.divisions[3].insert(object)) {
			//craw.rect({x: this.divisions[3].x/2, y: this.divisions[3].y/2, w: this.divisions[3].s/2, h: this.divisions[3].s/2});
			return true;
		}
	}

	

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
				gets.insert(item);
			}
			else {
				craw.circle({x: item.x, y: item.y, c: "#00ffff", weight: 2});
			}
		});

		if (this.subdivided) {
			gets.join(this.divisions[0].get(rect, gets));
			gets.join(this.divisions[1].get(rect, gets));
			gets.join(this.divisions[2].get(rect, gets));
			gets.join(this.divisions[3].get(rect, gets));
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
var t = new QuadTree({x: 0, y: 0, s: 400});
t.insert({x: 10 + (0 * 5), y: 140});
t.insert({x: 10 + (1 * 5), y: 140});
t.insert({x: 10 + (2 * 5), y: 140});
t.insert({x: 10 + (3 * 5), y: 140});
t.insert({x: 10 + (4 * 5), y: 140});
t.insert({x: 10 + (5 * 5), y: 140});
t.insert({x: 10 + (6 * 5), y: 140});
t.insert({x: 10 + (7 * 5), y: 140});
/*for(var i = 0; i < 4; i++) {
	t.push({x: 10 + (i * 5), y: 140});
	t.push({x: 10 + (i * 5), y: 120});
}*/
t.get({x: 60, y: 15, w: 75, h: 75, s: 75});
/*
craw.set("canvas2d-2")
craw.clear(); 
var t = new QuadTree({x: 0, y: 0, s: 400}); 
for(var i = 0; i < 100; i++) {
	t.push({ x: Math.floor(Math.random() * 400), y: Math.floor(Math.random() * 300) });
}
t.get({x: 60, y: 15, w: 75, h: 75, s: 75});
*/
//console.log(c, t);