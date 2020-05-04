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