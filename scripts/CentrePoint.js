class CentrePoint {

	constructor(x, y) {
        this.x = x;
        this.y = y;
		this.pointMarker = new PointMarker( 
                            x, y,
                            config.defaultNodeStyle.fill,
                            config.defaultNodeStyle.stroke,
                            config.defaultNodeStyle.strokeWidth,
                            config.ellipseRadii.vertex );
    }

	recalculate(shape) {
		return g.centerPoint(shape.gPath);
	}

	moveTo( x, y) {
		this.x = x;
		this.y = y;
		this.pointMarker.updatePosition(this.x, this.y);
	}
}
