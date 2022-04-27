class Node {

    // "type" can be either [ 'start', 'line', 'bezier', 'quad' ]
    constructor(x, y, type) {
        this.vertex = new Vertex(x, y);
        this.type = type;
        this.handlesArray = [];
        this.state = new NodeState();

        // whichChildIsActive can be either
        //        [ 'none', 
        //          'vertex', 
        //          'handle1', 
        //          'handle2'   ]
        this.whichChildIsActive = 'none';   

    }
}

// methods
// getWhichChildIsActive
// howManyChildren
// etc