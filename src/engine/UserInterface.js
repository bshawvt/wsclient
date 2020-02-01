/* message response is expected to be a join blob */
function ContainerCharacterSelect(network, message) {
	var html = document.body;
	var container = document.createElement("div");
	container.setAttribute("class", "ui-charselect");

	var group = document.createElement("div");

	function close() {
		html.removeChild(container);
	}

	for(var i = 0; i < message.characters.length; i++) {
		var select = document.createElement("div");
		select.setAttribute("class", "ui-charselect-item");
		select.data = message.characters[i].id;
		select.onclick = function() {
			console.log(this.data);
			var blob = {type: Network.BlobTypes.Join, id: this.data};
			network.frame.push(blob);
			//close();
		}
		select.innerText = "a nameless";
		group.appendChild(select);
	}

	if (message.characters.length < 3) {
		var select = document.createElement("div");
		select.setAttribute("class", "ui-charselect-item");
		select.onclick = function() {
			var blob = {type: Network.BlobTypes.Join, id: -1};
			console.log(blob);
			network.frame.push(blob);
			//close();
		}
		select.innerText = "Create new character";
		group.appendChild(select);
	}
	container.appendChild(group);




	html.appendChild(container);
	console.log("ASDASD!!!!!");
}