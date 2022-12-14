class CentrePoint {

	constructor(x, y) {
        this.x = x;
        this.y = y;
        this.initialX = x;
        this.initialY = y;
        this.pointMarker = new PointMarker( 
                            x, y,
                            config.defaultNodeStyle.fill,
                            config.defaultNodeStyle.stroke,
                            config.defaultNodeStyle.strokeWidth,
                            config.ellipseRadii.vertex );

    }

 
	moveTo(x, y, shape) {
		
		let draggedDistanceX = x - this.initialX;
		let draggedDistanceY = y - this.initialY;
													 
		for (let i= 0; i < shape.nodesArray.length; i++) {
			console.log(`centerpoint:  moving vertex ${i} of shape`);
			let node = shape.nodesArray[i];
			let new_x_coordinate = node.vertex.initialX + draggedDistanceX;
			let new_y_coordinate = node.vertex.initialY + draggedDistanceY;
			if (node.type !== 'centre') {
				 node.vertex.moveTo(new_x_coordinate,
				 					new_y_coordinate,
				 					node);
			}
			else {
				this.x = x;
				this.y = y;
				this.pointMarker.updatePosition(x,y);
			}


		}
		// iterate through nodes in shape 
			// calculate new co-ordinate of vertex based on dragging of centre point
	 		// move verted to new offset co-ordinate
		//node.state.mouseState.draggedDistance.dx,
		//node.state.mouseState.draggedDistance.dy 	

	}

	
	// offsetPosition() is used when handle's vertex is being dragged
    offsetPosition(dx, dy) {
        this.x = this.initialX + dx;
        this.y = this.initialY + dy;
        this.pointMarker.updatePosition(this.x,this.y);
    }

}
