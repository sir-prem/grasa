class VertexHandle {

    constructor (x, y, stroke, strokeWidth ) {
        this.x = x;
        this.y = y;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
        this.initialisePathAndColorize(stroke, strokeWidth);
        this.xDraggedPosition = x;
        this.yDraggedPosition = y;
        this.vertexEllipse = new VertexEllipse( 
                        this.xDraggedPosition, this.yDraggedPosition,
                        config.mouseOutHandle.fill,
                        config.mouseOutHandle.stroke,
                        config.mouseOutHandle.strokeWidth,
                        config.ellipseRadii.handle );
    }

    drawHandleLine(xParentVertex, yParentVertex) {
        this.initialisePathAndColorize(this.stroke, this.strokeWidth)
        this.handleLinePath.moveTo(xParentVertex, yParentVertex);
        this.handleLinePath.lineTo(this.xDraggedPosition, this.yDraggedPosition);
        this.handleLinePath.draw(drawingContext);
    }

    initialisePathAndColorize(stroke, strokeWidth) {
        this.handleLinePath = new g.Path();
        this.handleLinePath = g.colorize(this.handleLinePath, 'transparent', stroke, strokeWidth);
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