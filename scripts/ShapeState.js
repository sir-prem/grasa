class ShapeState {

    constructor() {

        this.mouseClickedPoint = new MouseClickedPoint();
        this.activeNodeIndex = -1; // -1 means no nodes are active
        this.isDragging = false;
        this.isClosed = false;


    }

    setWhichNodeActive(index) {
        this.activeNodeIndex = index;
    }

    setNoNodesActive() {
        this.activeNodeIndex = -1;
    }

}