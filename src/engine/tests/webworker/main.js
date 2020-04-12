if (window.Worker) {
	var work = new Worker("webworker.js");
	work.onmessage = function(e) {
		console.log("onmessage: ", e);
	}

	setTimeout((e) => {
		console.log("e: ", work);
		work.postMessage(["a"]);
	}, 2000);
}