function Animator(target) {
	var self = this;

	this.dt = (new Date()).getTime();
	this.done = false;

	this.animate = function(timestamp) {
		if (self.done) return;

		var now = (new Date()).getTime();
		
		while (self.dt < now) {
			self.dt+= 1000/30;
			target.frame(self.dt);
		}

		target.render(self.dt);
		window.requestAnimationFrame(function(timestamp) {
			self.animate(timestamp)
		});
	};

	this.animate(0);
};

Animator.prototype.stop = function() {
	this.done = true;
};