class Handle {

    constructor (x, y, handleNumber ) {
        this.x = x;
        this.y = y;

        this.number = handleNumber;
        
        this.initialisePathAndColorize();

        this.pointMarker = new PointMarker( 
                        this.xDraggedPosition, this.yDraggedPosition,
                        config.mouseOutHandle.fill,
                        config.mouseOutHandle.stroke,
                        config.mouseOutHandle.strokeWidth,
                        config.ellipseRadii.handle );
    }

    drawHandleLine(xParentVertex, yParentVertex) {
        this.initialisePathAndColorize(this.stroke, this.strokeWidth)
        this.handleLineGPath.moveTo(xParentVertex, yParentVertex);
        this.handleLineGPath.lineTo(this.xDraggedPosition, this.yDraggedPosition);
        this.handleLineGPath.draw(drawingContext);
    }

    initialisePathAndColorize() {
        this.handleLineGPath = new g.Path();

        switch(this.number) {
            case(1):
                this.handleLineGPath = g.colorize(this.handleLineGPath, 
                                                    'transparent', 
                                                    config.handles.handle1.stroke, 
                                                    config.handles.handle1.strokeWidth);       
                                                    break;
            case(2):
                this.handleLineGPath = g.colorize(this.handleLineGPath, 
                                                'transparent', 
                                                config.handles.handle2.stroke, 
                                                config.handles.handle2.strokeWidth);       
                                                break;
        }
        
    }

    drawCoordinates(index) {
        textSize(14);
        fill(0, 0, 90);
        text(`(${Math.trunc(this.xDraggedPosition)},${Math.trunc(this.yDraggedPosition)}) [H${index+1}]`, this.xDraggedPosition+2, this.yDraggedPosition);
    }

    drawVertexEllipse() {
        this.vertexEllipse.draw();
    }

    dragHandle(dx, dy) {
        this.xDraggedPosition = this.x + dx;
        this.yDraggedPosition = this.y + dy;
        this.vertexEllipse.translate(this.xDraggedPosition,this.yDraggedPosition);
    }

    moveHandle(x,y) {
        this.x = x;
        this.y = y;
        this.xDraggedPosition = x;
        this.yDraggedPosition = y;
        this.vertexEllipse.translate(this.x,this.y);
    }

    // on mouse release, set new base position
    dropHandle() {
        this.x = this.xDraggedPosition;
        this.y = this.yDraggedPosition;
    }
}