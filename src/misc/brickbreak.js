
function BrickBreaker(opt) {

	this.TimeStep = 1000/30;

	this.canvas = document.getElementById("canvas2d_game");
	this.levelRect = this.canvas.getClientRects()[0];
	this.paddle = {x: 150, y: 350, width: 50, height: 10, color: "#ff00ff"};

	this.balls = [];
	for(var i = 0; i<1; i++)
		this.balls.push({x: 198, y: 280, radius: 5, color: "#ff0000", dir: [ -1 + Math.random() * 2 , -1.0, 0.0], velocity: [5.0, 5.0, 0.0]});

	//this.balls = [{x: 198, y: 370, radius: 5, color: "#ff0000", dir: [1.0, -1.0, 0.0], velocity: [5.0, 5.0, 0.0]}];
	this.blocks = [];
	this.powerups = [];
	/*var yoffset = 10;
	for(var i = 0; i<40;i++) { 
		if (i%10 == 0) yoffset += 25;
		this.blocks.push({x: 25 + (i%10) * 35, y: yoffset, width: 30, height: 20, color: "#000fff"}); 
	}*/
	this.score = 0;
	this.continues = 0;
	this.loop = null;

	this.level = [];

	this.started = false;
	this.gameover = false;
	this.continues = 3;
	this.score = 0;

	var f1 = [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), 1.0];
	var f2 = [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), 1.0];
	var f3 = [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), 1.0];

	// border colors
	this.rc = Math.floor(Math.random() * 255); this.rcc = 1 + Math.floor(Math.random() * 5);
	this.gc = Math.floor(Math.random() * 255); this.gcc = 1 + Math.floor(Math.random() * 5);
	this.bc = Math.floor(Math.random() * 255); this.bcc = 1 + Math.floor(Math.random() * 5);

	this.level["404"] = [
		// 4
		{x: 35 + (0 * 35), y: 35 + (0 * 25), width: 30, height: 20, color: [f1[0], f1[1], f1[2], f1[3]], hits: 2, maxHits: 2},
		{x: 35 + (0 * 35), y: 35 + (1 * 25), width: 30, height: 20, color: [f1[0], f1[1], f1[2], f1[3]], hits: 2, maxHits: 2},
		{x: 35 + (0 * 35), y: 35 + (2 * 25), width: 30, height: 20, color: [f1[0], f1[1], f1[2], f1[3]], hits: 2, maxHits: 2},
		{x: 35 + (0 * 35), y: 35 + (3 * 25), width: 30, height: 20, color: [f1[0], f1[1], f1[2], f1[3]], hits: 2, maxHits: 2},

		{x: 35 + (1 * 35), y: 35 + (3 * 25), width: 30, height: 20, color: [f1[0], f1[1], f1[2], f1[3]], hits: 2, maxHits: 2},

		{x: 35 + (2 * 35), y: 35 + (0 * 25), width: 30, height: 20, color: [f1[0], f1[1], f1[2], f1[3]], hits: 2, maxHits: 2},
		{x: 35 + (2 * 35), y: 35 + (1 * 25), width: 30, height: 20, color: [f1[0], f1[1], f1[2], f1[3]], hits: 2, maxHits: 2},
		{x: 35 + (2 * 35), y: 35 + (2 * 25), width: 30, height: 20, color: [f1[0], f1[1], f1[2], f1[3]], hits: 2, maxHits: 2},
		{x: 35 + (2 * 35), y: 35 + (3 * 25), width: 30, height: 20, color: [f1[0], f1[1], f1[2], f1[3]], hits: 2, maxHits: 2},
		{x: 35 + (2 * 35), y: 35 + (4 * 25), width: 30, height: 20, color: [f1[0], f1[1], f1[2], f1[3]], hits: 2, maxHits: 2},
		{x: 35 + (2 * 35), y: 35 + (5 * 25), width: 30, height: 20, color: [f1[0], f1[1], f1[2], f1[3]], hits: 2, maxHits: 2},

		// 0
		{x: 10 + (4 * 35), y: 35 + (0 * 25), width: 30, height: 20, color: [f2[0], f2[1], f2[2], f2[3]], hits: 2, maxHits: 2},
		{x: 10 + (4 * 35), y: 35 + (1 * 25), width: 30, height: 20, color: [f2[0], f2[1], f2[2], f2[3]], hits: 2, maxHits: 2},
		{x: 10 + (4 * 35), y: 35 + (2 * 25), width: 30, height: 20, color: [f2[0], f2[1], f2[2], f2[3]], hits: 2, maxHits: 2},
		{x: 10 + (4 * 35), y: 35 + (3 * 25), width: 30, height: 20, color: [f2[0], f2[1], f2[2], f2[3]], hits: 2, maxHits: 2},
		{x: 10 + (4 * 35), y: 35 + (4 * 25), width: 30, height: 20, color: [f2[0], f2[1], f2[2], f2[3]], hits: 2, maxHits: 2},
		{x: 10 + (4 * 35), y: 35 + (5 * 25), width: 30, height: 20, color: [f2[0], f2[1], f2[2], f2[3]], hits: 2, maxHits: 2},

		{x: 10 + (5 * 35), y: 35 + (5 * 25), width: 30, height: 20, color: [f2[0], f2[1], f2[2], f2[3]], hits: 2, maxHits: 2},
		{x: 10 + (5 * 35), y: 35 + (0 * 25), width: 30, height: 20, color: [f2[0], f2[1], f2[2], f2[3]], hits: 2, maxHits: 2},

		{x: 10 + (6 * 35), y: 35 + (0 * 25), width: 30, height: 20, color: [f2[0], f2[1], f2[2], f2[3]], hits: 2, maxHits: 2},
		{x: 10 + (6 * 35), y: 35 + (1 * 25), width: 30, height: 20, color: [f2[0], f2[1], f2[2], f2[3]], hits: 2, maxHits: 2},
		{x: 10 + (6 * 35), y: 35 + (2 * 25), width: 30, height: 20, color: [f2[0], f2[1], f2[2], f2[3]], hits: 2, maxHits: 2},
		{x: 10 + (6 * 35), y: 35 + (3 * 25), width: 30, height: 20, color: [f2[0], f2[1], f2[2], f2[3]], hits: 2, maxHits: 2},
		{x: 10 + (6 * 35), y: 35 + (4 * 25), width: 30, height: 20, color: [f2[0], f2[1], f2[2], f2[3]], hits: 2, maxHits: 2},
		{x: 10 + (6 * 35), y: 35 + (5 * 25), width: 30, height: 20, color: [f2[0], f2[1], f2[2], f2[3]], hits: 2, maxHits: 2},

		// 4
		{x: 20 + (7 * 35), y: 35 + (0 * 25), width: 30, height: 20, color: [f3[0], f3[1], f3[2], f3[3]], hits: 2, maxHits: 2},
		{x: 20 + (7 * 35), y: 35 + (1 * 25), width: 30, height: 20, color: [f3[0], f3[1], f3[2], f3[3]], hits: 2, maxHits: 2},
		{x: 20 + (7 * 35), y: 35 + (2 * 25), width: 30, height: 20, color: [f3[0], f3[1], f3[2], f3[3]], hits: 2, maxHits: 2},
		{x: 20 + (7 * 35), y: 35 + (3 * 25), width: 30, height: 20, color: [f3[0], f3[1], f3[2], f3[3]], hits: 2, maxHits: 2},

		{x: 20 + (8 * 35), y: 35 + (3 * 25), width: 30, height: 20, color: [f3[0], f3[1], f3[2], f3[3]], hits: 2, maxHits: 2},

		{x: 20 + (9 * 35), y: 35 + (0 * 25), width: 30, height: 20, color: [f3[0], f3[1], f3[2], f3[3]], hits: 2, maxHits: 2},
		{x: 20 + (9 * 35), y: 35 + (1 * 25), width: 30, height: 20, color: [f3[0], f3[1], f3[2], f3[3]], hits: 2, maxHits: 2},
		{x: 20 + (9 * 35), y: 35 + (2 * 25), width: 30, height: 20, color: [f3[0], f3[1], f3[2], f3[3]], hits: 2, maxHits: 2},
		{x: 20 + (9 * 35), y: 35 + (3 * 25), width: 30, height: 20, color: [f3[0], f3[1], f3[2], f3[3]], hits: 2, maxHits: 2},
		{x: 20 + (9 * 35), y: 35 + (4 * 25), width: 30, height: 20, color: [f3[0], f3[1], f3[2], f3[3]], hits: 2, maxHits: 2},
		{x: 20 + (9 * 35), y: 35 + (5 * 25), width: 30, height: 20, color: [f3[0], f3[1], f3[2], f3[3]], hits: 2, maxHits: 2},
	];

	//if (opt.level !== undefined) {
		if (opt.level === "404") {
			for(var i = 0; i < this.level["404"].length; i++) {
				var element = this.level["404"][i];
				this.blocks.push(element);
			}
		}
		else {
			var yoffset = 10;
			for(var i = 0; i<40;i++) { 
				if (i%10 == 0) yoffset += 25;
				this.blocks.push({x: 25 + (i%10) * 35, y: yoffset, width: 30, height: 20, color: [f3[0], f3[1], f3[2], f3[3]], hits: 2, maxHits: 2}); 
			}
		}
	//}
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
	var rect = this.canvas.getClientRects()[0];
	console.log("asdasdasd");

	if (this.started)  {
		if (this.blocks.length == 0) {
			this.gameover = true;
		}
		if (this.balls.length == 0) { 
			this.started = false;
			this.gameover = true;
		}

		var self = this;
		this.balls.forEach(function(e) {
			e.x += e.dir[0] * e.velocity[0];
			e.y += e.dir[1] * e.velocity[1];
			//e.z += e.dir[2];

			self.checkBallCollision(e);


		});

		this.powerups.forEach(function(e) {

			e.y+= e.velocity[1];

			if (self.intersectRR(e, self.paddle)) {
				if (!e.destroyed) {
					e.destroyed = true;
					//console.log(e, e.color);
					// todo: move powerup gen/effect to its own method
					if (e.color[0] == 255) {
						var rng = Math.floor(Math.random()*5);
						self.score += 1000;
						switch (rng) {
							case 0:{
								self.paddle.width-=5;
								if (self.paddle.width <= 5) self.paddle.width = 5;
								break;
							}
							case 1:{
								self.balls.forEach(function(e) {
									
									e.radius -= 2;
									if (e.radius <= 2) e.radius = 2;
								});
								break;
							}
							case 2:{
								self.balls.forEach(function(e) {
									var coin = Math.floor(Math.random() * 2);
									if (coin == 0) { return; }
									e.velocity[0] += 5;
									e.velocity[1] += 5;
									if (e.velocity[0] > 20) e.velocity[0] = 20;
									if (e.velocity[1] > 20) e.velocity[1] = 20;
								});
								break;
							}
							case 3:{
								self.balls.forEach(function(e) {
									
									e.radius -= 2;
									if (e.radius <= 2) e.radius = 2;
								});
								break;
							}
							default: {
								self.paddle.width-=1;
								if (self.paddle.width <= 5) self.paddle.width = 5;
								break;
							}
						}
					}
					else if (e.color[1] == 255) {
						var rng = Math.floor(Math.random()*5);
						switch (rng) {
							case 0:{
								self.paddle.width+=5;
								//if (self.paddle.width <= 5) self.paddle.width = 5;
								break;
							}
							case 1:{
								var newBall = {x: 198, y: 350, radius: 5, color: "#ff0000", dir: [ -1 + Math.random() * 2 , -1.0, 0.0], velocity: [5.0, 5.0, 0.0]};
								self.balls.push(newBall)
								break;
							}
							case 2:{ 
								self.continues++;
								self.balls.forEach(function(e) {
									e.velocity[0] = 5;
									e.velocity[1] = 5;
									if (e.radius < 5) e.radius = 5;
								});
								break;
							}
							case 3:{
								self.balls.forEach(function(e) {
									var coin = Math.floor(Math.random() * 2);
									//if (coin) {
										e.radius += 2;
										if (e.radius >= 10) e.radius = 10;
										//return;
									//}
								});
								break;
							}
							default: {
								self.paddle.width+=15;
								//if (self.paddle.width <= 5) self.paddle.width = 5;
								break;
							}
						}
					}

				}
			}

		});

	}

	else if (this.started == false && !this.gameover) {
		//console.log(this.balls.length);
		if (this.balls.length == 0) return;
		this.balls[0].x = Controller.getCursorPosition().x - rect.x;
		this.balls[0].y = 335;
		if (Controller.getMouseState(Input.MOUSE_LEFT)) {
			this.started = true;
		}
	}
	//var rect = this.canvas.getClientRects()[0];
	this.paddle.x = Math.floor(Controller.getCursorPosition().x - rect.x - (this.paddle.width / 2));

	

	// render steps
	this.rc = (this.rc + this.rcc);
	this.gc = (this.gc + this.gcc);
	this.bc = (this.bc + this.bcc);

	if (this.rc>255)	{ this.rcc = ~this.rcc; this.rc = 255;	};
	if (this.rc<0)		{ this.rcc = ~this.rcc; this.rc = 0;	};
	if (this.gc>255)	{ this.gcc = ~this.gcc; this.gc = 255; }
	if (this.gc<0)		{ this.gcc = ~this.gcc; this.gc = 0; 	};
	if (this.bc>255)	{ this.bcc = ~this.bcc; this.bc = 255; }
	if (this.bc<0)		{ this.bcc = ~this.bcc; this.bc = 0; 	};


};
BrickBreaker.prototype.flush = function() {
	// body...
};
BrickBreaker.prototype.render = function(dt) {
	var self = this;
	craw.set("canvas2d_game");
	craw.clear();

	this.canvas.style.border = "2px solid rgb(" + this.rc + ", " + this.gc + ", " + this.bc + ")";
	//console.log(this.canvas);

	if (!this.started & !this.gameover) 
		craw.text({x: 30, y: 300, text: "Click to start", font: "40px Courier", c: [0, this.gc, this.bc, 1.0]});
	if (this.gameover)
		craw.text({x: 30, y: 300, text: "Game over dude", font: "40px Courier", c: [0, this.gc, this.bc, 1.0]});
	
	this.blocks.forEach(function(e) {

		var red = e.color[0] - (self.rc/2);
		var green = e.color[1] - (self.gc/2);
		var blue = e.color[2] - (self.bc/2);
		var alpha = e.color[3];

		var newc = "rgba(" + red + "," + green  + "," + blue + "," + alpha + ")";

		// canvas performs better when its using whole numbers
		var bX = Math.floor(e.x);
		var bY = Math.floor(e.y);
		var bWidth = Math.floor(e.width);
		var bHeight = Math.floor(e.height);

		craw.rect({x: bX, y: bY, w: bWidth, h: bHeight, c: newc, f: true});

		// show edges
		craw.rect({x: bX, y: bY, w: 1, h: bHeight}); // left
		craw.rect({x: bX, y: bY, w: bWidth, h: 1}); // top 
		craw.rect({x: bX + bWidth - 1, y: bY, w: 1, h: bHeight}); // right
		craw.rect({x: bX, y: bY + bHeight - 1, w: bWidth, h: 1}); // bottom

	});

	this.powerups.forEach(function(e) {
		var bX = Math.floor(e.x);
		var bY = Math.floor(e.y);
		craw.circle({x: bX, y: bY, r: e.radius, c: e.color, f: false});
	});

	this.balls.forEach(function(e) {
		var bX = Math.floor(e.x);
		var bY = Math.floor(e.y);
		craw.circle({x: bX, y: bY, r: e.radius, c: e.color, f: true });

		// show edges
		/*var rads = e.radius/2;
		craw.rect({x: e.x - rads, y: e.y - rads, w: e.radius, h: e.radius});*/
	});

	craw.rect({x: Math.floor(this.paddle.x), y: Math.floor(this.paddle.y), w: Math.floor(this.paddle.width), h: Math.floor(this.paddle.height), c: "#ff00ff", f: true})
	
	craw.text({x: 5, y: 378, text: "Score: " + this.score, font: "18px Impact", c: [0, this.gc, this.bc, 1.0]});
	craw.text({x: 5, y: 395, text: "Continues: " + this.continues, font: "18px Impact", c: [0, this.gc, this.bc, 1.0]});


	// flushing here just cuz
	var tmp1 = [];
	for(var i = 0; i < this.blocks.length; i++) {
		var e = this.blocks[i];
		if (!e.destroyed) {
			tmp1.push(e);
		}
	}
	this.blocks = tmp1;

	var tmp2 = [];
	for(var i = 0; i < this.powerups.length; i++) {
		var e = this.powerups[i];
		if (!e.destroyed) {
			tmp2.push(e);
		}
	}
	this.powerups = tmp2;

	var tmp3 = [];
	for(var i = 0; i < this.balls.length; i++) {
		var e = this.balls[i];
		if (!e.destroyed) {
			tmp3.push(e);
		}
	}
	this.balls = tmp3;

};
BrickBreaker.prototype.checkPaddleCollision = function(paddle) {
	// body...
};
BrickBreaker.prototype.checkBallCollision = function(ball) {
	var self = this;
	for(var i = 0; i < this.blocks.length; i++) {
		var e = this.blocks[i];
		if (!e.destroyed && this.intersectRR(ball, e)) {
			this.score += 200;
			var rng = Math.floor(Math.random() * 2);
			if (rng == 1) {
				var coin = Math.floor(Math.random() * 2);
				var r = 0, g = 0, b = 0;
				if (coin) {
					r = 255;
					g = 0;
				}
				else {
					r = 0;
					g = 255;
				}
				var pup = {x: ball.x, y: ball.y, r: 5, color: [r, g, b, 1.0], velocity: [0.0, 2.5, 0.0 ]};
				this.powerups.push(pup);
			}
			e.hits--;

			e.color[3] = (e.hits/e.maxHits);

			//var newc = "rgb(" + red + "," + green  + "," + blue + "," + alpha + ")";

			// get which side the ball collided with
			var t = this.rectEdgeIntersect(ball, e);
			switch (t) {
				case 1: {
					ball.dir[0] = -1.0;
					break;
				}
				case 2: {
					ball.dir[1] = -1.0;
					break;
				}
				case 3: {
					ball.dir[0] = 1.0;
					break;
				}
				case 4: {
					ball.dir[1] = 1.0;
					break;
				}
				case 0: 
				default: {					
					break;
				}
			}

			if (e.hits <= 0) { 
				e.destroyed = true; 
				this.score += 1100;
			}
			
		}
	}

	if (this.intersectRR(ball, this.paddle)) {
		// todo: 
		ball.dir[0] = Math.cos((ball.x - this.paddle.x) * (this.paddle.width / 2));
		console.log((ball.x - this.paddle.x) * (this.paddle.width / 2));
		if (ball.dir[1] > 0) {
			ball.dir[1] = -1.0;
		}
		else if (ball.dir[1] < 0) {
			ball.dir[1] = 1.0;
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
		if (this.balls.length <= 1) {
			this.started = false;
			this.continues--;
			if (this.continues<0) {
				this.gameover = true;
				this.continues = 0;
			}
		}
		else {
			ball.destroyed = true;
		}	

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
		area.width = area.radius;
		area.height = area.radius;
	}
	if (div.radius !== undefined) {
		div.width = div.radius;
		div.height = div.radius;
	}

	if (this.intersect(area, {x: div.x, y: div.y, width: 2, height: div.height})) return 1; // left
	if (this.intersect(area, {x: div.x, y: div.y, width: div.width, height: 2})) return 2; // top 
	if (this.intersect(area, {x: div.x + div.width, y: div.y, width: 2, height: div.height})) return 3; // right
	if (this.intersect(area, {x: div.x, y: div.y + div.height, width: div.width, height: 2})) return 4; // bottom
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



/*setTimeout(function() {
	var opt = { level: "404" };
	new craw({parent: "content", id: "canvas2d_game"});
	var debug = new BrickBreaker(opt);
	debug.init();
}, 100);*/

/*if (debug!==undefined)
	debug.quit();

new craw({parent: "canvas-1", id: "canvas2d_game"});

var opt = { level: "404a" };
//var opt = {};
var debug = new BrickBreaker(opt);
debug.init();
*/

/*if (typeof app !=="undefined") {
	app.stop();
}

setTimeout(function() {

	new craw({parent: "canvas-1", id: "canvas2d_game"});

	var opt = { canvas: "canvas2d_game" };
	var app = new BrickBreaker(opt);
	app.init();

}, 100);*/

// attempt to load app
if (typeof app !=="undefined") {
	app.quit();
}
var app = undefined;
setTimeout(function() {

	new craw({parent: "canvas-1", id: "canvas2d_game"});

	var opt = { canvas: "canvas2d_game" };
	app = new BrickBreaker(opt);
	app.init();

}, 100);