class Vertex {

    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type; // { 'start', 'line', 'bezier', 'quadratic' }
        this.vertexEllipse = new VertexEllipse( 
                            x, y,
                            config.mouseOutVertex.fill,
                            config.mouseOutVertex.stroke,
                            config.mouseOutVertex.strokeWidth,
                            config.ellipseRadii.vertex );

        // calculate handles
        //this.handlesArray = getHandlesArray(x, y, type);
        this.handlesArray = [];

        
        this.xDraggedDistance = 0;
        this.yDraggedDistance = 0;
    }

    drawCoordinates() {
        textSize(14);
        fill(0, 0, 90);
        text(`(${Math.trunc(this.x)},${Math.trunc(this.y)})`, this.x+2, this.y);
    }

    moveToNewPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    offsetPosition(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    setVertexToDragging() {
        this.isDragging = true;
    }

    setVertexToStationary() {
        this.isDragging = false;
    }

    updateDraggedDistance(dx, dy) {
        this.xDraggedDistance = dx;
        this.yDraggedDistance = dy;
    }

    hasHandles() {
        switch (this.type) {
            case 'start':
            case 'line':
                return false;
            default:
                return true;
        }
    }

    calculateInitialHandleCoordinates(x, y, xPrev, yPrev) {

    }
}