class Vertex {

    constructor(x, y, type) {
        this.x = x;
        this.y = y;
		this.type = type; // 'start', 'line', 'quad', 'bezier'
		this.resetInitialPosition();	
		switch(type) {
			case 'bezier':	this.handle2;
			case 'quad':	this.handle1;
		}
        this.pointMarker = new PointMarker( 
                            x, y,
                            config.defaultNodeStyle.fill,
                            config.defaultNodeStyle.stroke,
                            config.defaultNodeStyle.strokeWidth,
                            config.ellipseRadii.vertex );

    }

    moveTo(x, y, node) {
        this.x = x;
        this.y = y;
        this.pointMarker.updatePosition(x,y);

		let mouseDrag = window.mouseState.drag;

        //move handles if required
        switch(node.vertex.type) {
            case 'bezier':  // for 'bezier' only
                node.vertex.handle2.offsetPosition(
							mouseDrag.draggedDistanceX,
							mouseDrag.draggedDistanceY );
            case 'quad': // for 'quad' and 'bezier'
                node.vertex.handle1.offsetPosition(
							mouseDrag.draggedDistanceX,
							mouseDrag.draggedDistanceY );
                            break;
        }
    }

    offsetPosition(node) {
		let mouseDrag = window.mouseState.drag;
        this.x += mouseDrag.draggedDistanceX;
        this.y += mouseDrag.draggedDistanceY;
		this.moveTo( this.x, this.y, node );
    }

    setVertexToDragging() {
        this.isDragging = true;
    }

    setVertexToStationary() {
        this.isDragging = false;
    }

	resetInitialPosition() {

        this.initialX = this.x;
        this.initialY = this.y;
	}

    static calculateInitialHandleCoordinates(x, y, xPrev, yPrev) {
        

        let midpoint = this.calculateMidpoint(x, y, xPrev, yPrev);

        let x1 = x;
        let y1 = y;
        let x2 = midpoint.x;
        let y2 = midpoint.y;

        // todo: add angle as config parameter
        let theta = this.toRadians(30);

        let m = midpoint.distance;
        let n = m * Math.tan(theta);

        
        console.log(`m: ${Math.trunc(m)}`);
        console.log(`n: ${Math.trunc(n)}`);

        let xHandle1_pos = x2 + ((n/m)*(y2 - y1));
        let yHandle1_pos = y2 + ((n/m)*(x1 - x2));

        let xHandle1_neg = x2 - ((n/m)*(y2 - y1));
        let yHandle1_neg = y2 - ((n/m)*(x1 - x2));

        console.log(`handle1 pos: (${Math.trunc(xHandle1_pos)}, ${Math.trunc(yHandle1_pos)})`);
        console.log(`handle1 neg: (${Math.trunc(xHandle1_neg)}, ${Math.trunc(yHandle1_neg)})`);
        
        return {
            handle1Coords: {
                x:  xHandle1_pos,
                y:  yHandle1_pos
            },
            handle2Coords: {
                x:  xHandle1_neg,
                y:  yHandle1_neg
            }
        };

    }

    static calculateMidpoint(x, y, xPrev, yPrev) {

        let smallerX, smallerY;
        if (xPrev > x) {
            smallerX = x;
        }
        else {
            smallerX = xPrev;
        }
        if (yPrev > y) {
            smallerY = y;
        }
        else {
            smallerY = yPrev;
        }

        let distanceX = Math.abs(x - xPrev);
        let distanceY = Math.abs(y - yPrev);

        let halfDistanceX = distanceX/2;
        let halfDistanceY = distanceY/2;

        let midPointDistance = Math.sqrt(Math.pow(halfDistanceX,2) + Math.pow(halfDistanceY,2));

        let midpointX = smallerX + halfDistanceX;
        let midpointY = smallerY + halfDistanceY;

        return {
            x: midpointX,
            y: midpointY,
            distance: midPointDistance
        };
    }

    static toRadians (angle) {
        return angle * (Math.PI / 180);
    }

}
