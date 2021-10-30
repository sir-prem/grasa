class IntersectionShape {

    constructor(shapeA, shapeB, fill, stroke, strokeWidth) {
        let pathA = shapeA.path;
        let pathB = shapeB.path;
        this.fill = fill;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
        this.path = g.compound(pathA, pathB, 'intersection');
        this.path = g.colorize(this.path, fill, stroke, strokeWidth);
    }

    drawPath() {
        this.path.draw(drawingContext);
    }

    setColour(fill, stroke, strokeWidth) {
        this.path = g.colorize(this.path, fill, stroke, strokeWidth);
    }
}