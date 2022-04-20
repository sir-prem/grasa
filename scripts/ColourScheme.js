class ColourScheme {

    constructor(colourScheme) {
        this.fill = colourScheme.fill;
        this.stroke = colourScheme.stroke;
        this.strokeWidth = colourScheme.strokeWidth;
    }

    //get and set functions here
    set(colourScheme) {
        this.fill = colourScheme.fill;
        this.stroke = colourScheme.stroke;
        this.strokeWidth = colourScheme.strokeWidth;
    }

    setToPath(path, colourScheme) {
        path = g.colorize(
            path, 
            colourScheme.fill, 
            colourScheme.stroke, 
            colourScheme.strokeWidth);
        return path;
    }

    get() {
        return {
            fill:           this.fill,
            stroke:         this.stroke,
            strokeWidth:    this.strokeWidth
        };
    }

    setFill(fill) {
        this.fill = fill;
    }

    setStroke(stroke) {
        this.stroke = stroke;
    }

    setStrokeWidth(strokeWidth) {
        this.strokeWidth = strokeWidth;
    }

    getFill() {
        return this.fill;
    }

    getStroke() {
        return this.stroke;
    }

    getStrokeWidth() {
        return this.strokeWidth;
    }

}