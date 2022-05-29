class ShapeState {

    constructor() {

        this.activeNodeIndex = -1; // -1 means no nodes are active
        this.isClosed = false;
        this.mouseState = new MouseState('shape');
        this.mouseInsideHowManyPointMarkers = 0;


    }

    setWhichNodeActive(index) {
        this.activeNodeIndex = index;
    }

    setNoNodesActive() {
        this.activeNodeIndex = -1;
    }

}