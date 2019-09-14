function Profiler() {
	var self = this;
	this.start = 0;
	this.end = 0;

	this.start = function() {
		self.start = (new Date()).getTime();
	}
	this.stop = function() {
		self.end = (new Date()).getTime();
		console.log("elapsed in ms: ", (self.end - self.start) );
	}
}


// console.log = function() {}; // silence console spam