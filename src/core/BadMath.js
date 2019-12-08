/*
	static class full of bad math
*/
function BadMath() {
	
}
BadMath.intersect = function(a, b) {
	// rect vs rect or point
	if (a.width === undefined || a.height === undefined) {
		a.width = 2;
		a.height = 2;
	}
	if (b.width === undefined || b.height === undefined) {
		b.width = 2;
		b.height = 2;
	}

	var aMinX = a.x;
	var aMaxX = a.x + a.width;
	var aMinY = a.y;
	var aMaxY = a.y + a.height;

	var bMinX = b.x;
	var bMaxX = b.x + b.width;
	var bMinY = b.y;
	var bMaxY = b.y + b.height;
	return (aMinX <= bMaxX && aMaxX >= bMinX) && (aMinY <= bMaxY && aMaxY >= bMinY);
};
