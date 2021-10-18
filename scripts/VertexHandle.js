class VertexHandle {

    constructor (x, y, fill, stroke, strokeWidth ) {
        this.x = x;
        this.y = y;
        this.fill = fill;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
        this.handleLinePath = new g.Path();
        this.handleLinePath = g.colorize(this.handleLinePath, fill, stroke, strokeWidth);
    }

    drawHandleLine(xParentVertex, yParentVertex) {
        this.handleLinePath.moveTo(xParentVertex, yParentVertex);
        this.handleLinePath.lineTo(this.x, this.y);
        this.handleLinePath.draw(drawingContext);
    }

    drawCoordinates(index) {
        textSize(14);
        fill(0, 0, 90);
        text(`(${this.x},${this.y}) [H${index+1}]`, this.x+2, this.y);
    }
}