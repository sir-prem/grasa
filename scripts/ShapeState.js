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

    setInactive() {
        this.activeNodeIndex = -1;
    }

	isActive() {
		return this.activeNodeIndex > -1;
	}

}
