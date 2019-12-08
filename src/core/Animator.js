/*	oddwarg loop! 
	param: target - expects an object with a frame, render and flush method 
	will also generate a canvas element if target context does not have one */
function Animator(target) {
	var self = this;

	if (target.render === undefined || target.frame === undefined || target.flush === undefined) {
		throw "Animator error: target is missing required frame, flush and/or render methods ";
	}

	this.dt = (new Date()).getTime();
	this.done = false;

	this.animate = function(timestamp) {
		if (self.done) return;

		var now = (new Date()).getTime();
		if (now - self.dt > 1000) {
			console.error("sKiPPing fRAmeS");
			self.dt = now;
		}

		target.flush();
		while (self.dt < now) {
			target.frame(self.dt);
			self.dt += target.TimeStep;
		}

		target.render(self.dt);
		window.requestAnimationFrame(function(timestamp) {
			self.animate(timestamp);
		});
	};

	// begin
	this.animate(0);

};

/* interupts animate loop */
Animator.prototype.stop = function() {
	this.done = true;
};

/*  */
Animator.prototype.onResize = function() {

};