class Vertex {

    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type; // { 'start', 'line', 'bezier', 'quadratic' }
        this.vertexEllipse = new VertexEllipse( 
                            x, y,
                            config.mouseOutVertex.fill,
                            config.mouseOutVertex.stroke,
                            config.mouseOutVertex.strokeWidth,
                            config.ellipseRadii.vertex );

        // calculate handles
        //this.handlesArray = getHandlesArray(x, y, type);
        this.handlesArray = [];

        
        this.xDraggedDistance = 0;
        this.yDraggedDistance = 0;
    }

    drawCoordinates() {
        textSize(14);
        fill(0, 0, 90);
        text(`(${Math.trunc(this.x)},${Math.trunc(this.y)})`, this.x+2, this.y);
    }

    moveToNewPosition(x, y) {
        this.x = x;
        this.y = y;
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

    updateDraggedDistance(dx, dy) {
        this.xDraggedDistance = dx;
        this.yDraggedDistance = dy;
    }

    hasHandles() {
        switch (this.type) {
            case 'start':
            case 'line':
                return false;
            default:
                return true;
        }
    }

    calculateInitialHandleCoordinates(x, y, xPrev, yPrev) {

        let midpoint = this.calculateMidpoint(x, y, xPrev, yPrev);

        let x1 = x;
        let y1 = y;
        let x2 = midpoint.x;
        let y2 = midpoint.y;

        // todo: add angle as config parameter
        let theta = this.toRadians(30);

        let m = midpoint.distance;
        let n = m * Math.tan(theta);

        
        console.log(`m: ${m}`);
        console.log(`n: ${n}`);

        let xHandle1_pos = x2 + ((n/m)*(y2 - y1));
        let yHandle1_pos = y2 + ((n/m)*(x1 - x2));

        let xHandle1_neg = x2 - ((n/m)*(y2 - y1));
        let yHandle1_neg = y2 - ((n/m)*(x1 - x2));

        console.log(`handle1 pos: (${xHandle1_pos}, ${yHandle1_pos})`);
        console.log(`handle1 neg: (${xHandle1_neg}, ${yHandle1_neg})`);
        
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
        /*
        let r = this.calculateRadius(x, y, xPrev, yPrev);

        
        let xHandle1 = r * Math.cos(theta);
        let yHandle1 = r * Math.sin(theta);
        
        
        // a = adjacent side
        // b = opposite side
        // c = hypotenuse
        console.log(`xHandle1: ${xHandle1}`);
        console.log(`yHandle1: ${yHandle1}`);
            
        return {
            handle1Coords: {
                x:  midpoint.x + xHandle1/2,
                y:  midpoint.y - yHandle1/2
            },
            handle2Coords: {
                x:  midpoint.x - xHandle1/2,
                y:  midpoint.y + yHandle1/2
            }
        };
        */

    }

    calculateMidpoint(x, y, xPrev, yPrev) {

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

    calculateRadius(x, y, xPrev, yPrev) {
        let biggerX, biggerY, smallerX, smallerY;
        if (xPrev > x) {
            biggerX = xPrev;
            smallerX = x;
        }
        else {
            biggerX = x;
            smallerX = xPrev;
        }
        if (yPrev > y) {
            biggerY = yPrev;
            smallerY = y;
        }
        else {
            biggerY = y;
            smallerY = yPrev;
        }
        let distanceX = biggerX - smallerX;
        let distanceY = biggerY - smallerY;

        let halfDistanceX = distanceX/2;
        let halfDistanceY = distanceY/2;

        let radius = Math.sqrt(Math.pow(halfDistanceX,2) + Math.pow(halfDistanceY,2));

        return radius;
    }

    toRadians (angle) {
        return angle * (Math.PI / 180);
      }
}