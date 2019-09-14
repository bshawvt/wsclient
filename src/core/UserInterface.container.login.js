function ContainerLogin(opt) { // container template for UserInterface
	Container.call(this, opt);

	var self = this;

	// init the container element first
	this.container = this.createNodeElement({name: "div", className: "ui-container ui-default-container"});
	
	// addElement needs this.container to be a valid html5 element
	// element order mostly depends on css rules i guess idk
	var title = this.addElement({name: "div", className: "no-hide ui-default-title noselect", text: this.title});
	//var remove = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-remove"}, title);
	var hide = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-hide"}, title);
	var body = this.addElement({name: "div", className: "ui-login-body"});

	/*this.username = this.addElement({name: "input", className: "ui-login-input ui-input", attributes: 
		[{name: "placeholder", value: "Username"}, {name: "minlength", value: "3"}, {name: "maxlength", value: "18"}]}, body);
	this.password = this.addElement({name: "input", className: "ui-login-input ui-input", attributes: 
		[{name: "placeholder", value: "Password"}, {name: "minlength", value: "3"}, {name: "maxlength", value: "32"},
		{name: "type", value: "password"}]}, body);*/

	this.login = this.addElement({name: "button", text: "Login", className: "ui-login-button ui-button"}, body);
	//this.addElement({name:"span", className: "float-left", text: "\ud83d\ude02"}, this.login);
	this.register = this.addElement({name: "button", text: "Register", className: "ui-login-button ui-button"}, body);
	//this.addElement({name:"span", className: "float-left", text: "\u{1f4a9}"}, this.register);
	this.guest = this.addElement({name: "button", text: "Play as a Guest", className: "ui-login-button ui-button"}, body);
	//this.addElement({name:"span", className: "float-left", text: "\u{1f4af}"}, this.guest);
	this.login.onclick = (e)=>{
		// don't want nosy prints vomiting plain text passwords when they're received
		//var crypt = new sjcl.hash.sha256();
		//crypt.update(this.password.value);
		//var hash = sjcl.codec.base64.fromBits(crypt.finalize());
		
		opt.game.net.connect();
		console.log(opt.game.net);
		throw new Error("todo: finish implementing login");

	}
	this.register.onclick = (e) => {
		// registration/account recovery is handled through a web page
		window.location.href = Config.serverAddress.register;
	}
	this.guest.onclick = (e)=>{ 
		new Note("Guest mode is not implemented");
	}
	//var footer = this.addElement({name: "div", className:"ui-example-footer"});

	// this.events is a a UIBehavior object created by the container super class
	/*this.events.addDragEvent(title);
	this.events.addRemoveEvent(remove);
	this.events.addHideEvent(hide);
	this.events.addDragEvent(resize, true);*/

	this.addDragEvent(title);
	//this.addRemoveEvent(remove);
	this.addHideEvent(hide);

	this.appendContainer();
	this.update({x: this.x, y: this.y, w: this.w, h: this.h, pushIndex: true});
}
ContainerLogin.prototype = Object.create(Container.prototype);
ContainerLogin.prototype.constructor = ContainerLogin;

// 