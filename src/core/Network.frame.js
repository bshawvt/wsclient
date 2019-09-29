function NetworkFrame() {
	this.size = 0;
	this.messages = [];
}
NetworkFrame.prototype.push = function(msg) {
	this.messages.push(msg);
	this.size = this.messages.length;
};
NetworkFrame.prototype.serialize = function() {
	return JSON.stringify(this);
};
NetworkFrame.prototype.clear = function() {
	this.messages = [];
	this.size = 0;
};