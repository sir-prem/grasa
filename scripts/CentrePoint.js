class CentrePoint {

	constructor(x, y) {
        this.x = x;
        this.y = y;
        this.resetInitialPosition();
		this.pointMarker = new PointMarker( 
                            x, y,
                            config.defaultNodeStyle.fill,
                            config.defaultNodeStyle.stroke,
                            config.defaultNodeStyle.strokeWidth,
                            config.ellipseRadii.vertex );

    }

	recalculate(shape) {

		let cp = g.centerPoint(shape.gPath);
		//console.log(`recalc centrePoint: cp.x is ${cp.x}, cp.y is ${cp.y}`);
		this.x = cp.x;
		this.y = cp.y;
		this.resetInitialPosition();
		this.pointMarker.updatePosition(cp.x, cp.y);
	}
	
    resetInitialPosition() {
        this.initialX = this.x;
        this.initialY = this.y;
    }
	// offsetPosition() is used when handle's vertex is being dragged
    offsetPosition(dx, dy) {
        this.x = this.initialX + dx;
        this.y = this.initialY + dy;
        this.pointMarker.updatePosition(this.x,this.y);
    }

}
