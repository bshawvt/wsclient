/*	oddwarg loop! 
	param: target - expects an object with a frame, render and flush method */
function Animator(target) {
	var self = this;

	if (target.render === undefined || target.frame === undefined || target.flush === undefined) {
		console.error("Animator error: target is missing required frame, flush and/or render methods ");
		return;
	}

	this.dt = (new Date()).getTime();
	this.done = false;

	this.animate = function(timestamp) {
		if (self.done) return;

		var now = (new Date()).getTime();
		
		target.flush();

		while (self.dt < now) {
			target.frame(self.dt);
			self.dt += target.timeStep;
		}

		target.render(self.dt);
		window.requestAnimationFrame(function(timestamp) {
			self.animate(timestamp)
		});
	};
	console.log(target);
	// start looping
	this.animate(0);
};
/* interupts animate loop */
Animator.prototype.stop = function() {
	this.done = true;
};
/*
	static class full of bad math
*/
function BadMath() {
	
}
BadMath.intersect = function(a, b) {
	// rect vs rect or point
	if (a.width === undefined || a.height === undefined) {
		a.width = 2;
		a.height = 2;
	}
	if (b.width === undefined || b.height === undefined) {
		b.width = 2;
		b.height = 2;
	}

	var aMinX = a.x;
	var aMaxX = a.x + a.width;
	var aMinY = a.y;
	var aMaxY = a.y + a.height;

	var bMinX = b.x;
	var bMaxX = b.x + b.width;
	var bMinY = b.y;
	var bMaxY = b.y + b.height;
	return (aMinX <= bMaxX && aMaxX >= bMinX) && (aMinY <= bMaxY && aMaxY >= bMinY);
};

function Bitmask() {
	this.mask = 0;
}
Bitmask.prototype.add = function(x) {
	return this.mask |= x;
}
Bitmask.prototype.sub = function(x) {
	return this.mask &= ~x;
}
Bitmask.prototype.get = function() {
	return this.mask;
}
Bitmask.prototype.compare = function(x) {
	return this.mask & x;
}
Bitmask.prototype.clear = function() {
	this.mask = 0;
}

Bitmask.prototype.pushState = function(state) {
	this.mask = state;
};
Bitmask.prototype.setState = function(state, active) {
	if (active === true) {
		this.add(state);
	}
	else {
		this.sub(state);
	}
};

/* bits and masks

[1 ]	bits |= 1
[2 ]	bits |= 2
[3 ]	bits |= 4
[4 ]	bits |= 8
[5 ]	bits |= 16
[6 ]	bits |= 32
[7 ]	bits |= 64
[8 ]	bits |= 128
[9 ]	bits |= 256
[10]	bits |= 512
[11]	bits |= 1024
[12]	bits |= 2048
[13]	bits |= 4096
[14]	bits |= 8192
[15]	bits |= 16384
[16]	bits |= 32768
[17]	bits |= 65536
[18]	bits |= 131072
[19]	bits |= 262144
[20]	bits |= 524288
[21]	bits |= 1048576
[22]	bits |= 2097152
[23]	bits |= 4194304
[24]	bits |= 8388608
[25]	bits |= 16777216
[26]	bits |= 33554432
[27]	bits |= 67108864
[28]	bits |= 134217728
[29]	bits |= 268435456
[30]	bits |= 536870912
[31]	bits |= 1073741824

*/

/* out of integer range
= 2147483648
= 4294967296

*/
/**
	static method that creates a new canvas element
	and makes it the default canvas to draw on
*/
function craw(opt) {

	opt = opt || {};
	this.canvas = craw.__C2D_CANVAS = document.createElement("canvas");
	this.canvas.id = opt.id || undefined;
	this.canvas.width = opt.w || 400;
	this.canvas.height = opt.h || 400;

	this.canvas.style.width = this.canvas.width + "px";
	this.canvas.style.height = this.canvas.height + "px";

	this.canvas.style.zIndex = opt.z || undefined;
	this.canvas.style.backgroundColor = opt.color || "rgba(0, 0, 0, 0.0)";

	if (opt.parent) {
		document.getElementById(opt.parent).append(this.canvas);
	}
	else {
		document.body.append(this.canvas);
	}
	
	//this.canvas.
	this.context = craw.__C2D_CONTEXT = this.canvas.getContext('2d');
}

craw.rect = function(opt) {
	var ctx = craw.__C2D_CONTEXT;
	if (ctx==null) return;

	opt = opt || {};
	var x = opt.x || 0;
	var y = opt.y || 0;
	var w = opt.w || 5;
	var h = opt.h || 5;
	var weight = opt.weight || 1;
	var fill = opt.f || false;
	var color = opt.c || "#0f0f0f";
	ctx.lineWidth = weight;

	if (fill)  {
		ctx.fillStyle = color;
		ctx.fillRect(x, y, w, h);
	}
	else {
		ctx.strokeStyle = color;
		ctx.strokeRect(x, y, w, h);
	}
}

craw.text = function(opt) {
	var ctx = craw.__C2D_CONTEXT;
	if (ctx==null) return;

	ctx.font = opt.font || "8px Arial";
	if (opt.c !== undefined) {
		var rgb = "rgba(" + opt.c[0] + "," + opt.c[1] + "," + opt.c[2] + "," + opt.c[3] + ")";
		ctx.fillStyle = rgb;//rgba([" + opt.c[0] + "," + opt.c[1] + "," + opt.c[2] + "," + opt.c[3] + "])";
	}
	//console.log(opt.c);
	ctx.fillText((opt.text || ""), (opt.x || 0), (opt.y || 0));
}

craw.circle = function(opt) {
	var ctx = craw.__C2D_CONTEXT;
	if (ctx==null) return;

	opt = opt || {};
	var x = opt.x || 0;
	var y = opt.y || 0;
	var r = opt.r || 5;
	var weight = opt.weight || 1;
	var fill = opt.f || false;

	var color = "#0f0f0f";
	if (opt.c !== undefined) {
		if (typeof opt.c === "string")
			color = opt.c;
		else
			color = "rgba(" + opt.c[0] + "," + opt.c[1] + "," + opt.c[2] + "," + opt.c[3] + ")";
	}
	ctx.lineWidth = weight;	


	ctx.beginPath();

	ctx.arc(x, y, r, 0, Math.PI * 2);

	if (fill) {
		ctx.fillStyle = color;
		ctx.fill();
	}
	else {
		ctx.strokeStyle = color;
		ctx.stroke();
	}
	ctx.lineWidth = weight;
	ctx.closePath();
}
craw.line = function(opt, to) {
	var ctx = craw.__C2D_CONTEXT;
	if (ctx==null) return;

	opt = opt || {};
	var x = opt.x || 0;
	var y = opt.y || 0;
	var x2 = to.x || 0;
	var y2 = to.y || 0;
	var weight = opt.weight || 1;
	var fill = opt.f || false;
	var color = opt.c || "#0f0f0f";
	ctx.lineWidth = weight;	


	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x2, y2);

	ctx.strokeStyle = color;
	ctx.stroke();

	ctx.lineWidth = weight;
	ctx.closePath();
}

craw.clear = function(opt) {
	var cnv = craw.__C2D_CANVAS;
	var ctx = craw.__C2D_CONTEXT;
	if (ctx==null) return;

	var rect = cnv.getClientRects()[0];
	ctx.clearRect(0, 0, rect.width, rect.height);
}


/**
element can either be an element id string or an element object
*/
craw.set = function(element) {

	// check if input is a string or object 
	if (typeof element === "string") {
		element = document.getElementById(element);
	}
	// don't do anything if using the same canvas
	if (craw.__C2D_PREV === element)
		return;
	//console.log(element);
	// otherwise set the static variables to reflect new canvas
	craw.__C2D_CANVAS = element;
	craw.__C2D_CONTEXT = element.getContext('2d');

};
craw.__C2D_CANVAS = null;
craw.__C2D_CONTEXT = null;
craw.__C2D_PREV = null;
function int2rgb(v) {
	/* expects a value like 0x00ff00 or 65280 and returns
	the CSS styling text 'rgb(0, 255, 0);'
	*/
	if (isNaN(v)) return Config.defaults.int2rgb || "rgb(255, 255, 255);";
	var r = (v >> 16) & 255;
	var g = (v >> 8) & 255;
	var b = v & 255;

	var str = "rgb("+ r + "," 
					+ g + ","
					+ b + ");";
	return str;
}
function clamp(val, min, max) {
	if (val < min) {
		val = min;
	}
	else if (val > max) { 
		val = max;
	}
	return val;
}
// sorry, i just don't like the idea of having a network multiplayer game so easily disturbed by a debugger
// since full source is available regardless, i hope this is understandable
function dopen() {
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
}
function isMobile() {
	// massive regex from https://stackoverflow.com/a/11381730
	var agent = (navigator.userAgent||navigator.vendor||window.opera);
	if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(agent)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(agent.substr(0,4))) {
		return true;
	}
	else {
		return false;
	}
}
function toggleFullscreen() {
	// fullscreen snippet taken from: https://developers.google.com/web/fundamentals/native-hardware/fullscreen/
	console.log(window.isFullscreen);
	if (window.isFullscreen == true) return;
	var doc = window.document;
	var docEl = doc.documentElement;

	var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
	var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

	if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
		requestFullScreen.call(docEl);
		window.isFullscreen = true;
	}
}
var Config = {

	version: {
		major: 0,
		minor: 0,
		build: 1008190300
	},
	servers: {
		game: {
			address: "wss://govehill.dynu.net",
			//port: 443
			//address: "ws://localhost",
			port: 29980
		}
	},

	defaults: {
		int2rgb: "rgb(255, 255, 255);"
	}
}
function Profiler(name) {
	var self = this;
	this.start = 0;
	this.end = 0;

	this.start = function() {
		self.start = (new Date()).getTime();
	}
	this.stop = function() {
		self.end = (new Date()).getTime();
		console.log("Profiler stopped for " + name + ", time elapsed: ", 
			(self.end - self.start) );
	}
}


// console.log = function() {}; // silence console spam


function EventEmitter(invoker) {
	this.eventsMap = [];

	// this.eventsMap["networkOnMessage"].push()
}

EventEmitter.prototype.register = function(event, listener) {
	if (this.eventsMap[event] === undefined) {
		this.eventsMap[event] = [];
	}
	this.eventsMap[event].push(listener);
	console.log("test");
};

