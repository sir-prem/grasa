class MouseState {

    constructor (mouseX, mouseY) {
        this.clickedPoint = new MouseClickedPoint(mouseX, mouseY);
		this.drag = new MouseDrag(this.clickedPoint.x, this.clickedPoint.y);
    }
}
