class IntersectionShape {

    constructor(shapeA_index, shapeB_index, fill, stroke, strokeWidth) {
        //let pathA = shapeA.gPath;
        //let pathB = shapeB.gPath;
        this.shapeA_index = shapeA_index;
        this.shapeB_index = shapeB_index;
        this.fill = fill;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
        this.path = null;
        //this.path = g.compound(pathA, pathB, 'intersection');
        //this.path = g.colorize(this.path, fill, stroke, strokeWidth);
    }

    draw(shapesArray) {
        //console.log(`reaching draw fn in intersectionShape. shapesArray length is ${shapesArray.length}`);
        let pathA = shapesArray[this.shapeA_index].gPath;
        let pathB = shapesArray[this.shapeB_index].gPath;
        this.path = g.compound(pathA, pathB, 'intersection');
        this.path = g.colorize(this.path, this.fill, this.stroke, this.strokeWidth);
        this.path.draw(drawingContext);
    }

    setColour(fill, stroke, strokeWidth) {
        this.path = g.colorize(this.path, fill, stroke, strokeWidth);
    }
}