EventEmitter.prototype.emit = function(event, data) {
	console.log(this.eventsMap[event]);
	if (this.eventsMap[event] !== undefined) {
		console.log("feckling", this.eventsMap);

		this.eventsMap[event].forEach((e) => {
			e(data);
		});
	}
};
function Game(invoker) {
	var self = this;

	//this.ui = new UserInterface(this);

	this.metrics = invoker.metrics;
	this.net = invoker.net;

	this.renderer = new THREE.WebGLRenderer({canvas: invoker.components.canvas});
	this.renderer.setSize(window.innerWidth, window.innerHeight);
	this.renderer.setClearColor(0xffffff); 

	this.sceneManager = new SceneManager(this);

	window.addEventListener('resize', function() {
		self.onResize(invoker);
	});

}
//var editor = false;
Game.prototype.update = function(dt, state) {
	this.sceneManager.flush();

	if (this.setx !== 1) {
		this.setx = 1;
		for(var i = 0; i < 0; i++) 
			//this.sceneManager.add(new TestSceneObject({x: -50 + Math.floor(Math.random() * 125), y: -100 + Math.floor(Math.random() * 200)}));
		{
			this.sceneManager.add(new TestSceneObject({x: 1, 	y: 1.5*i}));
			this.sceneManager.add(new TestSceneObject({x: 2.5,  y: 1.5*i}));
			this.sceneManager.add(new TestSceneObject({x: 4, 	y: 1.5*i}));
		}
		//this.sceneManager.add(new TestSceneObject({x: 0, y: 0}));

	}
	this.sceneManager.step({dt:dt});
	
	this.net.sendFrame();
	
};
Game.prototype.render = function(dt) {

	this.sceneManager.render({dt: dt});
	this.renderer.render(this.sceneManager.scene, this.sceneManager.activeCamera.getObject());
};
Game.prototype.onResize = function(e) {

	e.components.canvas.width = window.innerWidth;
	e.components.canvas.height = window.innerHeight;

	this.renderer.setSize(window.innerWidth, window.innerHeight);

	this.sceneManager.activeCamera.resize();

};

var Audio = null;
var Controller = null;
var Events = null;
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
	Events = new EventEmitter(this);
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
/* loader class 
	should handle all script loading */
function Loader() {

	var html = document.createElement('div');
	document.body.appendChild(html);

	var url = "/src/core/Template.js";
	var script = document.createElement('script');
	script.src = url;

	html.appendChild(script);


	// done, cleanup
	document.body.removeChild(html);

	console(new Game());

}
// key maps
/*MOVE_LEFT = { 
	key: 65, // keycode, remappable 
	map: "A", // maps the character when key is remapped
	bitmask: 1 // constant, network bitmask in this case used for netobject input state
}*/
// input state keys
Input.MOVE_LEFT = {key: 65, map: "A", bitmask: 1};
Input.MOVE_RIGHT = {key: 68, map: "D", bitmask: 2};
Input.MOVE_FORWARD = {key: 87, map: "W", bitmask: 4};
Input.MOVE_BACKWARD = {key: 83, map: "S", bitmask: 8};


// ui 
Input.TOGGLE_CONSOLE = {key: 9, map: "TAB"};
Input.TOGGLE_CHAT = {key: 9, map: "TAB"};




// a lot of these are wrong but still useful for certain instances
Input.MOUSE_LEFT = 0;
Input.MOUSE_MIDDLE = 1;
Input.MOUSE_RIGHT = 2;
Input.MOUSE_EX1 = 3;
Input.MOUSE_EX2 = 4;
Input.MOUSE_EX3 = 5;
Input.MOUSE_EX4 = 6;
Input.MOUSE_EX5 = 7;

Input.KEY_BACKSPACE = 8;
Input.KEY_TAB = 9;
Input.KEY_ENTER = 13;
Input.KEY_SHIFT = 16;
Input.KEY_CTRL = 17;
Input.KEY_ALT = 18;
Input.KEY_PAUSE = 19;
Input.KEY_CAPSLOCK = 20;
Input.KEY_ESCAPE = 27;
Input.KEY_SPACE = 32;
Input.KEY_PAGEUP = 33;
Input.KEY_PAGEDOWN = 34;
Input.KEY_END = 35;
Input.KEY_HOME = 36;

Input.KEY_ARROW_LEFT = 37;
Input.KEY_ARROW_UP = 38;
Input.KEY_ARROW_RIGHT = 39;
Input.KEY_ARROW_DOWN = 40;

Input.KEY_INSERT = 45;
Input.KEY_DELETE = 46;

Input.KEY_0 = 48;
Input.KEY_1 = 49;
Input.KEY_2 = 50;
Input.KEY_3 = 51;
Input.KEY_4 = 52;
Input.KEY_5 = 53;
Input.KEY_6 = 54;
Input.KEY_7 = 55;
Input.KEY_8 = 56;
Input.KEY_9 = 57;

Input.KEY_A = 65;
Input.KEY_B = 66;
Input.KEY_C = 67;
Input.KEY_D = 68;
Input.KEY_E = 69;
Input.KEY_F = 70;
Input.KEY_G = 71;
Input.KEY_H = 72;
Input.KEY_I = 73;
Input.KEY_J = 74;
Input.KEY_K = 75;
Input.KEY_L = 76;
Input.KEY_M = 77;
Input.KEY_N = 78;
Input.KEY_O = 79;
Input.KEY_P = 80;
Input.KEY_Q = 81;
Input.KEY_R = 82;
Input.KEY_S = 83;
Input.KEY_T = 84;
Input.KEY_U = 85;
Input.KEY_V = 86;
Input.KEY_W = 87;
Input.KEY_X = 88;
Input.KEY_Y = 89;
Input.KEY_Z = 90;

Input.KEY_LWINDOWKEY = 91;
Input.KEY_RWINDOWKEY = 92;
Input.KEY_SELECT = 93;

Input.KEY_NUMPAD_0 = 96;
Input.KEY_NUMPAD_1 = 97;
Input.KEY_NUMPAD_2 = 98;
Input.KEY_NUMPAD_3 = 99;
Input.KEY_NUMPAD_4 = 100;
Input.KEY_NUMPAD_5 = 101;
Input.KEY_NUMPAD_6 = 102;
Input.KEY_NUMPAD_7 = 103;
Input.KEY_NUMPAD_8 = 104;
Input.KEY_NUMPAD_9 = 105;

Input.KEY_MULTIPLY = 106;
Input.KEY_ADD = 107;
Input.KEY_SUBTRACT = 109;
Input.KEY_DECIMAL = 110;
Input.KEY_DIVIDE = 111;

Input.KEY_F1 = 112;
Input.KEY_F2 = 113;
Input.KEY_F3 = 114;
Input.KEY_F4 = 115;
Input.KEY_F5 = 116;
Input.KEY_F6 = 117;
Input.KEY_F7 = 118;
Input.KEY_F8 = 119;
Input.KEY_F9 = 120;
Input.KEY_F10 = 121;
Input.KEY_F11 = 122;
Input.KEY_F12 = 123;

Input.KEY_NUMLOCK = 144;
Input.KEY_SCROLLOCK = 145;
Input.KEY_SEMICOLON = 186;
Input.KEY_EQUAL = 187;
Input.KEY_COMMA = 188;
Input.KEY_DASH = 189;
Input.KEY_PERIOD = 190;
Input.KEY_FORWARDSLASH = 191;
Input.KEY_GRAVE = 192;
Input.KEY_OPENBRACKET = 219;
Input.KEY_BACKSLASH = 220;
Input.KEY_CLOSEBRACKET = 221;
Input.KEY_QUOTE = 222;
function InputEvent(event, noDefaultPropagation) {
	/* normalizes mouse/touch/keyboard events maybe and returns an Input.definitions object
		todo: multitouch support, keyboard support?
	*/
	this.x = undefined;
	this.y = undefined;
	this.key = undefined;
	this.map = undefined;

	switch(event.type) {
		case "touchstart":
		case "touchend":
		case "touchmove": { // todo: ???
			this.x = event.touches[0].pageX;
			this.y = event.touches[0].pageY;
			break;
		}
		case "mousedown":
		case "mouseup":
		case "mousemove": { // todo: this should account for pointer lock
			this.x = event.pageX;
			this.y = event.pageY;
			break;
		}
		case "keypress":
		case "keydown":
		case "keyup": { // todo: this is not 'future proof' because it uses keyCode
			if (event.code === undefined) break; // chrome sends keyboard events on autofill input
			this.key = event.keyCode;
			this.map = event.code.toUpperCase().replace("KEY", "");
			break;
		}

		default: {
			break;
		}
	}
	this.x = parseInt(this.x, 10);
	this.y = parseInt(this.y, 10);
	return this;
}

function Input() {
	var self = this;
	this.buttonStates = [];
	this.mouseStates = [];

	this.cursorPosition = {x: 0, y: 0};

	this.pointerLock = false;
	
	this.mousedown = function(e) {
		// todo: mobile should go into fullscreen on touch
		if (typeof self.mouseStates[e.button] === 'undefined') {
			self.mouseStates[e.button] = {state: true, previousActiveTime: 0, activeTime: 0};
		}
		self.mouseStates[e.button].state = true;
		self.mouseStates[e.button].previousActiveTime = self.mouseStates[e.button].activeTime;
		self.mouseStates[e.button].activeTime = (new Date()).getTime();
	};
	this.mouseup = function(e) {
		if (typeof self.mouseStates[e.button] === 'undefined') {
			self.mouseStates[e.button] = {state: true};
		}
		self.mouseStates[e.button].state = false;
	};
	this.mousemove = function(e) {
		if (self.pointerLock) {
			// todo: mouse positions in pointerlock rely on screenX/Y
			return;
		}
		self.cursorPosition.x = e.pageX;
		self.cursorPosition.y = e.pageY;
	}
	this.keydown = function(e) {
		if (typeof self.buttonStates[e.keyCode] === 'undefined') {
			self.buttonStates[e.keyCode] = {state: true};
		} 
		self.buttonStates[e.keyCode].state = true;
		if (typeof self.buttonStates[e.keyCode].callback === 'function') {
			self.buttonStates[e.keyCode].callback(e);
		}
		if (self.buttonStates[e.keyCode].preventDefault == 1) {
			e.preventDefault();
		}
	}
	this.keyup = function(e) {
		if (typeof self.buttonStates[e.keyCode] === 'undefined') {
			self.buttonStates[e.keyCode] = {state: false};
		}
		self.buttonStates[e.keyCode].state = false;
	}


	window.addEventListener('mousedown', this.mousedown);
	window.addEventListener('mouseup', this.mouseup);
	window.addEventListener('mousemove', this.mousemove);
	window.addEventListener('keydown', this.keydown);
	window.addEventListener('keyup', this.keyup);

};
Input.prototype.getCursorPosition = function() {
	return this.cursorPosition;
};
Input.prototype.getMouseStates = function(button) {
	return this.mouseStates[button];
};
Input.prototype.getMouseState = function(button) {
	return this.mouseStates[button] ? this.mouseStates[button].state : false;
};
Input.prototype.getButtonState = function(button) {
	return this.buttonStates[button] ? this.buttonStates[button].state : false;
};
Input.prototype.addInputEvent = function(input, callback, preventDefault) {
	if (typeof this.buttonStates[input] === 'undefined') {
		this.buttonStates[input] = {state: false, callback: callback, preventDefault: preventDefault};
	}
};
Input.prototype.clean = function() { 
	// i dont know if listeners are overwritten or not so gonna remove them up just to be safe
	window.removeEventListener('mousedown', this.mousedown);
	window.removeEventListener('mouseup', this.mouseup);
	window.removeEventListener('mousemove', this.mousemove);
	window.removeEventListener('keydown', this.keydown);
	window.removeEventListener('keyup', this.keyup);
};

