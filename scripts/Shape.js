class Shape {

  constructor(fill, stroke, strokeWidth) {
    this.nodesArray = [];
    this.gPath = new g.Path();

    let style = {
        fill: fill,
        stroke: stroke,
        strokeWidth: strokeWidth
    }
    this.gPathStyle = new GPathStyle(style);
    this.setGPathStyle();
    
    //this.applyColourSchemeToPath();
    
    this.state = new ShapeState();
    
  }
  
    //===================================================================
    //
    //      SHAPE FUNCTIONS - acting on shape as a whole
    //
    //--------------------------------------------------------------------

    setGPathStyle() {
        this.gPath = GPathStyle.set(this.gPath, this.gPathStyle);
    }

    addNode(mouseClickX, mouseClickY, type) {
        let newNode = new Node(mouseClickX, mouseClickY, type);
        let handleCoords;
    
        switch(type) {

            case 'start':
                this.addStartPoint(newNode);     break;
        
            case 'line':
                this.addLineSegment(newNode);     break;
    
            case 'bezier':
            case 'quad':
                handleCoords = this.getHandleCoords(newNode);
                newNode = this.addHandlesToNode(newNode, handleCoords, type);
                this.addBezierOrQuadSegment(newNode, handleCoords, type);   break;
        }
        this.nodesArray.push(newNode);
    }

        // HELPERS for addNode() function

        addStartPoint(newNode) {
            this.gPath.moveTo(newNode.vertex.x, newNode.vertex.y);
        }

        addLineSegment(newNode) {
            this.gPath.lineTo(newNode.vertex.x, newNode.vertex.y);
        }

        addBezierOrQuadSegment(node, handleCoords, type) {

            switch(type) {
                case 'bezier':
                    this.gPath.curveTo(  
                        handleCoords.handle1Coords.x,
                        handleCoords.handle1Coords.y,
                        handleCoords.handle2Coords.x,
                        handleCoords.handle2Coords.y,
                        node.vertex.x,  node.vertex.y );        break;
                case 'quad':
                    this.gPath.quadTo(  
                        handleCoords.handle1Coords.x,
                        handleCoords.handle1Coords.y,
                        node.vertex.x,  node.vertex.y );        break;
            }
        }

        getHandleCoords(node) {
            let currentVertex = node.vertex;
            let prevVertexCoords = this.getPreviousNodeVertexCoordinates();
            let handleCoords = Vertex.calculateInitialHandleCoordinates(
                                                            currentVertex.x, 
                                                            currentVertex.y, 
                                                            prevVertexCoords.x, 
                                                            prevVertexCoords.y);
            return handleCoords;
        }

        addHandlesToNode(node, handleCoords, type) {
            
            // first handle
            let newVertexHandle1 = new Handle( 
                                        handleCoords.handle1Coords.x, 
                                        handleCoords.handle1Coords.y,
                                        1 
                                        );
            node.handlesArray.push(newVertexHandle1);

            // second handle - only required for bezier curves
            if (type === 'bezier') {
                let newVertexHandle2 = new Handle( 
                                            handleCoords.handle2Coords.x, 
                                            handleCoords.handle2Coords.y,
                                            2 
                                            );
                node.handlesArray.push(newVertexHandle2);
            }

            return node;
        }

            // HELPER for getHandleCoords() function
            getPreviousNodeVertexCoordinates() {
                let prevNodeIndex = this.nodesArray.length - 1;
                let prevNode = this.nodesArray[prevNodeIndex];
                return {
                    x: prevNode.vertex.x,
                    y: prevNode.vertex.y
                }
            }
    
    closeGPath() {
        this.gPath.closePath();
    }



    // checks whether point is within (closed) shape's bounds
    containsPoint(x, y) {
        return this.gPath.contains(x,y);
    }

    // Reconstructs shape from moved vertices
    recreateGPathFromNodes() {
        
        this.gPath = new g.Path();
        
        for (let i = 0; i < this.nodesArray.length; i++) {
            let node = this.nodesArray[i];

            switch(node.type) {

                case 'start':
                    this.addStartPoint(node);         break;

                case 'line':
                    this.addLineSegment(node);         break; 

                case 'bezier':
                case 'quad':
                    let handleCoords = this.getHandleCoords(node);
                    this.addBezierOrQuadSegment(node, handleCoords, type);  break;

                    //this.path.curveTo(  handle1.xDraggedPosition, handle1.yDraggedPosition,   
                    //                    handle2.xDraggedPosition, handle2.yDraggedPosition,   
                    //                    x,  y );  break;

            }
            
        }
        this.closeGPath();
        this.setGPathStyle();
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

    checkForActiveNodeAndDeactivate() {
        if (this.hasActiveVertex() || this.hasActiveHandle()) {
            switch(this.whichVertexTypeActive()) {
                case 'handle':
                    this.deactivateHandleAndItsParentVertex(
                            config.mouseOutVertex, config.mouseOutHandle);      break;
                case 'vertex':
                    this.deactivateVertexOrHandle('vertex', config.mouseOutVertex);     break;
            }
        }
    }

    //===================================================================
    //
    //      MOUSE ACTIONS 
    //          - mouse over
    //          - mouse press
    //          - mouse drag
    //          - mouse release
    //
    //--------------------------------------------------------------------

    mouseOver(mouseX, mouseY) {

        let activeNode;
        let activeChild;
        let whichChildInfo;

        // check if any active node already
        if (this.state.activeNodeIndex >= 0) {

            activeNode = this.nodesArray[this.state.activeNodeIndex];
            // check which child is active
            activeChild = activeNode.state.whichChildIsActive;

            whichChildInfo = this.insideAnyNodeChild(mouseX, mouseY);

            // WHILE this mouse point is STILL inside the active node child
            if (whichChildInfo.whichChild === activeChild
                    && whichChildInfo.activeNodeIndex === this.state.activeNodeIndex) {

                // do nothing (even if in a new overlapping node child)
                return;
            }

            // else if this mouse point is no longer inside active child's point marker,
            // i.e. it has just exited an active child node
            else {
                // deactivate the active node and it's child
                activeNode = this.nodesArray[this.state.activeNodeIndex];
                activeNode.deactivate();
                this.state.setNoNodesActive();
            }
        
        }
        else {

            // check if it is in any new node child
            whichChildInfo = this.insideAnyNodeChild(mouseX, mouseY);
            
                // if so, activate the new node and relevant child
                if (whichChildInfo.whichChild !== 'none') { 
                    this.state.setWhichNodeActive(whichChildInfo.activeNodeIndex);
                    activeNode = this.nodesArray[whichChildInfo.activeNodeIndex];
                    activeNode.activate(whichChildInfo);
                }
        }        
    }

    mousePressOnNode(mouseX, mouseY) {
        switch(this.whichVertexTypeActive()) {
            case 'neither':
                break;  //do nothing
            case 'handle':
                this.setEllipseColour(
                                this.activeVertexIndex, this.activeHandleIndex, 
                                'handle', config.mouseClickHandle);
                console.log(`handle clicked`); break;
            case 'vertex':
                this.setEllipseColour(
                                this.activeVertexIndex, -1, 
                                'vertex', config.mouseClickVertex);
                console.log(`vertex clicked`); break;
            default:
                this.updateClickedPosition(mouseX, mouseY);
        }
    }

    mouseDraggingNode(mouseX, mouseY) {
        if (this.hasActiveVertex() || this.hasActiveHandle()) {
            this.isDragging = true;
        }
        if (this.isDragging === true) {
            switch(this.whichVertexTypeActive()) {
                case 'vertex':
                    this.moveOrOffsetVertex(mouseX,mouseY,true);  break;
                case 'handle':
                    this.moveHandle(mouseX, mouseY);            break;
            }
            this.reconstructShape();
        }
    }

    mouseReleasedOnNode() {
        switch(this.whichVertexTypeActive()) {
            case 'handle':
                this.setEllipseColour(
                                this.activeVertexIndex, this.activeHandleIndex, 
                                'handle', config.mouseOverHandle);
            case 'vertex':
                this.setEllipseColour(
                                this.activeVertexIndex, -1, 
                                'vertex', config.mouseOverVertex);
                // if vertex or handle was being dragged
                if (this.isDragging === true) {     
                    this.dropVertexHandles(this.activeVertexIndex);
                    this.isDragging = false;
                }       break;
        }
    }

        // HELPERS for mouse action functions

        //areThereAnyActiveNodes()

        // RETURN OBJECT for this function:
        //             {
        //                  whichChild:         'vertex',       <= 'none', 'vertex', 'handle1', 'handle2'
        //                  activeNodeIndex:     i             
        //             }
        insideAnyNodeChild(mouseX, mouseY) {

            let node;

            for (let i  = 0; i < this.nodesArray.length; i++) {
                node = this.nodesArray[i];

                //check if mouse is inside Vertex Point Marker
                if (node.vertex.pointMarker.isInside(mouseX, mouseY)) {
                    console.log(`inside node ${i}'s vertex`);
                    return {
                                whichChild: 'vertex',
                                activeNodeIndex: i
                            };
                }

                // if quad or bezier, check if mouse is inside first handle Point Marker
                if (node.type === 'quad' || node.type === 'bezier') {
                    if (node.handlesArray[0].pointMarker.isInside(mouseX, mouseY)) {
                        console.log(`inside node ${i}'s handle 1`);
                        return {
                                    whichChild: 'handle1',
                                    activeNodeIndex: i
                                };
                    }
                }
                
                //if bezier, check if mouse is inside second handle Point Marker also
                if (node.type === 'bezier') {
                    if (node.handlesArray[1].pointMarker.isInside(mouseX, mouseY)) {
                        console.log(`inside node ${i}'s handle 2`);
                        return {
                                    whichChild: 'handle2',
                                    activeNodeIndex: i
                                };
                    }
                }
            } // end for loop

            // mouse is not inside any node child
            return {
                whichChild: 'none',
                activeNodeIndex: -1
            };

        }
        

    //===================================================================
    //
    //      DRAWING FUNCTIONS
    //
    //--------------------------------------------------------------------

    drawShape() {
        let node; 
        
        this.drawGPath();
        
        for (let i = 0; i < this.nodesArray.length; i++) {
            node = this.nodesArray[i];
            this.drawPointMarkers(node);
            this.drawVertexCoordinates(node);
            this.drawHandleCoordinates(node);
            this.drawHandleLines(node);
        }
        
    }

        // HELPERS for drawShape()

        // Draw point markers for this node's children
        drawPointMarkers(node) {
            let vertex = node.vertex;
            let handle1, handle2;

            vertex.pointMarker.draw();

            if(node.type === 'quad' || node.type === 'bezier') { // node has at least 1 handle
                handle1 = node.handlesArray[0];
                handle1.pointMarker.draw();
            }

            if (node.type === 'bezier') { // node has 2nd handle
                handle2 = node.handlesArray[1];
                handle2.pointMarker.draw();
            }

        }

        drawVertexCoordinates(node) {
            let vertex = node.vertex;
            vertex.drawCoordinates();
        }

        drawHandleCoordinates(node) {
            switch(node.type) {
                case 'start':
                case 'line':
                                break;
                case 'bezier':
                    node.handlesArray[0].drawCoordinates();
                    node.handlesArray[1].drawCoordinates();     break;
                case 'quad':
                    node.handlesArray[0].drawCoordinates();     break;
            }
        }

        drawHandleLines(node) {
            switch(node.type) {
                case 'start':
                case 'line':
                                break;
                case 'bezier':
                    node.handlesArray[0].drawHandleLine(node);
                    node.handlesArray[1].drawHandleLine(node);     break;
                case 'quad':
                    node.handlesArray[0].drawHandleLine(node);     break;
            }
        }

        drawGPath() {  
            this.gPath.draw(drawingContext);
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
        // only bezier has a second handle
        if (vertex.type === 'bezier') {
            vertex.handlesArray[1].dragHandle(vertex.xDraggedDistance, vertex.yDraggedDistance);
        }
    }

    dropVertexHandles(index) {
        let vertex = this.verticesArray[index];
        if (vertex.hasHandles()) {
            vertex.handlesArray[0].dropHandle();
            // only bezier has a second handle
            if (vertex.type === 'bezier') {
                vertex.handlesArray[1].dropHandle();
            }
        }   
    }

    moveHandle(x,y) {
        let vertex = this.verticesArray[this.activeVertexIndex];
        let handle = vertex.handlesArray[this.activeHandleIndex];
        handle.moveHandle(x,y);
    }

    
    
}
