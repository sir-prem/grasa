class PointMarker {

    constructor( x, y, fill, stroke, strokeWidth, radius ) {
        this.x = x;
        this.y = y;
        this.fill = fill;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
        this.radius = radius;
        this.diameter = radius*2;
        this.createGPath(x, y);
        this.styleGPath();
        
    }

    createGPath(x, y) {
        this.ellipsePath = new g.Path();

        this.ellipsePath.addEllipse(x-this.radius, y-this.radius, 
                                this.diameter, this.diameter);
    }

    styleGPath() {
        this.ellipsePath = g.colorize(this.ellipsePath, this.fill, this.stroke, this.strokeWidth);
    }

    createAndRestyleGPath(x, y) {
        this.createGPath(x, y);
        this.styleGPath();
    }

    draw() {
        this.ellipsePath.draw(drawingContext);
    }

    isInside(x, y) {
        return this.ellipsePath.contains(x,y);
    }

    updatePosition(newX,newY) {
        this.createAndRestyleGPath(newX, newY);
    }
/*
    translate(x,y) {
        this.x = x;
        this.y = y;
        this.ellipsePath = new g.Path();

        this.ellipsePath.addEllipse(x-this.radius, y-this.radius, 
                                this.diameter, this.diameter);
        this.setColour(this.fill, this.stroke, this.strokeWidth);
    }
*/
    setColour(fill, stroke, strokeWidth) {
        this.fill = fill;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
        this.styleGPath();
    }

    setColour(style) {
        this.fill = style.fill;
        this.stroke = style.stroke;
        this.strokeWidth = style.strokeWidth;
        this.ellipsePath = g.colorize(this.ellipsePath, style.fill, style.stroke, style.strokeWidth);
    }

    getPath() {
        return this.ellipsePath;
    }


}