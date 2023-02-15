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
        this.drawPointMarkers(node);
		if (node.type === 'vertex') {
			this.drawVertexAndHandleCoordinates(node);
			this.drawAnyHandleLines(node);
		}
    }

    drawPointMarkers(node) {
        let handle1, handle2;
		let vertex = node.vertex;

		if (node.type === 'vertex') {
        	node.vertex.pointMarker.draw();
        	if(vertex.type === 'quad' || 
				vertex.type === 'bezier') { // node has at least 1 handle
	            handle1 = vertex.handle1;
	            handle1.pointMarker.draw();
	        }
	
	        if (vertex.type === 'bezier') { // node has 2nd handle
	            handle2 = vertex.handle2;
	            handle2.pointMarker.draw();
	        }
    	}
    	else {
			node.centrePoint.pointMarker.draw();    	
    	}
    }

    drawVertexAndHandleCoordinates(node) {
        let vertex = node.vertex;
        let handle1, handle2;

        textSize(14);
        fill(0, 0, 90);


        text( 
            this.getCoordinatesString('vertex', -1, vertex.x, vertex.y), 
            vertex.x+2, vertex.y
            );
        
        switch(vertex.type) {
            case 'bezier':
                handle2 = vertex.handle2;
                text( 
                    this.getCoordinatesString('handle', 2, handle2.x, handle2.y), 
                    handle2.x+2, handle2.y
                    );
            case 'quad':
                handle1 = vertex.handle1;
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

    drawAnyHandleLines(node) {
        switch(node.vertex.type) {
            case 'start':
            case 'line':
                            break;
            case 'bezier':
                this.drawSpecificHandleLine(node, 2);
            case 'quad':
                this.drawSpecificHandleLine(node, 1);
        }
    }

        // helper for handleLines()
        drawSpecificHandleLine(node, handleNumber) {
			let specificHandle;
			let vertex = node.vertex;
			switch (handleNumber) {
				case 1:	
            		specificHandle = vertex.handle1; 	break;
				case 2:
					specificHandle = vertex.handle2;	
			}

            specificHandle.createAndStyleLine(specificHandle.stroke, specificHandle.strokeWidth)
            specificHandle.line.moveTo(node.vertex.x, node.vertex.y);
            specificHandle.line.lineTo(specificHandle.x, specificHandle.y);
            specificHandle.line.draw(drawingContext);
        }

    drawShape(shape) {  
        shape.gPath.draw(drawingContext);
    }

}