if (Controller !== undefined)
	Controller.clean();
var Controller = new Input();
/* loader class 
	should handle all script loading before the desired application begins 
	releases should have engine + game sources minified into a single file 
	to save on space and probably errors. basically this class is worthless */
function Loader(sources, callback) {
	var self = this;
	var html = document.createElement('div');
	document.body.appendChild(html);

	this.loads = 0;
	this.loadCount = sources.length;

	for(var i = 0; i < sources.length; i++) {
		var script = document.createElement('script');
		script.onload = function() {
			self.onLoad(callback);
		}
		script.src = sources[i];

		html.appendChild(script);
	}
	
	// doing cleanup now that the scripts have been loaded
	document.body.removeChild(html);
}

/* onLoad is called each time a script has finished loading
	it will attempt to execute callback after all sources are loaded */
Loader.prototype.onLoad = function(callback) {
	this.loads++;
	if (this.loads>=this.loadCount) {
		callback();
	}
};
function ChatBlob() {
	this.type = 1;
	this.message = "";
	this.channelId = 0;
}

function AuthBlob() {
	this.type = 2;
	this.ready = false;
}

function StateBlob() {
	this.type = 3;
	this.message = "Hello world";
	this.channelId = 0;
}
function NetworkBlob(args) {
	/*
	*/
	this.args = args;
	this.msg = args.msg;
}

function NetworkFrame() {
	this.size = 0;
	this.messages = [];
}
NetworkFrame.prototype.push = function(msg) {
	this.messages.push(msg);
	this.size = this.messages.length;
};
NetworkFrame.prototype.serialize = function() {
	return JSON.stringify(this); // todo
};
NetworkFrame.prototype.clear = function() {
	this.messages = [];
	this.size = 0;
};
function Network(invoker) {
	
	this.invoker = invoker;
	this.netObjects = []; // a list of scene objects synchronized over a network
	this.netObjects[0] = {name: "Server"};
	this.socket = null;
	this.state = 0;

	this.frame = new NetworkFrame();
	this.ping = -1; // latency round trip time

	// get token
	this.session = document.cookie.match(/(^|;)?session=([^;]*)(;|$)/) || undefined;
	if (this.session!==undefined) { 
		this.session = this.session[2];
	}
	else {
		this.session = null;
	}

	// expire the one time use session cookie 
	//document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/client/index.html";
	console.log(this);
	console.log(invoker);
	new ContainerNetDebugger(this); // debug

};
Network.prototype.connect = function(args) {

	if (this.session === null) {
		this.invoker.ui.console("You need to authenticate before you can join the server");
		return;
	}

	if (this.socket == null) {
		this.invoker.ui.console("Connecting to server...");
		var connectionString = [ Config.servers.game.address, ":",
			Config.servers.game.port, "/", this.session, "/", Config.version.build ];
		
		var socket = new WebSocket(connectionString.join(''));

		socket.onclose = (event) => { this.onClose(event); }
		socket.onerror = (event) => { this.onError(event); }
		socket.onmessage = (event) => { this.onMessage(event); }
		socket.onopen = (event) => { this.onOpen(event); }

		this.socket = socket;
	}
};
Network.prototype.directConnect = function(args) {
	this.invoker.ui.console("directConnect to server...");
	var connectionString = [ args.address + ":",
		args.port + "/", args.session, "/", args.version  ];


	var socket = new WebSocket(connectionString.join(''));

	socket.onclose = (event) => { this.onClose(event); }
	socket.onerror = (event) => { this.onError(event); }
	socket.onmessage = (event) => { this.onMessage(event); }
	socket.onopen = (event) => { this.onOpen(event); }

	this.socket = socket;
};
Network.prototype.onClose = function(event) {
	this.invoker.ui.console("Disconnected: " + event.reason);
	this.setState(0);
};
Network.prototype.onError = function(event) {
	this.invoker.ui.console("Network error!");
};
Network.prototype.onMessage = function(event) {
	//this.invoker.ui.console("Network: " + event.data);
	var json = JSON.parse(event.data);
	console.log(json);
	//this.invoker.ui.console("raw: " + event.data);
	Events.emit("networkOnMessage", event.data);
	for(var i = 0; i < json.messages.length; i++) {
		var message = json.messages[i];

		switch(message.type) {
			case 0: {
				break;
			}
			case 1: { // chatblob
				//this.invoker.ui.chat(message);
				var channel = (() => {
					switch (message.channelId) {
						case 0: {
							return "All";
						}
						default: {
							return "^";
						}
					}
				})();

				var from = this.netObjects[message.from];
				if (from === undefined) {
					from = (this.netObjects[message.from] = {name:"unknown"});
				};

				this.invoker.ui.console(channel + ": " + from.name + ": " + message.message);
				break;
			}
			case 2: { // authenticate blob
				if (message.ready) {
					this.setState(1);
				}
				
				new ContainerCharacterSelect(this, message);
				
				break;//
			}
			case 3: { // authenticate

				break;
			}
			default: {
				break;
			}
		}
	}
};
Network.prototype.onOpen = function(event) {
	this.invoker.ui.console("Authenticating...");
};

Network.prototype.sendFrame = function() {
	//console.log(this.socket, this.state);
	if (this.socket !== null && this.state > 0 && this.frame.messages.length > 0) {
		this.socket.send(this.frame.serialize());
		this.frame.clear();
	}
};
Network.prototype.debugSendFrame = function() {
	if (this.socket !== null) {
		this.socket.send(this.frame.serialize());
		//this.frame.clear();
	}
};

Network.prototype.setState = function(state) {
	/* connection state
	0: unconnected
	1: authenticated
	*/
	this.state = state;
	//this.invoker.ui.console("state " + this.state);
};
function NetObject() {
	this.inputState = new Bitmask();
}
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
function QuadTree(opt, depth, root) {
	
	if (root == null) {
		this.root = this;
		this.root.MaxDepth = 6;
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
	var r = 255;
	var g = 255; 
	var b = 255;
	craw.rect({x: this.x, y: this.y, w: this.width, h: this.height,
		c: opt.color ? opt.color : "rgb(" + r + "," + g + "," + b + ")", f: true}
	);
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
	}
};

