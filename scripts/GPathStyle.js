class GPathStyle {

    constructor(style) {
        this.fill = style.fill;
        this.stroke = style.stroke;
        this.strokeWidth = style.strokeWidth;
    }

    //get and set functions here
    set(style) {
        this.fill = style.fill;
        this.stroke = style.stroke;
        this.strokeWidth = style.strokeWidth;
    }

    static set(path, style) {
        path = g.colorize(
            path, 
            style.fill, 
            style.stroke, 
            style.strokeWidth);
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