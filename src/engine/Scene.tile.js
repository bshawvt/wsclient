//function SceneTile(scene, x, y, z, u, w, v) {
function SceneTile(args) {
	console.log("scenetile hello world");
	var game = args.game || undefined;
	var x = args.x || 0;
	var y = args.y || 0;
	var z = args.z || 0;
	var xscale = args.xscale || 0;
	var yscale = args.yscale || 0;
	var zscale = args.zscale || 0;


	this.inputState = new Bitfield();
	this.parent = null;
	
	this.angles = [0.0, 0.0, 0.0]; // yaw pitch roll
	//this.position = [0.0, 0.0, 0.0];
	this.moveDirection = [0.0, 0.0, 0.0];
	this.speed = [1.0, 1.0, 0.0];
	
	//this.clientId = -1;
	this.id = 0; // world id, set when added to the simulation
	this.removed = false; 
	
	this.type = 0;//NetObject.Types.Default; // object type
	this.isPlayer = false;

	this.geometry = new THREE.BoxGeometry(xscale, yscale, zscale);
	this.geometry.applyMatrix( new THREE.Matrix4().makeTranslation( xscale/2, yscale/2, zscale/2 ) );
	this.material = new THREE.MeshBasicMaterial({color: Math.floor(Math.random() * (255*255*255))});
	this.object = new THREE.Mesh(this.geometry, this.material);
	//this.object.applyMatrix( new THREE.Matrix4().makeTranslation( u/2, w/2, v/2 ) );
	
	this.object.position.x = x;// + (u / 2);
	this.object.position.y = y;// + (w / 2);
	this.object.position.z = z;// + (v / 2);

	//this.geometry.translate(x, y, z);

	this.bb = new BoundingBox(x, y, z, xscale, yscale, zscale, undefined, game);
	
	this.bb.set(x, y, z, xscale, yscale, zscale);
	
};
SceneTile.prototype = Object.create(SceneObject.prototype);
SceneTile.prototype.constructor = SceneTile;

SceneTile.prototype.setState = function(state) {

};

SceneTile.prototype.step = function(game, controller) {
	
};

SceneTile.prototype.draw = function(dt) {

};

