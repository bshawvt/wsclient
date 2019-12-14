function EventManager() {
	this.listeners = []; // map

}

EventManager.prototype.addListener = function(event, callback, once) {
	if (this.listeners[event] === undefined) {
		this.listeners[event] = new Set();
		console.log("listener init");
	}
	console.log("listener add");
	var l = this.listeners[event];
	if (l.has({event: event, callback: callback, once: once})) {
		console.log("has the thing");
	}
	else {
		l.add({event: event, callback: callback, once: once});
		console.log("has added the thing");
	}
	//this.listeners[event].push({event: event, callback: callback});
	//console.log({event: event, callback: callback}, this.listeners[event])
};
EventManager.prototype.removeListener = function(event, callback) {
	//this.listeners[event].push({callback: callback});
	if (this.listeners[event] === undefined) return;
	console.log(this.listeners[event].delete(callback));


};
EventManager.prototype.emit = function(event) {
	console.log(this.listeners);

	if (this.listeners[event] === undefined) return;

	var listener = this.listeners[event];
	listener.forEach( function(e) {
		if (typeof e.callback === "function")
			e.callback();
		if (e.once)
			listener.delete(e);
	});
};