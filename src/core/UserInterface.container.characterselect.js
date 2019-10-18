function ContainerCharacterSelect(net, authblob) {
	Container.call(this, {});

	var self = this;
	
	this.net = net; // Main.net reference

	this.w = 300;

	var CHARACTER_LIMIT = 3;

	// init the container element first
	this.container = this.createNodeElement({name: "div", className: "ui-container ui-default-container"});
	
	// addElement needs this.container to be a valid html5 element
	// element order mostly depends on css rules i guess idk
	var title = this.addElement({name: "div", className: "no-hide ui-default-title noselect", 
		text: "Character Select"});
	//var remove = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-remove"}, title);
	//var hide = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-hide"}, title);
	var body = this.addElement({name: "div", className: "ui-body ui-body-default ui-position-initial"});
	//var resize = this.addElement({name: "div", className: "ui-default-icon ui-default-icon-resize noselect"})
	

	//for(var i = 0; i < authblob.characters.length; i++) {
	authblob.characters.forEach(function(item) {
		//console.log(authblob.characters[i]);
		var row = self.addElement({name: "div", className: "ui-row"}, body);
		var column = self.addElement({name: "div", className: "show-border ui-column ui-wide ui-taller"}, row);
		var button = self.addElement({name:"button", className: "ui-button ui-wide ui-tall"}, column);

		button.onclick = function() {
			self.net.frame.push({type: 2, id: item.id});
			console.log(t);
		}

		var name = self.addElement({name: "div", className: "ui-charactername", text: item.name}, button);
		var description = self.addElement({name: "div", className: "ui-characterdescription", text: item.description}, button);
	});

	var row = this.addElement({name: "div", className: "ui-row"}, body);
	var column = this.addElement({name: "div", className: "show-border ui-column ui-wide ui-taller"}, row);
	var button = this.addElement({name:"button", className: "ui-button ui-wide ui-tall", 
		attributes: [(authblob.characters.length >= CHARACTER_LIMIT ? {name: "disabled", value: ""} : {})]
	}, column);

	button.onclick = () => {
		console.log("asdasd");
		this.net.frame.push({type: 2, id: -1});
	}

	var name = this.addElement({name: "div", className: "ui-charactername", text: "New Character"}, button);
	var description = this.addElement({name: "div", className: "ui-characterdescription", text: "Enter the game as a new character"}, button);
	

	
	this.addDragEvent(title);
	//this.addRemoveEvent(remove);
	//this.addHideEvent(hide);
	//this.addDragEvent(resize, true);

	this.appendContainer();
	this.update({x: this.x, y: this.y, w: this.w, pushIndex: true});
}
ContainerCharacterSelect.prototype = Object.create(Container.prototype);
ContainerCharacterSelect.prototype.constructor = ContainerCharacterSelect;


/*
<div class="ui-body ui-body-default ui-position-initial">
				<div class="ui-table">
					<div class="show-border">
						<div class="ui-row">
							<div class="show-border ui-column ui-wide ui-taller">
								<button class="ui-button ui-wide ui-tall">
									<div class="ui-charactername">Agudnaem</div>
									<div class="ui-characterdescription">
										level 0 - hp 10/10<br/>
										illuminating shrine
									</div>
								</button>
							</div>
						</div>

						<div class="ui-row">
							<div class="show-border ui-column ui-wide ui-taller">
								<button class="ui-button ui-wide ui-tall">
									<div class="ui-charactername">Amalnaem</div>
									<div class="ui-characterdescription">
										level 0 - hp 10/10<br/>
										an unknown location
									</div>
								</button>
							</div>
						</div>

						<div class="ui-row">
							<div class="show-border ui-column ui-wide ui-taller">
								<button class="ui-button ui-wide ui-tall">
									<div class="ui-charactername">Anaem</div>
									<div class="ui-characterdescription">
										level 0 - hp 10/10<br/>
										an unknown location
									</div>
								</button>
							</div>
						</div>

						<div class="ui-row">
							<div class="show-border ui-column ui-wide ui-taller">
								<button class="ui-button ui-wide ui-tall" disabled>
									<div class="ui-charactername">New Character</div>
									<div class="ui-characterdescription">
										Enter the game as a new character
									</div>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
*/