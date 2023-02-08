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
        this.isMouseStillInside = false;
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

    isMouseInside() {
        return this.ellipsePath.contains(mouseX, mouseY);
    }

    updatePosition(newX,newY) {
        this.createAndRestyleGPath(newX, newY);
    }

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
        this.ellipsePath = g.colorize(
				this.ellipsePath, 
				style.fill, 
				style.stroke, 
				style.strokeWidth);
    }

    setMouseEntered() {
        this.isMouseStillInside = true;
    }

    setMouseExited() {
        this.isMouseStillInside = false;
    }

    isMouseAlreadyInside() {
        return this.isMouseStillInside;
    }

    getPath() {
        return this.ellipsePath;
    }


}
