function onmessage(a) {
	console.log("onmessage: ", a);
}
function getmessages() {

}

var timer = setTimeout((e) => {
	onmessage("heck");
}, 1000);