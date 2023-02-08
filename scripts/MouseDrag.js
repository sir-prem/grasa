class MouseDrag {

    constructor(clickedPointX, clickedPointY) {
		this.startPointX = clickedPointX;
		this.startPointY = clickedPointY;
		this.currentPointX = this.startPointX;
		this.currentPointY = this.startPointY;
		//this.endPointX;
		//this.endPointY;
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

	updateDraggedDistanceX() {
		this.draggedDistanceX = 
			this.currentPointX - this.startPointX;
	}

	updateDraggedDistanceY() {
		this.draggedDistanceY = 
			this.currentPointY - this.startPointY;
	}

	updateDraggedDistance() {
		this.updateDraggedDistanceX();
		this.updateDraggedDistanceY();
	}

	setCurrentPoint( x , y ) {
		this.currentPointX = x;
		this.currentPointY = y;
	}

	updateStartPoint() {
		this.startPointX = this.currentPointX;
		this.startPointY = this.currentPointY;
	}

    resetDraggedDistance() {
        this.draggedDistanceX = 0;
        this.draggedDistanceY = 0;
    }
}
