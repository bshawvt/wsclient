
function BrickBreaker(opt) {
	this.canvas = opt.canvas || null;
	this.levelRect = this.canvas.getClientRects()[0];
	this.paddle = {x: 150, y: 360, width: 100, height: 10, color: "#ff00ff"}
	//this.balls = [{x: 200, y: 200, radius: 5, color: "#ff0000", dir: [0.0, 1.0, 0.0], velocity: [0.0, 5.0, 0.0]}];
	//this.balls = [{x: 200, y: 10, radius: 5, color: "#ff0000", dir: [0.0, 1.0, 0.0], velocity: [0.0, 5.0, 0.0]}];
	//this.balls = [{x: 20, y: 100, radius: 5, color: "#ff0000", dir: [1.0, 0.0, 0.0], velocity: [5.0, 5.0, 0.0]}];
	//this.balls = [{x: 400, y: 100, radius: 5, color: "#ff0000", dir: [1.0, 0.0, 0.0], velocity: [5.0, 5.0, 0.0]}];

	//this.balls = [{/*x: 198, y: 370*/x: 10, y: 390/*x: 200, y: 200*/, radius: 5, color: "#ff0000", dir: [0.0, 1.0, 0.0], velocity: [5.0, 5.0, 0.0]}];
	this.balls = [{x: 198, y: 370, radius: 5, color: "#ff0000", dir: [1.0, -1.0, 0.0], velocity: [5.0, 5.0, 0.0]}];
	this.blocks = [];
	var yoffset = 10;
	for(var i = 0; i<20;i++) { 
		if (i%5 == 0) yoffset += 35;
		this.blocks.push({x: 50 + (i%5) * 60, y: yoffset, width: 50, height: 25, color: "#000fff"}); 
	}
	this.score = 0;
	this.continues = 0;
	this.loop = null;

	this.level = [];
	//this.input = new Input();
	//console.log(this.canvas);
}
BrickBreaker.prototype.init = function() {
	var self = this;
	this.loop = new Animator(this);
};
BrickBreaker.prototype.quit = function() {
	if (this.loop!==null)
		this.loop.stop();
};
BrickBreaker.prototype.frame = function(dt) {
	
	var self = this;
	this.balls.forEach(function(e) {
		e.x += e.dir[0] * e.velocity[0];
		e.y += e.dir[1] * e.velocity[1];
		//e.z += e.dir[2];

		self.checkBallCollision(e);


	});
	var rect = this.canvas.getClientRects()[0];
	this.paddle.x = Controller.getCursorPosition().x - rect.x - (this.paddle.width / 2);
	//console.log(rect)

	//console.log("???")
	//craw.rect({x: Math.floor(Math.random()*100), y: Math.floor(Math.random()*100), h: 10, w: 10});
};
BrickBreaker.prototype.render = function() {
	craw.set("canvas2d-1");
	craw.clear();

	this.blocks.forEach(function(e) {
		//if (!e.destroyed)
		craw.rect({x: e.x, y: e.y, w: e.width, h: e.height, c: e.color, f: true})
	});
	this.balls.forEach(function(e) {
		craw.circle({x: e.x, y: e.y, r: e.radius, c: e.color, f: true });
	});
	//console.log(this.canvas);
	craw.rect({x: this.paddle.x, y: this.paddle.y, w: this.paddle.width, h: this.paddle.height, c: "#ff00ff", f: true})
	
	// flushing here just cuz
	var tmp = [];
	for(var i = 0; i < this.blocks.length; i++) {
		var e = this.blocks[i];
		if (!e.destroyed) {
			tmp.push(e);
		}
	}
	//console.log(tmp);
	//console.log(this.blocks);
	this.blocks = tmp;

};
BrickBreaker.prototype.checkBallCollision = function(ball) {
	var self = this;
	for(var i = 0; i < this.blocks.length; i++) {
		var e = this.blocks[i];
		if (!e.destroyed && this.intersectRR(ball, e)) {
			e.destroyed = true;
			// get which side the ball collided with
			var t = this.rectEdgeIntersect(ball, e);
			console.log(t);
			/*if (from.dir[1] > 0) {
				from.dir[1] = -1.0;
			}
			else if (from.dir[1] < 0) {
				from.dir[1] = 1.0;
			}*/
		}
	}

	if (this.intersectRR(ball, this.paddle)) {
		if (ball.dir[1] > 0) {
			ball.dir[1] = -1.0;
			//console.log(from.x - this.paddle.x);
			ball.dir[0] = Math.cos((ball.x - this.paddle.x) * this.paddle.width);
		}
		else if (ball.dir[1] < 0) {
			ball.dir[1] = 1.0;
			ball.dir[0] = Math.cos(ball.x - this.paddle.x);
		}

	}

	// bounce balls around level border
	if (ball.x > this.levelRect.width) {
		ball.dir[0] = -1.0;
	}

	if (ball.x < 0) {
		ball.dir[0] = 1.0;
	}

	if (ball.y > this.levelRect.height) {
		ball.dir[1] = -1.0;		
	}
	if (ball.y < 0) {
		ball.dir[1] = 1.0;
	}

};
BrickBreaker.prototype.rectEdgeIntersect = function(area, div) {
	// gets edge that area has intersected with div
	if (area.width === undefined || area.height === undefined) {
		area.width = 0;
		area.height = 0;
	}
	if (div.width === undefined || div.height === undefined) {
		div.width = 0;
		div.height = 0;
	}

	if (area.radius !== undefined) {
		area.width = area.radius/2;
		area.height = area.radius/2;
	}
	if (div.radius !== undefined) {
		div.width = div.radius/2;
		div.height = div.radius/2;
	}

	var aMinX = area.x;
	var aMaxX = area.x + area.width;
	var aMinY = area.y;
	var aMaxY = area.y + area.height;

	var bMinX = div.x;
	var bMaxX = div.x + div.width;
	var bMinY = div.y;
	var bMaxY = div.y + div.height;

	/*if (this.intersect(area, {x:div.x, y:div.y, width: 1, height: div.height})) return 1; // left
	if (this.intersect(area, {x:div.x, y:div.y, width: div.width, height: 1})) return 2; // top 
	if (this.intersect(area, {x:div.x+div.width, y:div.y, width: 1, height: div.height})) return 3; // right
	if (this.intersect(area, {x:div.x, y:div.y + div.height, width: div.width, height: 1})) return 4; // bottom*/
	if (aMinX <= bMinX && aMinX >= bMinX) return 1; // left
	if (aMinY <= bMinY && aMinY >= bMinY) return 2; // top
	if (aMaxX <= bMaxX && aMaxX >= bMaxX) return 3; // right
	if (aMaxY <= bMaxY && aMaxY >= bMaxY) return 4; // bottom
	console.log(area, div)
	console.log(aMinX, aMaxX, aMinY, aMaxY)
	console.log(aMinX, aMaxX, aMinY, aMaxY)
	console.log(aMaxX, aM)
	return 0; // none

};
BrickBreaker.prototype.intersect = function(area, div) {
	// rect vs rect or point
	if (area.width === undefined || area.height === undefined) {
		area.width = 0;
		area.height = 0;
	}
	if (div.width === undefined || div.height === undefined) {
		div.width = 0;
		div.height = 0;
	}

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
BrickBreaker.prototype.intersectRR = function(area, div) {
	// todo: rect vs circle test
	if (area.width === undefined || area.height === undefined) {
		area.width = 0;
		area.height = 0;
	}
	if (div.width === undefined || div.height === undefined) {
		div.width = 0;
		div.height = 0;
	}

	if (area.radius !== undefined) {
		area.width = area.radius/2;
		area.height = area.radius/2;
	}
	if (div.radius !== undefined) {
		div.width = div.radius/2;
		div.height = div.radius/2;
	}

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
if (debug!==undefined)
	debug.quit();

var opt = { canvas: document.getElementById("canvas2d-1") };
//var opt = {};
var debug = new BrickBreaker(opt);
debug.init();