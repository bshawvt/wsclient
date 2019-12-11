/* loader class that loads a list of stuff and then does a thing when it's done 
	if an asset is anything but html/css/javascript then the asset will be saved 
	in the resource property

	params: sources - an array of full filename paths that will be loaded
		callback - a function that is called each time a resource has finished loading */
function Loader(sources, callback) {
	var self = this;
	var html = document.createElement('div');
	html.style.display = "none";
	document.body.appendChild(html);

	this.resource = new Array(); // will only contain assets that have finished loading

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
					var loadedFilename = this.src.split(/\/|\\/g);
					loadedFilename = loadedFilename[loadedFilename.length - 1];
					self.onLoad(callback, this, loadedFilename);
				}
				this.resource[filename] = img;
				img.src = sources[i];
				html.appendChild(img);
				break;
			}
			case "mp3": { // todo:
				var snd = document.createElement('audio');

				snd.onload = function() {
					var loadedFilename = this.src.split(/\/|\\/g);
					loadedFilename = loadedFilename[loadedFilename.length - 1];
					self.onLoad(callback, this, loadedFilename);
				}

				html.appendChild(snd);
				break;
			}
			case "css": {
				var link = document.createElement('link');
				link.rel = "stylesheet";
				link.type = "text/css";

				link.onload = function() {
					var loadedFilename = this.href.split(/\/|\\/g);
					loadedFilename = loadedFilename[loadedFilename.length - 1];
					self.onLoad(callback, this, loadedFilename);
				}

				link.href = sources[i];
				document.head.appendChild(link);
				break;
			}
			case "json":
			case "js": {
				var script = document.createElement('script');
				script.type = "application/javascript";

				script.onload = function() {
					var loadedFilename = this.src.split(/\/|\\/g);
					loadedFilename = loadedFilename[loadedFilename.length - 1];
					self.onLoad(callback, this, loadedFilename);
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
};
/* the only thing it doesn't remove is css links because that bjorks things */
Loader.prototype.clean = function() {
	document.body.removeChild(this.html);
};
/* onLoad is called each time a source has finished loading
	it will attempt to execute callback after all sources are loaded 
	params: callback ...
		asset - an html element
		key - the filename that was loaded 

	onload will push three arguments through
		done - true if the last resource in the set has loaded 
		asset - an html element
		key - the filename that was loaded */
Loader.prototype.onLoad = function(callback, asset, key) {
	this.loads++;
	asset.isReady = true;

	callback((this.loads>=this.loadCount), asset, key);
	if (this.loads>=this.loadCount) 
		this.clean();
};