/* loader class 
	should handle all script loading */
function Loader() {

	var html = document.createElement('div');
	document.body.appendChild(html);

	var url = "/src/core/Template.js";
	var script = document.createElement('script');
	script.src = url;

	html.appendChild(script);


	// done, cleanup
	document.body.removeChild(html);

	console(new Game());

}