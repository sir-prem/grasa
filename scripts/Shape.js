class Shape {

  constructor(fill, stroke, strokeWidth) {
    this.verticesArray = [];
    this.fill = fill;
    this.stroke = stroke;
    this.strokeWidth = strokeWidth;
    this.path = new g.Path();
    this.path = g.colorize(this.path, fill, stroke, strokeWidth);
    this.clickedX = 0;
    this.clickedY = 0;
    this.closed = false;
    this.activeVertexIndex = -1;
    this.activeHandleIndex = -1;
    this.isDragging = false;
    
  }
  
  

 
    //===================================================================
    //
    //      SHAPE FUNCTIONS - acting on shape as a whole
    //
    //--------------------------------------------------------------------

    addNewVertex(x, y, type) {
        let newVertex = new Vertex(x, y, type);
    
        switch(type) {

          case 'start':
            this.path.moveTo(newVertex.x, newVertex.y);     break;
    
          case 'line':
            this.path.lineTo(newVertex.x, newVertex.y);     break;
    
          case 'bezier':
            let newVertexHandle1 = new VertexHandle( 350, 150, 'lightpink', 0.5 );
            let newVertexHandle2 = new VertexHandle( 150, 350, 'tan', 0.5 );
            newVertex.handlesArray.push(newVertexHandle1);
            newVertex.handlesArray.push(newVertexHandle2);
    
            this.path.curveTo(  350, 150,   
                                150, 350,   
                                newVertex.x,  newVertex.y );  break;
        }
        this.verticesArray.push(newVertex);
    }
    
    closeShape() {
        this.path.closePath();
    }

    setColour(fill, stroke, strokeWidth) {
        this.path = g.colorize(this.path, fill, stroke, strokeWidth);
    }

    // checks whether point is within (closed) shape's bounds
    containsPoint(x, y) {
        return this.path.contains(x,y);
    }

    // Reconstructs shape from moved vertices
    reconstructShape() {
        this.path = new g.Path();
        for (let i = 0; i < this.verticesArray.length; i++) {
            let vertex = this.verticesArray[i];
            let x = vertex.x;
            let y = vertex.y;

            switch(vertex.type) {

                case 'start':
                    this.path.moveTo(x, y);         break;

                case 'line':
                    this.path.lineTo(x, y);         break; 

                case 'bezier':
                    let handle1 = vertex.handlesArray[0];
                    let handle2 = vertex.handlesArray[1];
                    this.path.curveTo(  handle1.xDraggedPosition, handle1.yDraggedPosition,   
                                        handle2.xDraggedPosition, handle2.yDraggedPosition,   
                                        x,  y );  break;

            }
            
        }
        //this.closeShape();
        this.setColour(this.fill, this.stroke, this.strokeWidth);
    }


    //===================================================================
    //
    //      VERTEX FUNCTIONS - acting on the vertex
    //
    //--------------------------------------------------------------------

    setActiveVertexIndex(index) {
        this.activeVertexIndex = index;
    }

    setActiveHandleIndex(index) {
        this.activeHandleIndex = index;
    }

    hasActiveVertex() {
        if (this.activeVertexIndex >= 0) { return true; }
        return false;
    }

    hasActiveHandle() {
        if (this.activeHandleIndex >= 0) { return true; }
        return false;
    }

    whichVertexTypeActive() {
        if (this.hasActiveHandle()) {
            return 'handle';
        }
        else if (this.hasActiveVertex()) {
            return 'vertex';
        }
        else {
            return 'neither';
        }
    }

    hasNoActiveVertices() {
        if (this.activeVertexIndex === -1 ) { return true; }
        return false;
    }

    hasNoActiveHandles() {
        if (this.activeHandleIndex === -1 ) { return true; }
        return false;
    }

    setEllipseColour(vertexIndex, handleIndex, type, configEvent) {
        let object;
        switch(type) {
            case 'vertex':
                object = this.verticesArray[vertexIndex];   break;
            case 'handle':
                let vertex = this.verticesArray[vertexIndex];
                object = vertex.handlesArray[handleIndex];  break;
        }
        object.vertexEllipse.setColour(
            configEvent.fill, 
            configEvent.stroke, 
            configEvent.strokeWidth
            );
            
    }
/*
    setHandleEllipseColour(handleIndex, event) {
        let vertex = this.verticesArray[this.activeVertexIndex];
        let handle = vertex.handlesArray[handleIndex];
        switch(event) {
            case 'mouseover':
                handle.vertexEllipse.setColour(
                    config.mouseOverHandle.fill, 
                    config.mouseOverHandle.stroke, 
                    config.mouseOverHandle.strokeWidth
                    );          break;
            case 'mouseclick':
                handle.vertexEllipse.setColour(
                    config.mouseClickHandle.fill, 
                    config.mouseClickHandle.stroke, 
                    config.mouseClickHandle.strokeWidth
                    );          break;
        }
    }
*/
    activateVertexOrHandle(vertexIndex, handleIndex, type, configEvent) {
        switch (type) {
            case 'vertex':
                this.setEllipseColour(vertexIndex, -1, 'vertex', configEvent);
                this.setActiveVertexIndex(vertexIndex);     break;
            case 'handle':
                this.setEllipseColour(vertexIndex, handleIndex, 'handle', configEvent);
                this.setActiveHandleIndex(handleIndex);     break;
        }
    }

    activateHandleAndItsParentVertex(vertexIndex, handleIndex, configEventVertex, configEventHandle) {
        this.activateVertexOrHandle(vertexIndex, handleIndex, 'handle', configEventHandle);
        this.activateVertexOrHandle(vertexIndex, -1, 'vertex', configEventVertex);
    }

    deactivateVertexOrHandle(type, configEvent) {
        switch(type) {
            case 'vertex':
                this.setEllipseColour(
                            this.activeVertexIndex, 
                            -1, 
                            'vertex', configEvent);
                this.setActiveVertexIndex(-1);      break;
            case 'handle':
                this.setEllipseColour(
                            this.activeVertexIndex, 
                            this.activeHandleIndex,
                            'handle', configEvent);
                this.setActiveHandleIndex(-1);      break;
        }
    }

    // note: must deactivate Handle before its Vertex as handle depends on vertex
    deactivateHandleAndItsParentVertex(configEventVertex, configEventHandle) {
        this.deactivateVertexOrHandle('handle', configEventHandle);
        this.deactivateVertexOrHandle('vertex', configEventVertex);
    }

    mouseOverVertex(mouseX, mouseY) {
        let mouseOverNode = this.isMouseOverWhichVertex(mouseX, mouseY);
        // mouse moving into a vertex
        if (mouseOverNode.bool) {
            switch(mouseOverNode.type) {
                case 'vertex':
                    this.activateVertexOrHandle(
                                mouseOverNode.index, 
                                -1, 
                                'vertex', config.mouseOverVertex);      break;
                case 'handle':
                    this.activateHandleAndItsParentVertex(
                                mouseOverNode.index,
                                mouseOverNode.handleIndex,
                                config.mouseOverVertex, config.mouseOverHandle);    break;
            }
        }
        // mouse moving out of a vertex
        if (this.hasActiveVertex() || this.hasActiveHandle()) {
            if (mouseOverNode.bool === false) {
                switch(this.whichVertexTypeActive()) {
                    case 'handle':
                        this.deactivateHandleAndItsParentVertex(
                                config.mouseOutVertex, config.mouseOutHandle);      break;
                    case 'vertex':
                        this.deactivateVertexOrHandle('vertex', config.mouseOutVertex);     break;
                }
            }
        }
    }

    //returns index of array pointing to which vertex the mouse is on
    isMouseOverWhichVertex(x, y) {
        for (let i = 0; i < this.verticesArray.length; i++) {
            let vertex = this.verticesArray[i];

            let vertexEllipsePath = this.getEllipsePath(vertex);
            if (vertexEllipsePath.contains(x, y)) {
                return {bool: true, index: i, type: 'vertex', handleIndex: -1};
            }

            if (vertex.hasHandles()) {
                //assume bezier for now
                let handleEllipsePath1 = this.getEllipsePath(vertex.handlesArray[0]);
                let handleEllipsePath2 = this.getEllipsePath(vertex.handlesArray[1]);
                if (handleEllipsePath1.contains(x, y)) {
                    return {bool: true, index: i, type: 'handle', handleIndex: 0};
                }
                else if (handleEllipsePath2.contains(x, y)) {
                    return {bool: true, index: i, type: 'handle', handleIndex: 1};
                }
            }

        }
        return {bool: false, index: -1, type: 'undefined', handleIndex: -1};
    }

    isMouseOverActiveVertex(x, y) {
        let vertex = this.verticesArray[this.activeVertexIndex];
        let ellipsePath = this.getEllipsePath(vertex);
        if (ellipsePath.contains(x, y)) {
            return true;
        }
        return false;
    }

    isMouseOverActiveHandle(x, y) {
        let vertex = this.verticesArray[this.activeVertexIndex];
        let handle = vertex.handlesArray[this.activeHandleIndex];
        let ellipsePath = this.getEllipsePath(handle);
        if (ellipsePath.contains(x, y)) {
            return true;
        }
        return false;
    }

    //get ellipse path for given vertex or handle node
    getEllipsePath(node) {
        return node.vertexEllipse.getPath();
    }





    //===================================================================
    //
    //      DRAWING FUNCTIONS
    //
    //--------------------------------------------------------------------


    // Draw circles over each vertex point for this shape
    drawVertexEllipse(i) {
        let vertexEllipse = this.verticesArray[i].vertexEllipse;
        vertexEllipse.draw();
    }

    drawVertexCoordinates(i) {
        let vertex = this.verticesArray[i];
        vertex.drawCoordinates();
    }

    drawVertexHandles(i) {
        let vertex = this.verticesArray[i];
        switch(vertex.type) {
            case 'bezier':
                vertex.handlesArray[0].drawHandleLine(vertex.x, vertex.y);
                vertex.handlesArray[0].drawCoordinates(0);
                vertex.handlesArray[0].drawVertexEllipse();
                vertex.handlesArray[1].drawHandleLine(vertex.x, vertex.y);
                vertex.handlesArray[1].drawCoordinates(1);
                vertex.handlesArray[1].drawVertexEllipse();
        }
    }

    drawPath() {  
        this.path.draw(drawingContext);
    }

    drawShape() {
        for (let i = 0; i < this.verticesArray.length; i++) {
            this.drawVertexEllipse(i);
            this.drawVertexCoordinates(i);
            this.drawVertexHandles(i);
        }
        this.drawPath();
    }

    //===================================================================
    //
    //      TRANSLATE SHAPE FUNCTIONS
    //
    //--------------------------------------------------------------------

    translatePath(x,y) {
        this.path = g.translate(this.path, {x: x, y: y});
    }

    dragShape(x, y) {
        let distance = this.getMouseDraggedDistance(x,y);
        this.translatePath(distance.x, distance.y);
        this.offsetAllVertices(distance.x, distance.y);
        this.updateClickedPosition(x,y);
    }

    offsetAllVertices(dx, dy) {
        for (let i = 0; i < this.verticesArray.length; i++) {
            this.moveOrOffsetVertex( dx, dy, i, false );
        }
    }

    updateClickedPosition(x, y) {
        this.clickedX = x;
        this.clickedY = y;
    }

    getMouseDraggedDistance(x, y) {
        let dx = x - this.clickedX;
        let dy = y - this.clickedY;
        return {x: dx, y: dy};
    }

    //===================================================================
    //
    //      MOVE VERTEX FUNCTIONS
    //
    //--------------------------------------------------------------------

    moveOrOffsetVertex(x,y,isMove) {
        let vertex = this.verticesArray[this.activeVertexIndex];
        if(isMove) {
            vertex.moveToNewPosition(x,y);
        } else { 
            vertex.offsetPosition(x,y);
        }
        this.translateVertexEllipse(vertex);
        let distance = this.getMouseDraggedDistance(x, y);
        vertex.updateDraggedDistance(distance.x, distance.y);
        if (vertex.hasHandles()) {
            this.dragVertexHandles(vertex);
        }

        //this.replaceVertexByUpdated(vertex, index); // is this required?
    }

    translateVertexEllipse(vertex) {
        vertex.vertexEllipse.translate(vertex.x,vertex.y);
    }

    replaceVertexByUpdated(vertex, index) {
        this.verticesArray.splice(index, 1, vertex);
    }

    dragVertexHandles(vertex) {
        vertex.handlesArray[0].dragHandle(vertex.xDraggedDistance, vertex.yDraggedDistance);
        vertex.handlesArray[1].dragHandle(vertex.xDraggedDistance, vertex.yDraggedDistance);
    }

    dropVertexHandles(index) {
        let vertex = this.verticesArray[index];
        if (vertex.hasHandles()) {
            vertex.handlesArray[0].dropHandle();
            vertex.handlesArray[1].dropHandle();
        }   
    }


    moveHandle(x,y) {
        let vertex = this.verticesArray[this.activeVertexIndex];
        let handle = vertex.handlesArray[this.activeHandleIndex];
        handle.moveHandle(x,y);
    }
    
}
