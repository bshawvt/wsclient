/* this class tries to keep a record of assets
	params: preloaded - an array from Loader.js or similar */
function ResourceManager(preloaded) {
	var self = this;
	this.resources = preloaded || new Array();
	this.generateDefaults();

	//this.resourceSet = new Set();

	console.log(this);
}
/* only returns assets when they are full loaded 
	otherwise it returns null since resources can be many things 

	if null is received, the resource type can be set to one of the default */
ResourceManager.prototype.get = function(key) {
	//console.log(this.resources[key]);
	if (this.resources[key] !== undefined && this.resources[key].isLoaded)
		return this.resources[key];
	return null;
};
/* uses a map to store things
	it does not care if an asset already exists */
ResourceManager.prototype.add = function(key, asset) {
	this.resources[key] = asset;
};
/* creates default resources that the application 
	can use	as a fallback */
ResourceManager.prototype.generateDefaults = function() {

	this.resources['default_img'] = {data: new Image(), isLoaded: true, type: 'img'};

	if (this.tmpCanvas === undefined)
		this.tmpCanvas = document.createElement("canvas");
	this.tmpCanvas.width = 32;
	this.tmpCanvas.height = 32;

	var ctx = this.tmpCanvas.getContext('2d');
	ctx.beginPath();

	ctx.fillStyle = "rgb(255, 100, 100)";
	ctx.fillRect(0, 0, 16, 16);

	ctx.fillStyle = "rgb(100, 100, 255)";
	ctx.fillRect(16, 0, 16, 16);

	ctx.fillStyle = "rgb(100, 255, 100)";
	ctx.fillRect(0, 16, 16, 16);

	ctx.fillStyle = "rgb(255, 255 , 100)";
	ctx.fillRect(16, 16, 16, 16);

	ctx.closePath();
	this.resources['default_img'].data.src = this.tmpCanvas.toDataURL();

};
/* returns an object with type, data and isLoaded properties */
ResourceManager.GetResourceType = function(key) {
	var split = key.split(".");
	var type = split[split.length - 1];
	if (type==="png"||type==="jpg"||type==="jpeg")
		return "img";
	else if (type==="wav"||type==="ogg"||type==="mp3")
		return "snd";
	return 'buf';
}