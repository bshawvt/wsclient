/* loader class 
	loads a list of stuff and then does a thing when it's done */
function Loader(sources, callback) {
	var self = this;
	var html = document.createElement('div');
	document.body.appendChild(html);

	this.loads = 0;
	this.loadCount = sources.length;

	for(var i = 0; i < sources.length; i++) {
		var split = sources[i].split(".");
		var type = split[split.length - 1];

		var element = undefined;
		switch (type) {
			case "jpg":
			case "jpeg":
			case "png": {
				element = document.createElement('img');
				break;
			}
			default: {
				element = document.createElement('script');
				break;
			}
		}
		
		element.onload = function() {
			self.onLoad(callback);
		}
		element.src = sources[i];

		html.appendChild(element);
	}
	// doing cleanup now that the scripts have been loaded
	document.body.removeChild(html);
}

/* onLoad is called each time a script has finished loading
	it will attempt to execute callback after all sources are loaded */
Loader.prototype.onLoad = function(callback) {
	this.loads++;
	if (this.loads>=this.loadCount) {
		callback();
	}
};