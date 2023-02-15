class Handle {

    constructor (x, y, handleNumber ) {
        this.x = x;
        this.y = y;

        this.number = handleNumber;
        
        this.createAndStyleLine(); // this.line

        this.pointMarker = new PointMarker( 
                        this.x, this.y,
                        config.defaultNodeStyle.fill,
                        config.defaultNodeStyle.stroke,
                        config.defaultNodeStyle.strokeWidth,
                        config.ellipseRadii.handle );
    }

    // offsetPosition() is used when handle's vertex is being dragged
    offsetPosition(dx, dy) {
		let mouseDrag = window.mouseState.drag;
        this.x += mouseDrag.draggedDistanceX;
        this.y += mouseDrag.draggedDistanceY;
		this.moveTo( this.x, this.y );
    }

    // moveTo() is used when handle itself is being dragged to reshape a curve
    moveTo(x,y) {
        this.x = x;
        this.y = y;
        this.pointMarker.updatePosition(this.x,this.y);
    }

    createAndStyleLine() {
        this.line = new g.Path();

        switch(this.number) {
            case(1):
                this.line = g.colorize(this.line, 
                                                    'transparent', 
                                                    config.handles.handle1.stroke, 
                                                    config.handles.handle1.strokeWidth);       
                                                    break;
            case(2):
                this.line = g.colorize(this.line, 
                                                'transparent', 
                                                config.handles.handle2.stroke, 
                                                config.handles.handle2.strokeWidth);       
                                                break;
        }
    }
}
