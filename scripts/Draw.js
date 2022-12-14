class Draw {

    constructor() {

    }

    // all the below can be static methods in Node class or new Draw class?? YESH
        // and inside it is markUpNode() {
            //                  drawPointMarkers(node)
            //                  drawCoordinates(node) (incl. vertex and handles)
            //                  drawHandleLines(node)
        //}

    markUpNode(node) {
        this.pointMarkers(node);
        this.coordinates(node);
        this.anyHandleLines(node);
    }

    pointMarkers(node) {
        let handle1, handle2;

		if (node.type !== 'centre') {
        	node.vertex.pointMarker.draw();
        	if(node.type === 'quad' || node.type === 'bezier') { // node has at least 1 handle
	            handle1 = node.handlesArray[0];
	            handle1.pointMarker.draw();
	        }
	
	        if (node.type === 'bezier') { // node has 2nd handle
	            handle2 = node.handlesArray[1];
	            handle2.pointMarker.draw();
	        }
    	}
    	else {
			node.centrePoint.pointMarker.draw();    	
    	}
		
        

    }

    coordinates(node) {
        let vertex = node.vertex;
        let handle1, handle2;

        textSize(14);
        fill(0, 0, 90);


        // draw vertex co-ordinates
        text( 
            this.getCoordinatesString('vertex', -1, vertex.x, vertex.y), 
            vertex.x+2, vertex.y
            );
        
        switch(node.type) {
            case 'bezier':
                handle2 = node.handlesArray[1];
                text( 
                    this.getCoordinatesString('handle', 2, handle2.x, handle2.y), 
                    handle2.x+2, handle2.y
                    );
            case 'quad':
                handle1 = node.handlesArray[0];
                text( 
                    this.getCoordinatesString('handle', 1, handle1.x, handle1.y), 
                    handle1.x+2, handle1.y
                    );
        }
    }

        // helper for coordinates()
        getCoordinatesString(type, handleNumber, x, y) {
            switch (type) {
                case 'vertex':
                    return `(${Math.trunc(x)},${Math.trunc(y)})`;
                case 'handle':
                    return `(${Math.trunc(x)},${Math.trunc(y)}) [H${handleNumber}]`; 
            }
        }

    anyHandleLines(node) {
        switch(node.type) {
            case 'start':
            case 'line':
                            break;
            case 'bezier':
                this.specificHandleLine(node, 2);
            case 'quad':
                this.specificHandleLine(node, 1);
        }
    }

        // helper for handleLines()
        specificHandleLine(node, handleNumber) {
            let handle = node.handlesArray[handleNumber-1];

            handle.createAndStyleLine(handle.stroke, handle.strokeWidth)
            handle.line.moveTo(node.vertex.x, node.vertex.y);
            handle.line.lineTo(handle.x, handle.y);
            handle.line.draw(drawingContext);
        }

    drawShape(shape) {  
        shape.gPath.draw(drawingContext);
    }

}