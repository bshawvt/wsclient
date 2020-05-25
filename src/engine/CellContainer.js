function CellContainer(x, y) {

	/*
		a b c
		d e f
		g h i
	*/
	if (x==undefined ||y==undefined) {
		// top
		this.ax = -1;
		this.ay = -1;

		this.bx = -1;
		this.by = -1;

		this.cx = -1;
		this.cy = -1;

		// middle
		this.dx = -1;
		this.dy = -1;

		this.ex = -1;
		this.ey = -1;

		this.fx = -1;
		this.fy = -1;

		// bottom
		this.gx = -1;
		this.gy = -1;

		this.hx = -1;
		this.hy = -1;

		this.ix = -1;
		this.iy = -1;
	}
	else {
		// top
		this.ax = x - 1;
		this.ay = y - 1;

		this.bx = x;
		this.by = y - 1;

		this.cx = x + 1;
		this.cy = y - 1;

		// middle
		this.dx = x - 1;
		this.dy = y;

		this.ex = x;
		this.ey = y;

		this.fx = x + 1;
		this.fy = y;

		// bottom
		this.gx = x - 1;
		this.gy = y + 1;

		this.hx = x;
		this.hy = y + 1;

		this.ix = x + 1;
		this.iy = y + 1;
	}
}
CellContainer.prototype.apply = function(x, y) {
	this.ax = x - 1;
	this.ay = y - 1;

	this.bx = x;
	this.by = y - 1;

	this.cx = x + 1;
	this.cy = y - 1;

	// middle
	this.dx = x - 1;
	this.dy = y;

	this.ex = x;
	this.ey = y;

	this.fx = x + 1;
	this.fy = y;

	// bottom
	this.gx = x - 1;
	this.gy = y + 1;

	this.hx = x;
	this.hy = y + 1;

	this.ix = x + 1;
	this.iy = y + 1;
};