class MouseState {

    constructor () {
        this.clickedPoint = new MouseClickedPoint();
		this.drag = new MouseDrag(clickedPoint.x, clickedPoint.y);
    }

}
