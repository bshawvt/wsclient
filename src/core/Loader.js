/* loader class 
	loads a list of stuff and then does a thing when it's done */
function Loader(sources, callback) {
	var self = this;
	var html = document.createElement('div');
	//html.style.display = "hidden";
	document.body.appendChild(html);

	this.resource = { images: [], sounds: [], models: [] };

	this.loads = 0;
	this.loadCount = sources.length;

	for(var i = 0; i < sources.length; i++) {

		var split = sources[i].split(".");
		var type = split[split.length - 1];
		var path = sources[i].split(/\/|\\/g);
		var filename = path[path.length - 1];

		switch (type) {
			case "jpg":
			case "jpeg":  
			case "png": {
				
				var img = document.createElement('img');
				img.onload = function() {
					//console.log(this);
					self.onLoad(callback, this);
				}
				this.resource.images[filename] = img;
				img.src = sources[i];
				html.appendChild(img);
				break;
			}
			case "mp3": {
				var snd = document.createElement('audio');

				snd.onload = function() {
					self.onLoad(callback, this);
				}

				html.appendChild(snd);
				break;
			}
			case "css": {
				var link = document.createElement('link');
				link.rel = "stylesheet";
				link.type = "text/css";

				link.onload = function() {
					self.onLoad(callback, this);
				}

				link.href = sources[i];
				html.appendChild(link);
				break;
			}
			case "json":
			case "js": {
				var script = document.createElement('script');
				script.type = "application/javascript";

				script.onload = function() {
					self.onLoad(callback, this);
				}

				script.src = sources[i];
				html.appendChild(script);
				break;
			}
			default: {
				// todo: 
				throw "Loader error: unknown file type";
				break;
			}
		}
	}

	this.html = html; // lazy

	// doing cleanup now that the scripts/stylesheets have been loaded
	//document.body.removeChild(html);
};
Loader.prototype.clean = function() {
	// body...
	document.body.removeChild(this.html);
};
/* onLoad is called each time a script has finished loading
	it will attempt to execute callback after all sources are loaded */
Loader.prototype.onLoad = function(callback, asset) {
	this.loads++;
	console.log(asset);
	callback((this.loads>=this.loadCount), asset);
	if (this.loads>=this.loadCount) 
		this.clean();
};

/* loader class 
	loads a list of stuff and then does a thing when it's done */
/*function Loader(sources, callback) {
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
			case "css": {
				element = document.createElement('link');
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
*/
/* onLoad is called each time a script has finished loading
	it will attempt to execute callback after all sources are loaded */
/*Loader.prototype.onLoad = function(callback) {
	this.loads++;
	if (this.loads>=this.loadCount) {
		callback();
	}
};*/