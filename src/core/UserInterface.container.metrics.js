/* 
*/
function ContainerMetrics(opt) { // container template for UserInterface
	Container.call(this, opt);

	var self = this;
	this.title = "Metrics";
	console.log(opt);
	this.metrics = opt.invoker.metrics;
	this.invoker = opt.invoker;


	// init the container element first
	this.container = this.createNodeElement({name: "div", className: "ui-container ui-default-container"});
	
	// addElement needs this.container to be a valid html5 element
	// element order mostly depends on css rules i guess idk
	var title = this.addElement({name: "div", className: "no-hide ui-default-title noselect", text: this.title});
	var remove = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-remove"}, title);
	var hide = this.addElement({name: "button", className: "ui-default-title-button ui-default-icon ui-default-icon-hide"}, title);
	//var resize = this.addElement({name: "div", className: "ui-default-icon ui-default-icon-resize noselect"})
	this.body = this.addElement({name: "div", className: "ui-default-body"});

	this.addDragEvent(title);
	this.addRemoveEvent(remove);
	this.addHideEvent(hide);
	//this.addDragEvent(resize, true);

	this.appendContainer();
	this.update({x: this.x, y: this.y, pushIndex: true});

	this.fps = this.addElement({name: "span"}, this.body);
	this.addText("fps: ", this.fps);
	this.addElement({name: "br"}, this.body);
	this.sps = this.addElement({name: "span"}, this.body);
	this.addText("step rate: ", this.sps);
	this.addElement({name: "br"}, this.body);
	this.latency = this.addElement({name: "span"}, this.body);
	this.addText("latency: ", this.latency);

	this.lastUpdate = 0; // prevents updateTextCallback from creating hundreds of spans per second

	this.timer = setTimeout(function() {
		self.updateCallback();
	}, 1000);
}
ContainerMetrics.prototype = Object.create(Container.prototype);
ContainerMetrics.prototype.constructor = ContainerMetrics;

ContainerMetrics.prototype.init = function() {
	// body...
};
// 
ContainerMetrics.prototype.updateCallback = function() {
	var self = this;

	while(this.fps.children.length > 0) {
		this.fps.removeChild(this.fps.children[0]);
	}
	while(this.sps.children.length > 0) {
		this.sps.removeChild(this.sps.children[0]);
	}
	while(this.latency.children.length > 0) {
		this.latency.removeChild(this.latency.children[0]);
	}
	fcolor = 65280; // green
	scolor = 65280;
	lcolor = 65280;
	var obj = {	fps: this.metrics.render.framesPerSecond, 
				sps: this.metrics.update.stepsPerSecond,
				latency: this.invoker.net.ping};
	if (obj.fps < 25) {
		fcolor = 16711680; // red
		
	} else if (obj.fps <= 45) {
		fcolor = 16776960;	// yeller
	}

	if (obj.sps < 25) {
		scolor = 16711680;
		
	} else if (obj.sps < 30) {
		scolor = 16776960;	
	}

	if (obj.latency > 230) {
		lcolor = 16711680;		
	} else if (obj.latency > 175) {
		lcolor = 16776960;
	}
	this.addText("fps: ^" + fcolor + "\0" + obj.fps, this.fps);
	this.addText("step rate: ^" + scolor + "\0" + obj.sps, this.sps);
	this.addText("latency: ^" + lcolor + "\0" + obj.latency, this.latency);
	//this.lastUpdate = obj.dt;
	clearTimeout(this.timer);
	this.timer = setTimeout(function() {
		self.updateCallback();
	}, 1000);
};
/*ContainerMetrics.prototype.updateCallback2 = function(obj) {
	if (this.lastUpdate+1000 < obj.dt) {
		while(this.fps.children.length > 0) {
			this.fps.removeChild(this.fps.children[0]);
		}
		while(this.sps.children.length > 0) {
			this.sps.removeChild(this.sps.children[0]);
		}
		fcolor = 65280; // green
		scolor = 65280;
		obj.sps = 30;
		if (obj.fps < 25) {
			fcolor = 16711680; // red
			
		} else if (obj.fps <= 45) {
			fcolor = 16776960;	// yeller
		}
		if (obj.sps < 25) {
			scolor = 16711680;
			
		} else if (obj.sps < 30) {
			scolor = 16776960;	
		}
		this.addText("fps: ^" + fcolor + "\0" + obj.fps, this.fps);
		this.addText("step rate: ^" + scolor + "\0" + obj.sps, this.sps);
		this.lastUpdate = obj.dt;
	}
};
*/