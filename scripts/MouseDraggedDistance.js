class MouseDraggedDistance {

    constructor() {
        this.dx = 0;
        this.dy = 0;
    }

    update(clickedX, clickedY, currentX, currentY) {
        this.dx = currentX - clickedX;
        this.dy = currentY - clickedY;
    }

    reset() {
        this.dx = 0;
        this.dx = 0;
    }

    set(dx, dy) {
        this.dx = dx;
        this.dy = dy;
    }
}