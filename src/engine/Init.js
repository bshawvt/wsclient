function start(doc, win) {
	document = doc;
	window = win;
	var contentContainer = document.getElementById("app-content");

	// list of resources to preload
	var sources = [
	// audio loading tests
	/*"/bin/client/data/496757__erokia__ambient-wave-48-tribute.wav",
	"/bin/client/data/test1.wav",
	"/bin/client/data/test2.wav",
	"/bin/client/data/test3.wav",
	"/bin/client/data/test4.wav",
	"/bin/client/data/test5.wav",
	"/bin/client/data/test6.wav",
	"/bin/client/data/test7.wav",
	"/bin/client/data/test8.wav",
	"/bin/client/data/test9.wav",
	"/bin/client/data/test10.wav",*/
	/*"/bin/client/data/song1.mp3",
	"/bin/client/data/song2.mp3",
	"/bin/client/data/song3.mp3",
	"/bin/client/data/song4.mp3",
	"/bin/client/data/song5.mp3",
	"/bin/client/data/song6.mp3",
	"/bin/client/data/song7.mp3",
	"/bin/client/data/song8.mp3",
	"/bin/client/data/song9.mp3",
	"/bin/client/data/song10.mp3",*/

	// image loading tests
	//"/bin/client/data/4096x4096.png", 
	//"/bin/client/data/1024x1024.png",
	"/bin/client/data/gradiant.png",
	"/bin/client/data/spritesheet_1024x1024.png",


	// unknown file type load tests
	/*"/bin/client/data/test1.xtt",
	"/bin/client/data/test2.xtt",
	"/bin/client/data/test3.ttt",*/

	// css loading tests
	"/src/engine/default.phone.css", 
	"/src/engine/default.tablet.css", 
	"/src/engine/default.desktop.css", 
	

	// javascript loading tests
	"/src/engine/Context.js", 
	"/src/engine/BoundingBox.js",
	"/src/engine/QuadTree.js",
	"/src/engine/Scene.object.js", 
	"/src/engine/Network.object.js", 
	"/src/engine/Bitfield.js", 
	"/src/engine/UserInterface.js", 
	"/src/engine/Scene.object.js",
	"/src/engine/Scene.camera.js",					 
	"/src/engine/Scene.player.js", 
	"/src/engine/Network.js", 
	"/src/engine/Network.frame.js", 
	"/src/3rd/three.js", 
	"/src/engine/SoundManager.js", 
	"/src/engine/ResourceManager.js", 
	"/src/engine/Canvas2dCollisionTest.js", 
	"/src/engine/Animator.js", 
	"/src/engine/BadMath.js", 
	"/src/engine/Canvas2d.js", 
	"/src/engine/Common.js", 
	"/src/engine/Config.js", 
	"/src/engine/Input.js", 
	"/src/engine/Input.event.js",
	"/src/engine/GridThing.js",
	"/src/engine/Scene.tile.js",
	"/src/engine/EventManager.js",
	"/src/engine/Scene.boundingbox.js",
	"/src/engine/WorldLoader.js",
	"/src/engine/Debug.js",
	"/src/engine/ObjectList.js"];
	//var loader = null;
	var loader = new Loader(sources, function(done, asset, key) {

		// app-loading is used for displaying information about initial load state
		var d = document.getElementById("app-loading");

		// preload all sources before starting
		if (done >= 1) {
			var reasonsToStart = ["Click to Start", "Click to lower Expectations", "Click to activate the worst thing ever"];
			d.innerText = reasonsToStart[((new Date()).getTime() % (reasonsToStart.length))];
			var rect = contentContainer.getClientRects()[0];
			var opt = { parent: contentContainer, 
				resources: loader.resource,
				initialWidth: rect.width,
				initialHeight: rect.height
			};
			var app = new Game(opt);
			// user has found and attacked the canvas, clean up and start
			app.context.onactive.addListener("activated", function(e) {
				// remove app-loading element
				contentContainer.removeChild(d);
				app.start();
				console.log("am i here");
			}, true);
		}
		else {
			d.innerText = "Preloading ... " + Math.floor(done * 100) + "%";
		}

	});
};
onmessage = function(o) {
	console.log(o);
	console.log(document);
	//document = o.data[0];
	//window = o.data[1];
	//console.log(e.data.toString());
}