class Vertex {

    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type; // { 'start', 'line', 'bezier', 'quadratic' }
        this.vertexEllipse = new VertexEllipse( x, y,'transparent', 'indianred', 2, 15 );
    }

}