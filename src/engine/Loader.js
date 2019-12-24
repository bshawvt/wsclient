// warning: there be dragons here
/* loader class that loads a list of stuff and then does a thing when it's done 
	if an asset is anything but html/css/javascript then the asset will be saved 
	in the resource property

	params: sources - an array of full filename paths that will be loaded
		callback - a function that is called each time a resource has finished loading */
function Loader(sources, callback) {
	var self = this;
	var html = document.getElementById('dynamic-loads');
	if (html === undefined || html === null) {
		html = document.createElement('div');
		html.setAttribute('id', 'dynamic-loads');
	}
	html.style.display = "none";

	document.body.appendChild(html);

	// css/js/html are not added to resource array
	this.resource = new Array(); // {data: Object, isLoaded: undefined, type: 'buf'}; or ResourceManager.MakeAsset
	this.loads = 0;
	this.loadCount = sources.length;

	for(var i = 0; i < sources.length; i++) {

		var split = sources[i].split(".");
		var type = split[split.length - 1];
		var path = sources[i].split(/\/|\\/g);
		var filename = path[path.length - 1];

		// todo: ResourceManager.GetResourceType uses the same types as this switch and should be adapted if it's ever used
		switch (type) {
			case "jpg":
			case "jpeg":  
			case "png": {				
				var img = document.createElement('img');
				img.onload = function() {
					var url = this.src.split(/[?#&]/g)[0];
					var loadedFilename = url.split(/\/|\\/g);
					loadedFilename = loadedFilename[loadedFilename.length - 1];
					self.resource[loadedFilename] = { data: this, type: 'img', isLoaded: true };
					self.onLoad(callback, this, loadedFilename);
				}
				//this.resource[filename] = {data: img, isLoaded: true, type: 'img'};
				img.src = sources[i] + "?v=" + (new Date()).getTime();
				html.appendChild(img);
				break;
			}
			case "wav":
			case "ogg":
			case "mp3": { // todo: 
				//if (!isMobile())
					/*(function() {
						var reqDefault = new XMLHttpRequest();
						reqDefault.open('POST', sources[i] + "?v=" + (new Date()).getTime(), true);
						reqDefault.responseType = "arraybuffer";
						
						reqDefault.onreadystatechange = function(a, b, c) {
							if (reqDefault.readyState === 4 && reqDefault.status === 200) {
								var url = reqDefault.responseURL.split(/[?#&]/g)[0];
								var loadedFilename = url.split(/\/|\\/g);
								loadedFilename = loadedFilename[loadedFilename.length - 1];
								
								var asset = {data: reqDefault.response, type: 'snd', isLoaded: true};
								self.resource[loadedFilename] = asset;
								self.onLoad(callback, asset, loadedFilename);
							}
						}
						reqDefault.send();
					})();*/
				/*else {*/
					var audio = document.createElement('audio');
					audio.oncanplaythrough = function() {
						this.oncanplaythrough = undefined; // oncanplaythrough will be called each time it is played
						var url = this.src.split(/[?#&]/g)[0];
						var loadedFilename = url.split(/\/|\\/g);
						loadedFilename = loadedFilename[loadedFilename.length - 1];
						this.play(); // 
						this.pause();
						self.resource[loadedFilename] = { data: this, type: 'snd', isLoaded: true };
						self.onLoad(callback, this, loadedFilename);
					}
					//this.resource[filename] = {data: audio, type:'snd'};//audio;
					audio.src = sources[i];// + "?v=" + (new Date()).getTime();
					html.appendChild(audio);
					console.warn("Warning: if a load stalls it's probably this: " + filename);
				/*}*/
				break;
			}
			case "css": {
				var link = document.createElement('link');
				link.rel = "stylesheet";
				link.type = "text/css";

				link.onload = function() {
					var url = this.href.split(/[?#&]/g)[0];
					var loadedFilename = url.split(/\/|\\/g);
					loadedFilename = loadedFilename[loadedFilename.length - 1];
					self.onLoad(callback, this, loadedFilename);
				}

				link.href = sources[i] + "?v=" + (new Date()).getTime();
				document.head.appendChild(link);
				break;
			}
			case "json":
			case "js": {
				var script = document.createElement('script');
				script.type = "application/javascript";

				script.onload = function() {
					var url = this.src.split(/[?#&]/g)[0];
					var loadedFilename = url.split(/\/|\\/g);
					loadedFilename = loadedFilename[loadedFilename.length - 1];
					self.onLoad(callback, this, loadedFilename);
				}

				script.src = sources[i] + "?v=" + (new Date()).getTime();
				html.appendChild(script);
				break;
			}
			default: {
				(function() {
					var reqDefault = new XMLHttpRequest();
					reqDefault.open(Config.loaderRequestType, sources[i] + "?v=" + (new Date()).getTime(), true);
					reqDefault.responseType = "arraybuffer";

					reqDefault.onreadystatechange = function(a, b, c) {
						if (reqDefault.readyState === 4 && reqDefault.status === 200) {
							var url = reqDefault.responseURL.split(/[?#&]/g)[0];
							var loadedFilename = url.split(/\/|\\/g);
							loadedFilename = loadedFilename[loadedFilename.length - 1];
							
							var asset = {data: reqDefault.response, type: 'buf', isLoaded: true};
							self.resource[loadedFilename] = asset;
							self.onLoad(callback, asset, loadedFilename);
						}
					}
					reqDefault.send();
				})();
				break;
			}
		}
	}

	this.html = html; // im lazy
};
/* the only thing it doesn't remove is css links because that bjorks things */
Loader.prototype.clean = function() {
	//document.body.removeChild(this.html);
};
/* onLoad is called each time a source has finished loading
	it will attempt to execute callback after all sources are loaded 
	params: callback ...
		asset - an html element
		key - the filename that was loaded 

	onload will push three arguments through
		done - value between 0 and 1, it's 1 if the last resource in the set has loaded 
		asset - an html element
		key - the filename that was loaded */
Loader.prototype.onLoad = function(callback, asset, key) {
	this.loads++;
	//if (this.resource[key] !== undefined) // html/css/js arent added to resource array
	//	this.resource[key].isLoaded = true;
	//console.log(asset);
	callback(this.loads / this.loadCount, asset, key);
	//console.log("??");
	if (this.loads>=this.loadCount) {
		this.clean();
	}
};