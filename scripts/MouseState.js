class MouseState {

    constructor (activeObjectType) {
        this.activeObjectType = activeObjectType; // can be either 'node' or 'shape' that is
                                                  // being driven by mouse (clicked, dragged, etc)
        this.clickedPoint = new MouseClickedPoint();
        this.draggedDistance = new MouseDraggedDistance();
        this.isDragging = false;
    }

    setDragging() {
        this.isDragging = true;
    }

    setNoLongerDragging() {
        this.isDragging = false;
    }
}