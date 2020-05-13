function GridThing(x, y, width, height, cellSize, objects) {
	this.cells = [];
	craw.rect({x: x, y: y, w: width, h: height, c: "#000"});

	this.build(objects);
}

GridThing.prototype.get = function(bb) {
	craw.rect({x: bb.x, y: bb.y, w: bb.xscale, h: bb.yscale, c: "#ff0000"});
};

GridThing.prototype.build = function(objects) {
	for(var i = 0; i < objects.length; i++) {
		var item = objects[i];
		
		var x = Math.floor(item.bb.x);
		var y = Math.floor(item.bb.y);
		var width = Math.floor(item.bb.xscale);
		var height = Math.floor(item.bb.yscale);

		if (this.cells[x] === undefined) {
			this.cells[x] = [];
			this.cells[x][y] = {};
			craw.rect({x: });
		}

		craw.rect({x: item.bb.x, y: item.bb.y, w: item.bb.xscale, h: item.bb.yscale, c: "#00ff00", f: true});
	}
};

var width = 100;
var height = 100;

var cells1d = [];
for (var i = 0; i < width * height; i++) cells1d[i] = {x: Math.floor(i % width + 1), y: Math.floor(i / height + 1) };

var cells2d = [];
for (var x = 0; x < width; x++) { 
	for(var y = 0; y < height; y++) {
		cells2d[x] = [];
		cells2d[y] = {x: x, y: y};
	}
}

console.log(cells1d);
console.log(cells2d);
var x = 2;
var y = 4;

var width = 4;
var height = 4;

var i = (x * y) + (y + 1);
console.log(i);
console.log(cells[i]);


var p = new Profiler();
p.start();

for(var i = 0; i < cells.length; i++) {
	console.log(cells1d[i]);
}

console.log(p.stop() + "ms elapsed");