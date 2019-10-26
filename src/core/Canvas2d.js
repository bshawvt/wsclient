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
	this.canvas.style.backgroundColor = opt.color || "#ffffff";

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

craw.circle = function(opt) {
	var ctx = craw.__C2D_CONTEXT;
	if (ctx==null) return;

	opt = opt || {};
	var x = opt.x || 0;
	var y = opt.y || 0;
	var r = opt.r || 5;
	var weight = opt.weight || 1;
	var fill = opt.f || false;
	var color = opt.c || "#0f0f0f";
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
	console.log(element);
	// otherwise set the static variables to reflect new canvas
	craw.__C2D_CANVAS = element;
	craw.__C2D_CONTEXT = element.getContext('2d');
};
craw.__C2D_CANVAS = null;
craw.__C2D_CONTEXT = null;
craw.__C2D_PREV = null;