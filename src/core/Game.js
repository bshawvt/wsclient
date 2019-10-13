function Game(invoker) {
	var self = this;

	//this.ui = new UserInterface(this);

	this.metrics = invoker.metrics;
	this.net = invoker.net;

	this.renderer = new THREE.WebGLRenderer({canvas: invoker.components.canvas});
	this.renderer.setSize(window.innerWidth, window.innerHeight);
	this.renderer.setClearColor(0xffffff); 

	this.sceneManager = new SceneManager(this);

	window.addEventListener('resize', function() {
		self.onResize(invoker);
	});

}
//var editor = false;
Game.prototype.update = function(dt, state) {
	this.sceneManager.flush();

	if (this.setx !== 1) {
		this.setx = 1;
		for(var i = 0; i < 0; i++) 
			//this.sceneManager.add(new TestSceneObject({x: -50 + Math.floor(Math.random() * 125), y: -100 + Math.floor(Math.random() * 200)}));
		{
			this.sceneManager.add(new TestSceneObject({x: 1, 	y: 1.5*i}));
			this.sceneManager.add(new TestSceneObject({x: 2.5,  y: 1.5*i}));
			this.sceneManager.add(new TestSceneObject({x: 4, 	y: 1.5*i}));
		}
		//this.sceneManager.add(new TestSceneObject({x: 0, y: 0}));

	}
	this.sceneManager.step({dt:dt});
	
	this.net.sendFrame();
	
};
Game.prototype.render = function(dt) {

	this.sceneManager.render({dt: dt});
	this.renderer.render(this.sceneManager.scene, this.sceneManager.activeCamera.getObject());
};
Game.prototype.onResize = function(e) {

	e.components.canvas.width = window.innerWidth;
	e.components.canvas.height = window.innerHeight;

	this.renderer.setSize(window.innerWidth, window.innerHeight);

	this.sceneManager.activeCamera.resize();

};