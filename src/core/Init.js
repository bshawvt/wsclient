
var Audio = null;
var Controller = null;
//var UI = null;
	
function init() {

	var canvas = document.createElement('canvas');
	document.body.appendChild(canvas);

	if (isMobile()) {
		canvas.onclick = toggleFullscreen;
		document.addEventListener("fullscreenchange", function(e) {
			//if (window.isFullscreen) window.isFullscreen = false;
			console.log(window.isFullscreen);
		});
	}

	var main = new Main(canvas);
	main.loop(0);
};

function Main(canvas) {
	
	this.components = {canvas: canvas};
	this.metrics = {
		render: {frameTime: 0.0, framesPerSecond: 0, frameRate: 0},
		update: {stepTime: 0.0, stepsPerSecond: 0, stepRate: 0, stepElapsedTime: 0},
		mobile: isMobile()
	};
	this.ui = new UserInterface(this);
	this.net = new Network(this);
	this.game = new Game(this);
	//Audio = new Audio();
	Controller = new Input();

	this.net.connect();
};

Main.prototype.loop = function(dt) {
	if (dt > this.metrics.update.stepTime + 1000) {
		this.metrics.update.stepTime = dt;
		console.log("skipped frame");
	}

	// count steps per second
	if (dt > this.metrics.update.stepElapsedTime + 1000) {
		this.metrics.update.stepElapsedTime = dt;
		this.metrics.update.stepsPerSecond = this.metrics.update.stepRate;
		this.metrics.update.stepRate = 0;

		/*if (Config.consoleCheck) {
			var r = false;
			var t = /./;
			t.toString = function() { // firefox check
				r = true;
			}
			// chrome check
			var d = document.createElement('br');
			Object.defineProperty(d, "id", {get: () => { r = true; }});
			console.log(d, t, "the clear is for this spam lel");
			console.clear(); // clearing spam from the previous log
			if (r == true) { 
				document.body.innerHTML += "<span></span>";
				//eval("window.location = 'https://bitbucket.org/bshaw/tjsnetworkbase/src/master/'");
				//eval("'sorry! please dont use the debugger, this is a multiplayer game after all'\n'sauce: https://bitbucket.org/bshaw/tjsnetworkbase/src/master/';\ndebugger;");
				return;
			}
		}*/
	}

	// step
	while(this.metrics.update.stepTime < dt) { // oddwarg loop!
		this.metrics.update.stepTime+=33.333;
		this.game.update(dt, this.metrics);
		this.metrics.update.stepRate++;

		//this.net.sendFrame();
	}

	// count frames per second
	if (dt > this.metrics.render.frameTime + 1000) {
		this.metrics.render.frameTime = dt;
		this.metrics.render.framesPerSecond = this.metrics.render.frameRate;
		this.metrics.render.frameRate = 0;
	}
	this.game.render(dt);
	this.metrics.render.frameRate++;
	
	var self = this;
	window.requestAnimationFrame(function(dt) {self.loop(dt)});
};