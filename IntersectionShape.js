class IntersectionShape {

    constructor(shapeA, shapeB) {
        let pathA = shapeA.path;
        let pathB = shapeB.path;
        this.path = g.compound(pathA, pathB, 'intersection');
    }

    drawShape(fill, stroke) {
        this.path.fill = fill;
        this.path.stroke = stroke;
        this.path.draw(drawingContext);
    }

}