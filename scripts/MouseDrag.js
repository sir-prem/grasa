class MouseDrag {

    constructor(clickedPointX, clickedPointY) {
		this.startPointX = clickedPointX;
		this.startPointY = = clickedPointY;
		this.currentPointX = startPointX;
		this.currentPointY = startPointY;
        this.draggedDistanceX = 0;
		this.draggedDistanceY = 0;
		this.isDragging = false;
    }

    setDragging() {
        this.isDragging = true;
    }

    setNoLongerDragging() {
        this.isDragging = false;
    }

	recalculateDraggedDistanceX() {
		this.draggedDistanceX = 
			this.currentPointX - this.startPointX;
	}

	recalculateDraggedDistanceY() {
		this.draggedDistanceY = 
			this.currentPointY - this.startPointY;
	}

	updateCurrentPoint( x , y ) {
		this.currentPointX = x;
		this.currentPointY = y;
	}

    resetDraggedDistance() {
        this.draggedDistsanceX = 0;
        this.draggedDistanceY = 0;
    }
}
