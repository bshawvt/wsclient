/* oddwarg loop! 
	param: target - expects an object with a frame, render and flush method */
function Animator(target) {
	var self = this;

	if (target.render === undefined || target.frame === undefined || target.flush === undefined) {
		throw "error: Animator's target is missing required frame, flush and/or render methods ";
	}

	this.dt = (new Date()).getTime();
	this.done = false;
	this.fps = 0;
	this.fpsCounter = 0;
	this.frameStart = this.dt;

	this.animate = function(timestamp) {
		if (self.done) return;

		var now = (new Date()).getTime();
		if (this.dt > this.frameStart + 1000) { 
			console.log("fps: " + this.fps);
			this.fps = this.fpsCounter;
			this.fpsCounter = 0;
			this.frameStart = this.dt;
		}
		if (now - self.dt > 1000) {
			console.error("sKiPPing fRAmeS");
			self.dt = now;
			// todo: game should be notified of skips for reasons such as multiplayer
		}

		target.flush();
		while (self.dt < now) {
			self.dt += target.TimeStep;
			target.frame(self.dt);
		}

		target.render(self.dt);
		window.requestAnimationFrame(function(timestamp) {
			self.animate(timestamp);
		});
		this.fpsCounter++;

	};

	// begin
	this.animate(0);

};

/* interupts animate loop */
Animator.prototype.stop = function() {
	this.done = true;
};