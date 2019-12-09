function ResourceManager(preloaded) {
	var self = this;
	this.resources = preloaded || new Array();
	this.resources['default'] = new Image();
	this.resources['default'].isReady = true;
	this.resources['default'].src = "/bin/client/data/grass.png";
	/*preloaded.forEach(function(e) {
		self.resources
	});*/


	this.resourceSet = new Set();

	console.log(this);
}
ResourceManager.prototype.get = function(key) {
	if (this.resources[key] !== undefined && this.resources[key].isReady)
		return this.resources[key];
	return null;
};
ResourceManager.prototype.add = function(key, asset) {
	this.resources[key] = asset;
};