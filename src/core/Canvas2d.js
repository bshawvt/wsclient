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
craw.img = function(img, opt) {
	var cnv = craw.__C2D_CANVAS;
	var ctx = craw.__C2D_CONTEXT;
	if (ctx==null) return;

	var x = opt.x || 0;
	var y = opt.y || 0;
	var w = opt.w || 200;
	var h = opt.h || 200;

	var ox = opt.ox || 0;
	var oy = opt.oy || 0;
	var sw = opt.sw || w;
	var sh = opt.sh || h;

	ctx.drawImage(img, ox, oy, sw, sh, x, y, w, h);

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