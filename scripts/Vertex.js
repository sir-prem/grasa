class Vertex {

    constructor(x, y) {
        this.x = x;
        this.y = y;
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

        //move handles if required
        switch(node.type) {
            case 'bezier':  // for 'bezier' only
                console.log(`Vertex moveTo() > case bezier: mouseDraggedDist is (${node.state.mouseState.draggedDistance.dx},${node.state.mouseState.draggedDistance.dy})`);
                node.handlesArray[1].offsetPosition(
                                            node.state.mouseState.draggedDistance.dx,
                                            node.state.mouseState.draggedDistance.dy
                                        );
            case 'quad': // for 'quad' and 'bezier'
                console.log(`Vertex moveTo() > case quad: mouseDraggedDist is (${node.state.mouseState.draggedDistance.dx},${node.state.mouseState.draggedDistance.dy})`);
                node.handlesArray[0].offsetPosition(
                                            node.state.mouseState.draggedDistance.dx,
                                            node.state.mouseState.draggedDistance.dy
                                        );      break;
        }
    }

    offsetPosition(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    setVertexToDragging() {
        this.isDragging = true;
    }

    setVertexToStationary() {
        this.isDragging = false;
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