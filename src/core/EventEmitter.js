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