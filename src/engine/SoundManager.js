function SoundManager() {
	if (isMobile()) {
		console.log("soundmanager is in mobile land");
	}
	this.context = new (window.AudioContext || window.webkitAudioContext)();


	/* https://stackoverflow.com/a/48597898/1275676
	window.fetch(URL)
  .then(response => response.arrayBuffer())
  .then(arrayBuffer => context.decodeAudioData(arrayBuffer, 
                                               audioBuffer => {
                                                 yodelBuffer = audioBuffer;
                                                }, 
                                               error => 
                                               console.error(error)
                                              ))
	*/
	/*var decode = this.context.decodeAudioData(buffer, 
		function(e) { // on success

		}, 
		function(e) { // on error

		}
	);*/

	console.log(this);
}