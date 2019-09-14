var Config = {

	sauce: "/src/project.json",
	version: {client: "", server: ""},
	serverAddress: {
		game: {address: "wss://govehill.dynu.net", port: 443},
		register: "auth/portal.php",
		recovery: "auth/portal.php"
	},

	defaults: {
		log: console.log,
		error: console.error,
		int2rgb: "rgb(255, 255, 255);"
	},

	overrides: { // todo
		log: function() { return 0; }, // console.log
		error: function() { return 0; } // console.error
	},

	override: function(active) {
		if (active) { // mostly just for annoying spam
			if (this.overrides.log) {
				console.log = this.overrides.log;
			}
			if (this.overrides.error) {
				console.error = this.overrides.error;
			}
		}
		else { // set overrides back to their defaults
			console.log = this.defaults.log;
			console.error = this.defaults.error;
		}
	},

	consoleCheck: false/*,
	
	// NO COOL THINGS ALLOWED IN JAVASCRIPTLANDIA

	init: function() {

		// load sauce
		this.load(this.sauce)
		


	},

	load: function(url) {
		var self = this;
		var req = new XMLHttpRequest();
		req.open('GET', url + "?v=" + (new Date()).getTime());
		req.onreadystatechange = function(r) {
			if (req.readyState === 4 && req.status === 200) {
				console.log("fetched: " + url);
				self.onload(req.response, url)
			}
		}
		req.send();
	},

	_loadState: 0,
	_sourceList: [],
	onload: function(response, url) {
		//var type = url.match(/\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gi)[0]; // file extension
		*/
		//var filename = url.match(/\/+[a-z0-9_.]*/gi);
		/*filename = filename[filename.length - 1].replace("/", '');

		if (filename == 'project.json' && this._loadState == 0) {
			console.log("loading project.json for the first time");
			this._loadState = 1;
			this._sourceList = JSON.parse(response).f;
			this._sourceList.sort(function(a, b) {
    			console.log(a.length, b.length)
    			if (a.length < b.length) 
    				return 1;
    			return -1;
			});

			var c = 0;
			for(var i = 0; i < this._sourceList.length; i++) {
				var item = this._sourceList[i];
				this.preloadScript("/src/" + item);
			}

			setTimeout(()=>{
				while (this._sourceList.length > 0) {
					var item = this._sourceList.pop();
					this.inject("/src/" + item);
				}
			}, 10);

		}

	},

	preloadScript: function(url) {
		node = document.createElement('link');
		node.href = url;// + "?v=" + (new Date()).getTime();
		node.rel = "preload";
		node.as = "script";
		document.head.appendChild(node);
	},

	inject: function(url) {

		var type = url.match(/\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gi)[0];
		var node = null;

		switch(type) {
			case ".css": {
				node = document.createElement('style');
				node.type = "text/css";
				//node.appendChild(document.createTextNode(response));
				break;
			}
			case ".js": {
				node = document.createElement('script');
				node.setAttribute("defer", true);
				node.type = "application/javascript";
				break;
			}
			case ".json": {
				node = document.createElement('script');
				node.type = "application/json";
				break;
			}
			default: {
				break
			}
		}

		node.src = url;// + "?v=" + (new Date()).getTime();
		document.body.appendChild(node);
	}*/

}