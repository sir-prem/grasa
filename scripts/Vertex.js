class Vertex {

    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type; // { 'start', 'line', 'bezier', 'quadratic' }
        this.vertexEllipse = new VertexEllipse( x, y,'transparent', 'indianred', 2, 15 );

        // calculate handles
        //this.handlesArray = getHandlesArray(x, y, type);
        this.handlesArray = [];
    }

    drawCoordinates() {
        textSize(14);
        fill(0, 0, 90);
        text(`(${this.x},${this.y})`, this.x+2, this.y);
    }

}