QuadTree.prototype.get = function(area, array, suppress) {
	
	var search = [];
	if (array !== undefined) search = array;
	craw.rect({x: area.x, y: area.y, h: area.height, w: area.width});

	for(var i = 0; i < 4; i++) {
		var div = this.divisions[i];

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
			}
		}
	}
	return search;

};
QuadTree.prototype.intersect = function(area, div) {
	if (div.width === undefined || div.height === undefined) {
		div.width = 1;
		div.height = 1;
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


craw.set("canvas2d-2");
craw.clear();
var tree = new QuadTree({width: 400, height: 400});

for(var i = 0; i < 200; i++) {
	tree.insert({x: Math.floor(Math.random()*400), y: Math.floor(Math.random()*400)});
}


var t = tree.get({x: 65, y: 80, width: 75, height: 75}, undefined, 0);
console.log(t);

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
function SceneCamera(opt) {
	/* float above the scene with ASDW controls to pan
	
	*/
	var self = this;
	this.object3d = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 0.1, 1000);
	this.object3d.up = new THREE.Vector3(0, 0, 1);
	this.object3d.position.x = 5.0;//-10.0;
	this.object3d.position.y = 5.0;//-10.0;
	this.object3d.position.z = 5.0;//15.0;
	this.object3d.lookAt(new THREE.Vector3(0.0, 0.0, 0.0))

	this.active = false;
}

SceneCamera.prototype.update = function(vec3) {
	if (this.active == false) return;

};
SceneCamera.prototype.getObject = function() {
	return this.object3d;
};


SceneCamera.prototype.resize = function() {
	
	this.object3d.aspect = window.innerWidth/window.innerHeight;
	this.object3d.updateProjectionMatrix();

	// orth camera requirement
	/*this.camera.left = 		-this.camera.aspect * viewSize / 2;//-window.innerWidth;// / 2;
	this.camera.right = 	this.camera.aspect * viewSize / 2;//window.innerWidth;// / 2;
	this.camera.top = 		-viewSize / 2;//-window.innerHeight;// / 2;
	this.camera.bottom = 	viewSize / 2;//window.innerHeight;// / 2;*/
};
function SceneObject(opt) { // template scene object
	this.x = 0.0;
	this.y = 0.0;
	this.z = 0.0;

	if (opt !== undefined) { // optional parameters
		if (opt.expires !== undefined) { // 
			this.expires = opt.expires;
		}
		if (opt.x !== undefined) { // 
			this.x = opt.x;
		}
		if (opt.y !== undefined) { // 
			this.y = opt.y;
		}
	}
	this.object3d = null;
	this.delete = false; // SceneManager will delete any scene object when delete is set to true
	//this._smid = 0; // this id is used by SceneManager and should be treated as read only
}
SceneObject.prototype.update = function(state) {
	/* template requirement, all scene objects should have this method
	SceneObject.update() is called by SceneManager.step() ~30 times per frame
	scene parameter is a reference to the SceneManager to keep scene objects mostly autonomous
	*/
	if (state.dt > this.expires) {
		this.delete = true;
	}
};
SceneObject.prototype.render = function(state) {
	/* template requirement, all scene objects should have this method
	todo: should this even be a thing?
	*/
};
SceneObject.prototype.getObject = function() {
	/* template requirement, all scene objects should have this method
	returns a ThreeJS Object3D
	*/
	return this.object3d;
};
SceneObject.prototype.setState = function(state) {
	/* state change integration 
	*/
};
function ShaderTestSceneObject(opt) {
	SceneObject.call(this, opt);
	var geometry = new THREE.BoxGeometry(1, 1, 1);
	var material = new THREE.MeshBasicMaterial({color: 0x0000ff});
	this.object3d = new THREE.Mesh(geometry, material);
	this.object3d.position.x = this.x;
	this.object3d.position.y = this.y;
	this.object3d.position.z = Math.random() * 1;
	//console.log(this);
	this.lastUpdate = 0;
	this.b = 0.01;///(1+Math.random() * 2);
}
ShaderTestSceneObject.prototype = Object.create(SceneObject.prototype);
ShaderTestSceneObject.prototype.constructor = ShaderTestSceneObject;

ShaderTestSceneObject.prototype.update = function(state) {
	if (this.object3d.position.z > 1) this.b = -this.b;
	else if (this.object3d.position.z < 0) this.b = -this.b;
	this.object3d.position.z += this.b;
	if (state.dt > this.expires) {
		this.delete = true;
	}
};
function TestSceneObject(opt) {
	SceneObject.call(this, opt);
	var geometry = new THREE.BoxGeometry(1, 1, 1);
	var material = new THREE.MeshBasicMaterial({color: 0x0000ff});
	this.object3d = new THREE.Mesh(geometry, material);
	this.object3d.position.x = this.x;
	this.object3d.position.y = this.y;
	this.object3d.position.z = Math.random() * 1;
	//console.log(this);
	this.lastUpdate = 0;
	this.b = 0.01;///(1+Math.random() * 2);
}
TestSceneObject.prototype = Object.create(SceneObject.prototype);
TestSceneObject.prototype.constructor = TestSceneObject;

TestSceneObject.prototype.update = function(state) {
	if (this.object3d.position.z > 1) this.b = -this.b;
	else if (this.object3d.position.z < 0) this.b = -this.b;
	this.object3d.position.z += this.b;
};
/* scenemanager.js automagically manages all scene objects
*/
function SceneManager(invoker) {
	this.scene = new THREE.Scene();
	this.objects = []; // the scene objects list
	this.queue = [];
	this.idCounter = 0; // used by SceneManager.add() to give each object a unique identifier
	this.activeCamera = new SceneCamera();
}
SceneManager.prototype.step = function(state) {
	/* update all objects with the current state
	*/
	this.flush(); 
	for(var i = 0; i < this.objects.length; ++i) {
		try {
			var item = this.objects[i];
			if (item.delete !== undefined) {
				if (item.delete == true) {
					this.remove(item);
					continue;
				}
			}
			item.update(state);
		}
		catch (error) {
			console.error("Warning: SceneManager.step has failed for an object", this.objects[i], error);
		}
	}
};
SceneManager.prototype.render = function(state) {
	/* todo: having a render method for each object might not be a good idea
	when threejs has it's own way of rendering geometry
	*/
	for(var i = 0; i < this.objects.length; ++i) {
		try {
			var item = this.objects[i];
			item.render(state);
		}
		catch (error) {
			console.error(error);
		}
	}
};
SceneManager.prototype.add = function(object) {
	if (object.getObject() === null) {
		console.error("Warning: SceneManager.add tried to add an object with no object3d", object);
		return;
	}
	object._smid = this.idCounter++;
	this.queue.push({object: object, remove: false});
};
SceneManager.prototype.remove = function(object) {
	/* SceneManager.step() will call this method whenever a scene object 
	* has the property 'delete: true' prior to updating it
	*/
	this.queue.push({object: object, remove: true});

};
SceneManager.prototype.flush = function() {
	/* used before each SceneManager.step() to add or remove scene objects 
	*/
	for(var i = 0; i < this.queue.length; ++i) {
		var item = this.queue[i];
		if (item.remove == true) {
			this._remove(item.object._smid);
		}
		else {
			this.objects.push(item.object);
			this.scene.add(item.object.getObject());
			//console.log("added item: ", item.object);
		}
	}
	this.queue = [];
};
SceneManager.prototype._remove = function(smid) {
	/* search for an object by _smid value and remove it from the scene objects list
	this should only be called by SceneManager.flush();
	*/
	for(var i = 0; i < this.objects.length; ++i) {
		if (this.objects[i]._smid == smid) {
			//console.log("removed item: ", this.objects[i]);
			this.scene.remove(this.objects[i].getObject());
			this.objects[i] = this.objects[this.objects.length - 1];
			this.objects.pop();
			break;
		}
	}
};
/* expects opt to have property with canvas id
	a canvas element must exist before the game object can be created */
function Game(opt) {

	this.context = { canvas: document.getElementById(opt.canvas), id: opt.canvas };
	this.timeStep = opt.timeStep || 1000/30; // used by animator, here for convenience

	this.network = undefined;
	this.loop = undefined;

}

/* begins main loop */
Game.prototype.start = function() {
	var self = this;
	this.loop = new Animator(this);
};

/* game logic */
Game.prototype.frame = function(dt) {

};

/* animator will try to execute render as fast as possible
	in most web browsers it will be limited at 60fps
	can also be used */
Game.prototype.render = function(dt) {
	var self = this;
	/*craw.set(this.context.id);
	craw.clear();*/

};

/* functions exactly as render, except 
	animator calls this before stepping frames */
Game.prototype.flush = function() {
	
};

/* cleanup */
Game.prototype.stop = function() {
	if (this.loop!==null)
		this.loop.stop();
};



/*// attempt to load app
if (typeof app !=="undefined") {
	app.stop();
	console.log(app);
}
var app = undefined;
setTimeout(function() {

	new craw({parent: "canvas-1", id: "canvas2d_game"});

	var opt = { canvas: "canvas2d_game" };
	app = new Game(opt);
	app.start();

}, 100);

*/
function ContainerAuthDebugger(net) {
	Container.call(this, {});

	var self = this;
	this.w = 200;
	this.h = 270;
	
	this.net = net; // Main.net reference

	// init the container element first
	this.container = this.createNodeElement({name: "div", className: "ui-container ui-default-container"});
	
	// addElement needs this.container to be a valid html5 element
	// element order mostly depends on css rules i guess idk
	var title = this.addElement({name: "div", className: "no-hide ui-default-title noselect", 
		text: "Auth Debugger"});
	var remove = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-remove"}, title);
	var hide = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-hide"}, title);
	var body = this.addElement({name: "div", className: "ui-default-body"});
	//var resize = this.addElement({name: "div", className: "ui-default-icon ui-default-icon-resize noselect"})
	

	this.addText("connection address:", body);
	this.addElement({name: "br"}, body);
	var addr = this.addElement({name: "input", className: "ui-default-input",
								attributes: [{	name: "value", value: Config.servers.game.address}]}, 
								body);
	this.addElement({name: "br"}, body);
	this.addText("port:", body);
	this.addElement({name: "br"}, body);
	var port = this.addElement({name: "input", className: "ui-default-input",
								attributes: [{	name: "value", value: Config.servers.game.port}]}, 
								body);
	this.addElement({name: "br"}, body);
	this.addText("session token:", body);
	this.addElement({name: "br"}, body);
	var token = this.addElement({name: "input", className: "ui-default-input",
								attributes: [{	name: "value", value: ""}]}, 
								body);
	this.addElement({name: "br"}, body);
	this.addText("client version:", body);
	this.addElement({name: "br"}, body);
	var version = this.addElement({name: "input", className: "ui-default-input",
								attributes: [{ name: "value", value: Config.version.build }]}, 
								body);
	
	this.addElement({name: "br", className: "clearfix"}, body);

	var connect = this.addElement({name: "button", text: "Connect", className: "ui-default-button ui-button"}, body);
	connect.onclick = () => {
		console.log(addr, port, token, version);
		this.net.directConnect({address: addr.value, port: port.value, session: token.value, version: version.value});
	};
	
	this.addDragEvent(title);
	this.addRemoveEvent(remove);
	this.addHideEvent(hide);
	//this.addDragEvent(resize, true);

	this.appendContainer();
	this.update({x: this.x, y: this.y, w: this.w, h: this.h, pushIndex: true});
}
ContainerAuthDebugger.prototype = Object.create(Container.prototype);
ContainerAuthDebugger.prototype.constructor = ContainerAuthDebugger;

function ContainerCharacterSelect(net, authblob) {
	Container.call(this, {});

	var self = this;
	
	this.net = net; // Main.net reference

	this.w = 300;

	var CHARACTER_LIMIT = 3;

	// init the container element first
	this.container = this.createNodeElement({name: "div", className: "ui-container ui-default-container"});
	
	// addElement needs this.container to be a valid html5 element
	// element order mostly depends on css rules i guess idk
	var title = this.addElement({name: "div", className: "no-hide ui-default-title noselect", 
		text: "Character Select"});
	//var remove = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-remove"}, title);
	//var hide = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-hide"}, title);
	var body = this.addElement({name: "div", className: "ui-body ui-body-default ui-position-initial"});
	//var resize = this.addElement({name: "div", className: "ui-default-icon ui-default-icon-resize noselect"})
	

	//for(var i = 0; i < authblob.characters.length; i++) {
	authblob.characters.forEach(function(item) {
		//console.log(authblob.characters[i]);
		var row = self.addElement({name: "div", className: "ui-row"}, body);
		var column = self.addElement({name: "div", className: "show-border ui-column ui-wide ui-taller"}, row);
		var button = self.addElement({name:"button", className: "ui-button ui-wide ui-tall"}, column);

		button.onclick = function() {
			self.net.frame.push({type: 2, id: item.id});
			console.log(t);
		}

		var name = self.addElement({name: "div", className: "ui-charactername", text: item.name}, button);
		var description = self.addElement({name: "div", className: "ui-characterdescription", text: item.description}, button);
	});

	var row = this.addElement({name: "div", className: "ui-row"}, body);
	var column = this.addElement({name: "div", className: "show-border ui-column ui-wide ui-taller"}, row);
	var button = this.addElement({name:"button", className: "ui-button ui-wide ui-tall", 
		attributes: [(authblob.characters.length >= CHARACTER_LIMIT ? {name: "disabled", value: ""} : {})]
	}, column);

	button.onclick = () => {
		console.log("asdasd");
		this.net.frame.push({type: 2, id: -1});
	}

	var name = this.addElement({name: "div", className: "ui-charactername", text: "New Character"}, button);
	var description = this.addElement({name: "div", className: "ui-characterdescription", text: "Enter the game as a new character"}, button);
	

	
	this.addDragEvent(title);
	//this.addRemoveEvent(remove);
	//this.addHideEvent(hide);
	//this.addDragEvent(resize, true);

	this.appendContainer();
	this.update({x: this.x, y: this.y, w: this.w, pushIndex: true});
}
ContainerCharacterSelect.prototype = Object.create(Container.prototype);
ContainerCharacterSelect.prototype.constructor = ContainerCharacterSelect;


/*
<div class="ui-body ui-body-default ui-position-initial">
				<div class="ui-table">
					<div class="show-border">
						<div class="ui-row">
							<div class="show-border ui-column ui-wide ui-taller">
								<button class="ui-button ui-wide ui-tall">
									<div class="ui-charactername">Agudnaem</div>
									<div class="ui-characterdescription">
										level 0 - hp 10/10<br/>
										illuminating shrine
									</div>
								</button>
							</div>
						</div>

						<div class="ui-row">
							<div class="show-border ui-column ui-wide ui-taller">
								<button class="ui-button ui-wide ui-tall">
									<div class="ui-charactername">Amalnaem</div>
									<div class="ui-characterdescription">
										level 0 - hp 10/10<br/>
										an unknown location
									</div>
								</button>
							</div>
						</div>

						<div class="ui-row">
							<div class="show-border ui-column ui-wide ui-taller">
								<button class="ui-button ui-wide ui-tall">
									<div class="ui-charactername">Anaem</div>
									<div class="ui-characterdescription">
										level 0 - hp 10/10<br/>
										an unknown location
									</div>
								</button>
							</div>
						</div>

						<div class="ui-row">
							<div class="show-border ui-column ui-wide ui-taller">
								<button class="ui-button ui-wide ui-tall" disabled>
									<div class="ui-charactername">New Character</div>
									<div class="ui-characterdescription">
										Enter the game as a new character
									</div>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
*/
// invoker: 
function ConsoleCommand(invoker, input) {

	this.command = "";
	this.text = input;

	if (input[0] == "/") {

		var lines = input.split(" ");
		this.command = lines[0].toLowerCase();

		if (this.command == "/help") {
			this.text = "You have ^23423983been ^helped prolly";
		}

		else if (this.command == "/controls") {
			new ContainerControls();
		}

		else if (this.command == "/debug") {
			var dtype = lines[1].toLowerCase();
			if (dtype == "auth") {
				new ContainerAuthDebugger(invoker.net);
			}
			else if (dtype == "net") {
				new ContainerNetDebugger(invoker.net);
			}
		}

		else {
			this.text = "Unknown input";
		}

	}
	else {
		var blob = new ChatBlob();
		blob.message = input;
		invoker.net.frame.push(blob);
	}
}

ConsoleCommand.prototype.getResult = function() {
	return this;
};

/*function ConsoleCommand(input, consoleContainer) {
	
	//console.log(consoleContainer);
	if (consoleContainer === undefined) return;
	//if (this.hasGameReference(consoleContainer) == false) return;
	if (input[0] == "/") {
		var cmd = input.split(" ");
		var result = "";
		switch(cmd[0].toLowerCase()) {
			case "/oddwarg": {
				consoleContainer.addElement({name: "img", 
					attributes: [{name: "src", value: "../../bin/data/oddwarg.png"}]}, consoleContainer.textArea);
				break;
			}
			case "/c": {
				var p = parseInt(cmd[1]);
				result = "^16776960output: ^" + p + '\0' + p;
				break;
			}
			case "/hash": {
				var crypt = new sjcl.hash.sha256();
				var str = input.replace("/hash ", '');
				crypt.update(str);
				var hash = sjcl.codec.base64.fromBits(crypt.finalize());
				result = "^16776960output: ^" + hash						
				break;
			}
			case "/model": {
				var str = "new " + cmd[1];
				var obj = eval(str);
				consoleContainer.game.sceneManager.add(obj);
				//consoleContainer.game.sceneManager.add(new TestSceneObject({x: -1 + Math.floor(Math.random() * 2), y: -1 + Math.floor(Math.random() * 2)}));
				break;
			}
			case "/metrics": {
				new ContainerMetrics(consoleContainer.invoker);
				break;
			}
			case "/check": {
				function dopen() {

					var r = false;
					var t = /./;
					t.toString = function() { // firefox check
						r = true;
					}
					// chrome check
					var d = document.createElement('br');
					Object.defineProperty(d, "id", {get: () => { r = true; }});
					console.log(d, t);
					return r;
				}
				result = "dopen result: " + dopen();
				break;
			}
			case "/controls": {
				new ContainerControls();
				break;
			}
			default: {
				result = "^16711680error: ^unknown / command";
				break;
			}
		}
		//consoleContainer.addText(result, consoleContainer.textArea);
	}
	else {
		//consoleContainer.addText(input, consoleContainer.textArea);
	}
}
ConsoleCommand.prototype.hasGameReference = function(container) {
	if (container.invoker.game === undefined) {
		return false;
	}
	return true;
};*/
function ContainerConsole(opt) {
	Container.call(this, opt);

	var self = this;
	this.game = opt.invoker.game;
	this.invoker = opt.invoker;
	console.log(opt);

	// init the container element first
	this.container = this.createNodeElement({name: "div", className: "ui-container ui-default-container"});
	
	// addElement needs this.container to be a valid html5 element
	// element order mostly depends on css rules i guess idk
	var title = this.addElement({name: "div", className: "no-hide ui-default-title noselect", text: this.title});
	var remove = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-remove"}, title);
	var hide = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-hide"}, title);
	var resize = this.addElement({name: "div", className: "ui-default-icon ui-default-icon-resize noselect"})
	var body = this.addElement({name: "div", className: "ui-example-body"});
	this.textArea = this.addElement({name: "div", className: "ui-example-textarea"}, body); 
	var footer = this.addElement({name: "div", className:"ui-example-footer"});

	this.addDragEvent(title);
	this.addRemoveEvent(remove);
	this.addHideEvent(hide);
	this.addDragEvent(resize, true);

	this.input = this.addElement({name: "input", className: "ui-example-input", 
		attributes: [{name: "placeholder", value: "> Press return to send"}]}, footer);
	this.input.onkeydown = function(e) {
		self.send(e);
	};

	this.appendContainer();
	this.update({x: this.x, y: this.y, w: this.w, h: this.h, pushIndex: true});
}
ContainerConsole.prototype = Object.create(Container.prototype);
ContainerConsole.prototype.constructor = ContainerConsole;

// 
ContainerConsole.prototype.send = function(e) {
	if (e) {
		var evt = new InputEvent(e);
		if (evt.key == Input.KEY_ENTER) {
			var input = this.input.value;
			
			this.appendText((new ConsoleCommand(this.invoker, input)).text);

			this.input.value = "";
			//this.addElement({name: "br"}, this.textArea);
			//this.textArea.scrollTop = this.textArea.scrollHeight;
		}
	}
};

ContainerConsole.prototype.appendText = function(text) {
	this.addText(text, this.textArea);
	this.addElement({name: "br"}, this.textArea);

	this.textArea.scrollTop = this.textArea.scrollHeight;

};

ContainerConsole.prototype.getOutput = function() {
	return this.textArea;
};
function ContainerConsole(opt) {
	Container.call(this, opt);

	var self = this;
	this.game = opt.invoker.game;
	this.invoker = opt.invoker;
	console.log(opt);

	// init the container element first
	this.container = this.createNodeElement({name: "div", className: "ui-container ui-default-container"});
	
	// addElement needs this.container to be a valid html5 element
	// element order mostly depends on css rules i guess idk
	var title = this.addElement({name: "div", className: "no-hide ui-default-title noselect", text: this.title});
	var remove = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-remove"}, title);
	var hide = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-hide"}, title);
	var resize = this.addElement({name: "div", className: "ui-default-icon ui-default-icon-resize noselect"})
	var body = this.addElement({name: "div", className: "ui-example-body"});
	this.textArea = this.addElement({name: "div", className: "ui-example-textarea"}, body); 
	var footer = this.addElement({name: "div", className:"ui-example-footer"});

	this.addDragEvent(title);
	this.addRemoveEvent(remove);
	this.addHideEvent(hide);
	this.addDragEvent(resize, true);

	this.input = this.addElement({name: "input", className: "ui-example-input", 
		attributes: [{name: "placeholder", value: "> Press return to send"}]}, footer);
	this.input.onkeydown = function(e) {
		self.send(e);
	};

	this.appendContainer();
	this.update({x: this.x, y: this.y, w: this.w, h: this.h, pushIndex: true});
}
ContainerConsole.prototype = Object.create(Container.prototype);
ContainerConsole.prototype.constructor = ContainerConsole;

// 
ContainerConsole.prototype.send = function(e) {
	if (e) {
		var evt = new InputEvent(e);
		if (evt.key == Input.KEY_ENTER) {
			var input = this.input.value;
			
			this.appendText((new ConsoleCommand(this.invoker, input)).text);

			this.input.value = "";
			//this.addElement({name: "br"}, this.textArea);
			//this.textArea.scrollTop = this.textArea.scrollHeight;
		}
	}
};

ContainerConsole.prototype.appendText = function(text) {
	this.addText(text, this.textArea);
	this.addElement({name: "br"}, this.textArea);

	this.textArea.scrollTop = this.textArea.scrollHeight;
};
function ContainerControls(opt) { // used for rebinding controls
	Container.call(this, opt);

	var self = this;
	this.title = "Controls and Keybinds";
	//this.w = 300;

	// init the container element first
	this.container = this.createNodeElement({name: "div", className: "ui-container ui-default-container"});
	
	// addElement needs this.container to be a valid html5 element
	// element order mostly depends on css rules i guess idk
	var title = this.addElement({name: "div", className: "no-hide ui-default-title noselect", text: this.title});
	var remove = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-remove"}, title);
	var hide = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-hide"}, title);
	var resize = this.addElement({name: "div", className: "ui-default-icon ui-default-icon-resize noselect"})
	var body = this.addElement({name: "div", className: "ui-controls-body"});

	this.addText(	"To remap an action click the input box and press a key. " +
					"The string displayed may not match the key you pressed but this is a visual bug.", 
					body, "text-size-small");
	this.addElement({name:"br"}, body);
	this.addElement({name:"br"}, body);
	this.addText("Movement keys", body);
	this.addElement({name:"br"}, body);

	var tmp = this.addElement({name: "div", className: "float-right"}, body);
	this.addText("Strafe Left: ",tmp);
	var strafeLeft = this.addElement({name: "input", className: "ui-controls-input", 
		attributes: [{	name: "value", value: Input.MOVE_LEFT.map},
					{	name: "readonly", value: ""}]}, tmp);
	this.addElement({name:"br", className: "clearfix"}, body);

	var tmp = this.addElement({name: "div", className: "float-right"}, body);
	this.addText("Strafe Right: ",tmp);
	var strafeRight = this.addElement({name: "input", className: "ui-controls-input", 
		attributes: [{	name: "value", value: Input.MOVE_RIGHT.map},
					{	name: "readonly", value: ""}]}, tmp);
	this.addElement({name:"br", className: "clearfix"}, body);

	var tmp = this.addElement({name: "div", className: "float-right"}, body);
	this.addText("Forward: ",tmp);
	var forward = this.addElement({name: "input", className: "ui-controls-input", 
		attributes: [{	name: "value", value: Input.MOVE_FORWARD.map},
					{	name: "readonly", value: ""}]}, tmp);
	this.addElement({name:"br", className: "clearfix"}, body);

	var tmp = this.addElement({name: "div", className: "float-right"}, body);
	this.addText("Backward: ",tmp);
	var backward = this.addElement({name: "input", className: "ui-controls-input", 
		attributes: [{	name: "value", value: Input.MOVE_BACKWARD.map},
					{	name: "readonly", value: ""}]}, tmp);
	this.addElement({name:"br", className: "clearfix"}, body);

	this.addElement({name:"br"}, body);
	this.addText("User Interface ", body);
	this.addElement({name:"br"}, body);

	var tmp = this.addElement({name: "div", className: "float-right"}, body);
	this.addText("Toggle Console: ",tmp);
	var toggleConsole = this.addElement({name: "input", className: "ui-controls-input", 
		attributes: [{	name: "value", value: Input.TOGGLE_CONSOLE.map},
					{	name: "readonly", value: ""}]}, tmp);
	this.addElement({name:"br", className: "clearfix"}, body);

	strafeLeft.addEventListener("keydown", function(e){
		var evt = new InputEvent(e);
		Input.MOVE_LEFT = evt;
		this.value = Input.MOVE_LEFT.map;
	});
	strafeRight.addEventListener("keydown", function(e){
		var evt = new InputEvent(e);
		Input.MOVE_RIGHT = evt;
		this.value = Input.MOVE_RIGHT.map;
	});
	forward.addEventListener("keydown", function(e){
		var evt = new InputEvent(e);
		Input.MOVE_FORWARD = evt;
		this.value = Input.MOVE_FORWARD.map;
	});
	backward.addEventListener("keydown", function(e){
		var evt = new InputEvent(e);
		Input.MOVE_BACKWARD = evt;
		this.value = Input.MOVE_BACKWARD.map;
	});
	toggleConsole.addEventListener("keydown", function(e){
		var evt = new InputEvent(e);
		Input.TOGGLE_CONSOLE = evt;
		this.value = Input.TOGGLE_CONSOLE.map;
	});

	/*this.addText("stuff", body);
	this.addElement({name:"br"}, body);

	var tmp = this.addElement({name: "div", className: "float-right"}, body);
	this.addText(": ",tmp);
	this.addElement({name: "input", className: "ui-controls-input", 
		attributes: [{name: "value", value: String.fromCharCode(Input.KEY_A)}]}, tmp);
	this.addElement({name:"br"}, body);*/

	this.addElement({name:"span", className: "clearfix"}, body);





	
	//var footer = this.addElement({name: "div", className:"ui-example-footer"});

	// this.events is a a UIBehavior object created by the container super class
	/*this.events.addDragEvent(title);
	this.events.addRemoveEvent(remove);
	this.events.addHideEvent(hide);
	this.events.addDragEvent(resize, true);*/

	this.addDragEvent(title);
	this.addRemoveEvent(remove);
	this.addHideEvent(hide);
	this.addDragEvent(resize, true);

	this.appendContainer();
	this.update({x: this.x, y: this.y, h: this.h, pushIndex: true});
}
ContainerControls.prototype = Object.create(Container.prototype);
ContainerControls.prototype.constructor = ContainerControls;

// 
function ContainerExample(opt) { // container template for UserInterface
	Container.call(this, opt);

	var self = this;

	// init the container element first
	this.container = this.createNodeElement({name: "div", className: "ui-container ui-default-container"});
	
	// addElement needs this.container to be a valid html5 element
	// element order mostly depends on css rules i guess idk
	var title = this.addElement({name: "div", className: "no-hide ui-default-title noselect", text: this.title});
	var remove = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-remove"}, title);
	var hide = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-hide"}, title);
	var resize = this.addElement({name: "div", className: "ui-default-icon ui-default-icon-resize noselect"})
	var body = this.addElement({name: "div", className: "ui-default-body"});
	this.textArea = this.addElement({name: "div", className: "ui-default-textarea"}, body); 
	this.addText("^12353Hello ^834522world", this.textArea);
	//var footer = this.addElement({name: "div", className:"ui-example-footer"});

	// this.events is a a UIBehavior object created by the container super class
	/*this.events.addDragEvent(title);
	this.events.addRemoveEvent(remove);
	this.events.addHideEvent(hide);
	this.events.addDragEvent(resize, true);*/

	this.addDragEvent(title);
	this.addRemoveEvent(remove);
	this.addHideEvent(hide);
	this.addDragEvent(resize, true);

	this.appendContainer();
	this.update({x: this.x, y: this.y, pushIndex: true});
}
ContainerExample.prototype = Object.create(Container.prototype);
ContainerExample.prototype.constructor = ContainerExample;

// 
function ContainerInventory(opt) {
	Container.call(this, opt);

	var self = this;
	this.game = opt.invoker.game;
	this.invoker = opt.invoker;
	console.log(opt);

	// init the container element first
	this.container = this.createNodeElement({name: "div", className: "ui-container ui-default-container"});
	
	// addElement needs this.container to be a valid html5 element
	// element order mostly depends on css rules i guess idk
	var title = this.addElement({name: "div", className: "no-hide ui-default-title noselect", text: this.title});
	var remove = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-remove"}, title);
	var hide = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-hide"}, title);
	var resize = this.addElement({name: "div", className: "ui-default-icon ui-default-icon-resize noselect"})
	var body = this.addElement({name: "div", className: "ui-example-body"});
	this.textArea = this.addElement({name: "div", className: "ui-example-textarea"}, body); 
	var footer = this.addElement({name: "div", className:"ui-example-footer"});

	this.addDragEvent(title);
	this.addRemoveEvent(remove);
	this.addHideEvent(hide);
	this.addDragEvent(resize, true);

	this.input = this.addElement({name: "input", className: "ui-example-input", 
		attributes: [{name: "placeholder", value: "> Press return to send"}]}, footer);
	this.input.onkeydown = function(e) {
		self.send(e);
	};

	this.appendContainer();
	this.update({x: this.x, y: this.y, w: this.w, h: this.h, pushIndex: true});
}
ContainerInventory.prototype = Object.create(Container.prototype);
ContainerInventory.prototype.constructor = ContainerInventory;

// 
ContainerInventory.prototype.send = function(e) {
	if (e) {
		var evt = new InputEvent(e);
		if (evt.key == Input.KEY_ENTER) {
			var input = this.input.value;
			
			this.appendText((new ConsoleCommand(this.invoker, input)).text);

			this.input.value = "";
			//this.addElement({name: "br"}, this.textArea);
			//this.textArea.scrollTop = this.textArea.scrollHeight;
		}
	}
};

ContainerInventory.prototype.appendText = function(text) {
	this.addText(text, this.textArea);
	this.addElement({name: "br"}, this.textArea);

	this.textArea.scrollTop = this.textArea.scrollHeight;
};
function Container(opt) {
	/* all containers should prolly inherit this class prolly
	*/
	this.container = null;
	//this.events = new UIBehaviors(this);
	this.title = "";
	this.x = 5;
	this.y = 5;
	this.w = 200; // width and height should probably match the container min/max size values
	this.h = 100;
	this.removed = false;
	this.hidden = false;

	if (opt !== undefined) {
		if (opt.title !== undefined) {
			this.title = opt.title;
		}
		if (opt.removable !== undefined) {
			this.removable = opt.removable;
		}
		if (opt.minimizable !== undefined) {
			this.minimizable = opt.minimizable;
		}
		if (opt.resizable !== undefined) {
			this.resizable = opt.resizable;
		}
		if (opt.x !== undefined) {
			this.x = opt.x;
		}
		if (opt.y !== undefined) {
			this.y = opt.y;
		}
		if (opt.w !== undefined) {
			this.w = opt.w;
		}
		if (opt.h !== undefined) {
			this.h = opt.h;
		}

	}
}
Container.prototype.updateCallback = function() {
	return null;
};
Container.prototype.update = function(opt) {
	/* alter container properties and other behaviors
	*/
	if (opt.pushIndex !== undefined) {
		if (opt.pushIndex == true) {// todo: i really don't like doing this
			this.container.style.zIndex = ++window.topIndex;
		}
	}
	if (opt.pushIndexHigh !== undefined) {
		this.container.style.zIndex = 10000000;
	}
	if (opt.x !== undefined) {
		this.x = opt.x;
	}
	if (opt.y !== undefined) {
		this.y = opt.y;
	}
	if (opt.w !== undefined) {
		this.w = opt.w;
		this.container.style.width = this.w + "px";
	}
	if (opt.h !== undefined) {
		this.h = opt.h;
		this.container.style.height = this.h + "px";
	}
	if (opt.snap !== undefined) {
		if (opt.snap.left !== undefined) {
			this.x = 5;
		} else if (opt.snap.right !== undefined) {
			this.x = (window.innerWidth - this.w) - 7;
		}
		if (opt.snap.left !== undefined && opt.snap.right !== undefined) {
			this.x = (window.innerWidth - this.w) / 2;
		}

		if (opt.snap.top !== undefined) {
			this.y = 5;
		} else if (opt.snap.bottom !== undefined) {
			this.y = (window.innerHeight - this.h) - 7;
		}
		if (opt.snap.top !== undefined && opt.snap.bottom !== undefined) {
			this.y = (window.innerHeight - this.h) / 2;
		}

		if (opt.snap.center !== undefined) {
			this.y = (window.innerHeight - this.h) / 2;
			this.x = (window.innerWidth - this.w) / 2;
		}
	}

	//this.x = clamp(this.x, 0, window-)

	this.container.style.left = this.x + "px";
	this.container.style.top = this.y + "px";

};
Container.prototype.addElement = function(opt, parent) {
	/* attempts to create a new node then append it to either this.container or parent if it's defined
	*/
	var element = this.createNodeElement(opt);
	if (parent!==undefined) {
		parent.appendChild(element);
	} 
	else {
		this.container.appendChild(element);
	}

	this.addZIndexEvent(element);
	return element;
};
Container.prototype.createNodeElement = function(opt) {
	/* should only ever be directly used when defining this.container
		opt properties:
			<opt.name value='opt.value'>
	*/
	if (opt.name == undefined || opt.name == null)  return;
	
	var node = document.createElement(opt.name);
	if (opt.className !== undefined) {
		node.className = opt.className;// !== undefined ? opt.className : "");
	}

	if (opt.attributes !== undefined) {
		// add anything that is not covered by opt
		for(var i = 0; i < opt.attributes.length; i++) {
			node.setAttribute(opt.attributes[i].name, opt.attributes[i].value);
		}
	}
	if (opt.id !== undefined) {
		node.id = opt.id;
	}
	if (opt.value !== undefined) {
		node.value = opt.value;
	}

	var textNode = null;
	if (opt.text !== undefined) {
		textNode = document.createTextNode(opt.text);
		node.appendChild(textNode);
	}

	if (opt.type !== undefined) {
		node.type = opt.type;
	}
	return node;
};
Container.prototype.appendContainer = function() {
	/* should only ever be directly used once, at the end of the container constructor
	*/
	document.body.appendChild(this.container);
};
Container.prototype.addText = function(msg, parent, classNames) {
	// for coloring text quake style but takes an integar as rgb
	// todo: this does not work well with text elements that are meant to be changed
	var color = "text-color-white ";
	var classNames = classNames === undefined ? "" : classNames;
	if (typeof msg === "string") {
		var lines = msg.split(/(\^+\d*)/);
		for(var i = 0; i < lines.length; ++i) {
			if (lines[i].length > 0) {
				var style = "";
				if (lines[i][0] == "^") {
					var selector = parseInt(lines[i].replace("^", ''), 10);
					style = "color: " + int2rgb(selector);

					this.addElement({name: "span", className: classNames,
								text: lines[++i], // print next message because ^# came first
								attributes: [{name: "style", value: style}]}, parent); // print next line
				}
				else { // a regular message with no color styling
					this.addElement({name: "span", className: color + classNames, 
								text: lines[i]}, parent);
				}
			}
		};
	}
	else {
		this.addElement({name: "span", className: color, 
								text: msg}, parent);
	}
};

// events
Container.prototype.addRemoveEvent = function(element) {
	var self = this;
	function remove() {
		document.body.removeChild(self.container);
		self.removed = true;
	}
	element.addEventListener("click", remove);
};
Container.prototype.hide = function(opt) {
	/* hide the element doi
	*/
	var className = "ui-default-collapsed";
	if (opt !== undefined) {
		if (opt.className !== undefined) {
			className = opt.className;
		}
		if (opt == 1) {
			className = "ui-hidden";
		}

	}
	var regex = new RegExp("(?:^|\\s)" + className + "(?!\\S)", 'g');

	if (!this.hidden) {
		this.hidden = true;
		this.container.className += " " + className;
		for(var i = 0; i < this.container.children.length; i++) { // hide container contents because position: absolute; and im at my breaking point with css rn
			var chillens = this.container.children[i];
			if (chillens.className.match('no-hide') == null) {
				chillens.className += " ui-hide"; 
			}
		}
	}
	else {
		this.hidden = false;
		this.container.className = this.container.className.replace(regex , '');
		for(var i = 0; i < this.container.children.length; i++) { // unhiding container contents
			var chillens = this.container.children[i];
			if (chillens.className.match('no-hide') == null) {
				chillens.className = chillens.className.replace(/(?:^|\s)ui-hide(?!\S)/g, '');
			}
		}
	}
	
};
Container.prototype.addHideEvent = function(element, opt) {
	/* hides a container and its children by adding or removing its collapsed/hidden className
	*/
	var self = this;

	function hide(opt) {
		self.hide(opt);
	}
	element.addEventListener("click", hide);
};
Container.prototype.addZIndexEvent = function(element) {
	/* pushes the elements container and children to the top most z index
	*/
	var self = this;
	function activate() {
		self.update({pushIndex: true});
	}

	element.addEventListener("mousedown", activate);
	element.addEventListener("touchstart", activate);
};
Container.prototype.addDragEvent = function(element, resize) {
	/* allows an elements container and children to be moved if the element has been clicked
	if resize is true then then it updates container width and height to the cursor from the bottom right corner
	*/
	var self = this;
	var d = { x: 0, y: 0 };
	function release(e) { // removes all listeners set by grab
		d = { x: 0, y: 0 };
		document.removeEventListener("mouseup", release);
		document.removeEventListener("mousemove", move);

		document.removeEventListener("touchend", release);
		document.removeEventListener("touchmove", move);
	}
	function move(e) {
		var evt = new InputEvent(e);
		var rect = self.container.getBoundingClientRect();

		var x = clamp(evt.x - d.x, 0, window.innerWidth - rect.width - 5);
		var y = clamp(evt.y - d.y, 0, window.innerHeight - rect.height - 5);
		var w = clamp(evt.x - rect.left, 0, window.innerWidth - rect.left - 5);
		var h = clamp(evt.y - rect.top, 25, window.innerHeight - rect.top - 5);
		
		if (resize===true) {
			//console.log(w, h);
			self.update({w: w, h: h});
		}
		else {
			self.update({x: x, y: y});
		}
	}
	function grab(e) {
		var evt = InputEvent(e);
		var rect = self.container.getBoundingClientRect();
		d = {x: evt.x - rect.left, y: evt.y - rect.top };
		
		document.addEventListener("mouseup", release);
		document.addEventListener("mousemove", move);

		document.addEventListener("touchend", release);
		document.addEventListener("touchmove", move);
	}

	element.addEventListener("mousedown", grab);
	element.addEventListener("touchstart", grab);
};
function ContainerLogin(opt) { // container template for UserInterface
	Container.call(this, opt);

	var self = this;

	// init the container element first
	this.container = this.createNodeElement({name: "div", className: "ui-container ui-default-container"});
	
	// addElement needs this.container to be a valid html5 element
	// element order mostly depends on css rules i guess idk
	var title = this.addElement({name: "div", className: "no-hide ui-default-title noselect", text: this.title});
	//var remove = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-remove"}, title);
	var hide = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-hide"}, title);
	var body = this.addElement({name: "div", className: "ui-login-body"});

	/*this.username = this.addElement({name: "input", className: "ui-login-input ui-input", attributes: 
		[{name: "placeholder", value: "Username"}, {name: "minlength", value: "3"}, {name: "maxlength", value: "18"}]}, body);
	this.password = this.addElement({name: "input", className: "ui-login-input ui-input", attributes: 
		[{name: "placeholder", value: "Password"}, {name: "minlength", value: "3"}, {name: "maxlength", value: "32"},
		{name: "type", value: "password"}]}, body);*/

	this.login = this.addElement({name: "button", text: "Login", className: "ui-login-button ui-button"}, body);
	//this.addElement({name:"span", className: "float-left", text: "\ud83d\ude02"}, this.login);
	this.register = this.addElement({name: "button", text: "Register", className: "ui-login-button ui-button"}, body);
	//this.addElement({name:"span", className: "float-left", text: "\u{1f4a9}"}, this.register);
	this.guest = this.addElement({name: "button", text: "Play as a Guest", className: "ui-login-button ui-button"}, body);
	//this.addElement({name:"span", className: "float-left", text: "\u{1f4af}"}, this.guest);
	this.login.onclick = (e)=>{
		// don't want nosy prints vomiting plain text passwords when they're received
		//var crypt = new sjcl.hash.sha256();
		//crypt.update(this.password.value);
		//var hash = sjcl.codec.base64.fromBits(crypt.finalize());
		
		opt.game.net.connect();
		console.log(opt.game.net);
		throw new Error("todo: finish implementing login");

	}
	this.register.onclick = (e) => {
		// registration/account recovery is handled through a web page
		window.location.href = Config.serverAddress.register;
	}
	this.guest.onclick = (e)=>{ 
		new Note("Guest mode is not implemented");
	}
	//var footer = this.addElement({name: "div", className:"ui-example-footer"});

	// this.events is a a UIBehavior object created by the container super class
	/*this.events.addDragEvent(title);
	this.events.addRemoveEvent(remove);
	this.events.addHideEvent(hide);
	this.events.addDragEvent(resize, true);*/

	this.addDragEvent(title);
	//this.addRemoveEvent(remove);
	this.addHideEvent(hide);

	this.appendContainer();
	this.update({x: this.x, y: this.y, w: this.w, h: this.h, pushIndex: true});
}
ContainerLogin.prototype = Object.create(Container.prototype);
ContainerLogin.prototype.constructor = ContainerLogin;

// 
/* 
*/
function ContainerMetrics(opt) { // container template for UserInterface
	Container.call(this, opt);

	var self = this;
	this.title = "Metrics";
	console.log(opt);
	this.metrics = opt.invoker.metrics;
	this.invoker = opt.invoker;


	// init the container element first
	this.container = this.createNodeElement({name: "div", className: "ui-container ui-default-container"});
	
	// addElement needs this.container to be a valid html5 element
	// element order mostly depends on css rules i guess idk
	var title = this.addElement({name: "div", className: "no-hide ui-default-title noselect", text: this.title});
	var remove = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-remove"}, title);
	var hide = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-hide"}, title);
	//var resize = this.addElement({name: "div", className: "ui-default-icon ui-default-icon-resize noselect"})
	this.body = this.addElement({name: "div", className: "ui-default-body"});

	this.addDragEvent(title);
	this.addRemoveEvent(remove);
	this.addHideEvent(hide);
	//this.addDragEvent(resize, true);

	this.appendContainer();
	this.update({x: this.x, y: this.y, pushIndex: true});

	this.fps = this.addElement({name: "span"}, this.body);
	this.addText("fps: ", this.fps);
	this.addElement({name: "br"}, this.body);
	this.sps = this.addElement({name: "span"}, this.body);
	this.addText("step rate: ", this.sps);
	this.addElement({name: "br"}, this.body);
	this.latency = this.addElement({name: "span"}, this.body);
	this.addText("latency: ", this.latency);

	this.lastUpdate = 0; // prevents updateTextCallback from creating hundreds of spans per second

	this.timer = setTimeout(function() {
		self.updateCallback();
	}, 1000);
}
ContainerMetrics.prototype = Object.create(Container.prototype);
ContainerMetrics.prototype.constructor = ContainerMetrics;

ContainerMetrics.prototype.init = function() {
	// body...
};
// 
ContainerMetrics.prototype.updateCallback = function() {
	var self = this;

	while(this.fps.children.length > 0) {
		this.fps.removeChild(this.fps.children[0]);
	}
	while(this.sps.children.length > 0) {
		this.sps.removeChild(this.sps.children[0]);
	}
	while(this.latency.children.length > 0) {
		this.latency.removeChild(this.latency.children[0]);
	}
	fcolor = 65280; // green
	scolor = 65280;
	lcolor = 65280;
	var obj = {	fps: this.metrics.render.framesPerSecond, 
				sps: this.metrics.update.stepsPerSecond,
				latency: this.invoker.net.ping};
	if (obj.fps < 25) {
		fcolor = 16711680; // red
		
	} else if (obj.fps <= 45) {
		fcolor = 16776960;	// yeller
	}

	if (obj.sps < 25) {
		scolor = 16711680;
		
	} else if (obj.sps < 30) {
		scolor = 16776960;	
	}

	if (obj.latency > 230) {
		lcolor = 16711680;		
	} else if (obj.latency > 175) {
		lcolor = 16776960;
	}
	this.addText("fps: ^" + fcolor + "\0" + obj.fps, this.fps);
	this.addText("step rate: ^" + scolor + "\0" + obj.sps, this.sps);
	this.addText("latency: ^" + lcolor + "\0" + obj.latency, this.latency);
	//this.lastUpdate = obj.dt;
	clearTimeout(this.timer);
	this.timer = setTimeout(function() {
		self.updateCallback();
	}, 1000);
};
/*ContainerMetrics.prototype.updateCallback2 = function(obj) {
	if (this.lastUpdate+1000 < obj.dt) {
		while(this.fps.children.length > 0) {
			this.fps.removeChild(this.fps.children[0]);
		}
		while(this.sps.children.length > 0) {
			this.sps.removeChild(this.sps.children[0]);
		}
		fcolor = 65280; // green
		scolor = 65280;
		obj.sps = 30;
		if (obj.fps < 25) {
			fcolor = 16711680; // red
			
		} else if (obj.fps <= 45) {
			fcolor = 16776960;	// yeller
		}
		if (obj.sps < 25) {
			scolor = 16711680;
			
		} else if (obj.sps < 30) {
			scolor = 16776960;	
		}
		this.addText("fps: ^" + fcolor + "\0" + obj.fps, this.fps);
		this.addText("step rate: ^" + scolor + "\0" + obj.sps, this.sps);
		this.lastUpdate = obj.dt;
	}
};
*/
function ContainerNetDebugger(net) {
	Container.call(this, {});

	var self = this;
	this.w = 400;
	this.h = 510;
	
	this.net = net; // Main.net reference

	// init the container element first
	this.container = this.createNodeElement({name: "div", className: "ui-container ui-default-container"});
	
	// addElement needs this.container to be a valid html5 element
	// element order mostly depends on css rules i guess idk
	var title = this.addElement({name: "div", className: "no-hide ui-default-title noselect", 
		text: "Network message debugger"});
	var remove = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-remove"}, title);
	var hide = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-hide"}, title);
	var body = this.addElement({name: "div", className: "ui-default-body"});
	//var resize = this.addElement({name: "div", className: "ui-default-icon ui-default-icon-resize noselect"})
	


	var frame = this.addElement({name: "div", className: "ui-default-frame"}, body);
	var selectMsg = this.addElement({name: "select"}, frame);
	this.addElement({name: "option", text: "none"}, selectMsg);
	//this.addElement({name: "option", text: "NetworkBlob"}, selectMsg);
	this.addElement({name: "option", text: "ChatBlob"}, selectMsg);
	this.addElement({name: "br"}, frame);



	this.addText("deserialized message:", frame);
	this.addElement({name: "br"}, frame);
	
	var frameFragment = this.addElement({name: "input", className: "ui-default-input ui-wide", 
			attributes: [{name: "value", value: "{}"}]
		}, frame);
	
	this.addElement({name: "br"}, frame);

	var addFragment = this.addElement({name: "button", text: "Add Message", 
		className: "ui-default-button ui-button ui-top-spaced"}, frame);
	
	this.addElement({name: "br"}, frame);
	this.addText("deserialized frame:", frame);
	this.addElement({name: "br"}, frame);
	
	var frames = this.addElement({name: "textarea", className: "ui-default-textarea ui-wide", 
		text: JSON.stringify(this.net.frame)}, frame);
	
	//this.addElement({name: "br"}, frame);

	var send = this.addElement({name: "button", text: "Send Frame", className: "ui-default-button ui-button"}, frame);
	
	var noClear = this.addElement({name: "input", id: "checkbox-net1", className: "", type: "checkbox"}, frame);
		this.addElement({name: "label", text: "clear frame on send", attributes: [{name: "for", value: "checkbox-net1"}]}, frame);

	this.addElement({name: "br"}, frame);
	this.incoming = this.addElement({name: "textarea", className: "ui-default-textarea ui-wide", text: ""}, frame);

	selectMsg.onchange = () => {
		if (selectMsg.value !== "none" || selectMsg.value !== "") {
			var t = eval(("new " + selectMsg.value + "({});"));
			frameFragment.value = JSON.stringify(t);
		}
	}
	addFragment.onclick = () => {
		try {
			tmp = JSON.parse(frameFragment.value);
			this.net.frame.push(tmp);
		}
		catch {
			console.log("fukken error");
		}
		finally {
			frames.value = JSON.stringify(this.net.frame);

		}
		

	};
	send.onclick = () => {
		if (!noClear.checked) {
			this.net.debugSendFrame();
		}
		else {
			this.net.sendFrame();
		}
		frames.value = JSON.stringify(this.net.frame);
	};
	
	this.addDragEvent(title);
	this.addRemoveEvent(remove);
	this.addHideEvent(hide);
	//this.addDragEvent(resize, true);

	this.appendContainer();
	this.update({x: this.x, y: this.y, w: this.w, h: this.h, pushIndex: true});

	var self = this;
	Events.register("networkOnMessage", (e) => {
		this.networkEventListener(e);
	});
}
ContainerNetDebugger.prototype = Object.create(Container.prototype);
ContainerNetDebugger.prototype.constructor = ContainerNetDebugger;


ContainerNetDebugger.prototype.networkEventListener = function(event) {
	this.incoming.value += "== " + ((new Date()).getTime()) + " ==\n" + event + "\n---------------\n";
	this.incoming.scrollTop = this.incoming.scrollHeight;
};
function Note(msg) {
	Container.call(this, undefined);

	var self = this;

	// init the container element first
	this.container = this.createNodeElement({name: "div", className: "ui-default-notification-container ui-default-notification-container noselect"});
	var body = this.addElement({name: "div", className: "ui-default-notification-body"});
	this.addText(msg, body);

	setTimeout(function() {
		document.body.removeChild(self.container);
	}, 10000); // remove this container after 10 seconds

	this.appendContainer();
	this.update({x: this.x, y: this.y, pushIndex: true});
}
Note.prototype = Object.create(Container.prototype);
Note.prototype.constructor = Note;

function ContainerOptions(opt) { // used for rebinding controls
	Container.call(this, opt);

	var self = this;
	this.title = "Options & Settings";
	//this.w = 300;

	// init the container element first
	this.container = this.createNodeElement({name: "div", className: "ui-container ui-default-container"});
	
	// addElement needs this.container to be a valid html5 element
	// element order mostly depends on css rules i guess idk
	var title = this.addElement({name: "div", className: "no-hide ui-default-title noselect", text: this.title});
	var remove = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-remove"}, title);
	var hide = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-hide"}, title);
	var resize = this.addElement({name: "div", className: "ui-default-icon ui-default-icon-resize noselect"})
	var body = this.addElement({name: "div", className: "ui-controls-body"});

	this.addElement({name:"button"}, body);
	this.addElement({name:"button"}, body);

	this.addElement({name:"span", className: "clearfix"}, body);

	this.addDragEvent(title);
	this.addRemoveEvent(remove);
	this.addHideEvent(hide);
	this.addDragEvent(resize, true);

	this.appendContainer();
	this.update({x: this.x, y: this.y, h: this.h, pushIndex: true});
}
ContainerOptions.prototype = Object.create(Container.prototype);
ContainerOptions.prototype.constructor = ContainerOptions;

// 
function UserInterface(invoker) {
	/*
	*/
	console.log(invoker);
	var self = this;
	this.invoker = invoker;
	
	window.topIndex = 0;

	this.elements = []; // map 

	//var metrics = new ContainerMetrics({metrics: this.invoker.metrics});
	var consoleOpt = {invoker: this.invoker, title: "Console", w: 450, h: 250};

	this.elements["console"] = new ContainerConsole(consoleOpt);
	this.elements["console"].update({snap: {right: true}});
	//this.elements["console"].hide();
	//console.update({snap: {top: true, left: true}});
	//var myconsole = null;
	/*Controller.addInputEvent(Input.KEY_TAB, function() {
		if (console==null || console.removed == true) {
			console = new ContainerConsole({game: self.invoker, title: "console", w: 275, h: 150});
		}
		else {
			console.hide();
		}
	}, true);*/
	document.addEventListener("keydown", function(e) {
		var evt = new InputEvent(e);
		if (evt.key == Input.TOGGLE_CONSOLE.key) {
			if (self.elements["console"]==null || self.elements["console"].removed == true) {
				self.elements["console"] = new ContainerConsole(consoleOpt);
			}
			else {
				self.elements["console"].hide();
			}
			e.stopPropagation();
			e.preventDefault();
		}

	});

	new Note("Press " + Input.TOGGLE_CONSOLE.map + " to enable the console");

	//(new ContainerLogin({title: "Join", w: 230, h: 190, y: 75, game: this.invoker}))
	//	.update({snap: {left: true, right: true}});

	/*
	new ContainerControls({w: 165, h: 300});*/
	/*setTimeout(function() {
		
	}, 100);*/
};

UserInterface.prototype.get = function(name) {
	if (this.elements[name] !== undefined)
		if (this.elements[name].removed == false)
			return this.elements[name];
	return null;
};

/* write data to a console UI element
*/
UserInterface.prototype.console = function(msg) {
	var out = this.get("console");
	if (out==null) {
		console.log(msg);
	}
	else {
		out.appendText(msg);
	}
};

UserInterface.prototype.addElement = function(name, obj) {
	this.elements[name] = obj;
};