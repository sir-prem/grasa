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

    printAllNodeDetails() {
        console.log(`******************************************`);
        console.log(`*      SHAPE'S NODE DETAILS              *`);
        console.log(`*                                        *`);

        for (let i = 0; i < this.nodesArray.length; i++) {
            console.log(`*----------------------------------------*`);
            console.log(`*      Node ${i+1}`);
            console.log(`*      -----------`);
            this.nodesArray[i].printDetails();
        }
        
        console.log(`*                                        *`);
        console.log(`******************************************`);
    }

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
    recreateGPath() {
        let node, handleCoords;
        this.gPath = new g.Path();

        //initialise handleCoords
        handleCoords = {
            handle1Coords: { x: 0, y: 0 },
            handle2Coords: { x: 0, y: 0 }
        };
        
        for (let i = 0; i < this.nodesArray.length; i++) {
            node = this.nodesArray[i];
            
            switch(node.type) {

                case 'start':
                    this.addStartPoint(node);         break;
                case 'line':
                    this.addLineSegment(node);         break; 
                case 'bezier':
                    handleCoords.handle2Coords.x = node.handlesArray[1].x;
                    handleCoords.handle2Coords.y = node.handlesArray[1].y;
                case 'quad':
                    handleCoords.handle1Coords.x = node.handlesArray[0].x;
                    handleCoords.handle1Coords.y = node.handlesArray[0].y;
                    this.addBezierOrQuadSegment(node, handleCoords, node.type);  break;

            }
            
        }
        this.closeGPath();
        this.setGPathStyle();
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

        let newChildInfo = this.insideAnyNodeChild(mouseX, mouseY);
        let existingActiveNode, existingActiveChild, newActiveNode;

        // check for EXISTING active node
        if ( this.activeNodeExists() ) {

            existingActiveNode = this.getExistingActiveNode();
            existingActiveChild = existingActiveNode.state.whichChildIsActive;

            // WHILE mouse point is STILL inside EXISTING active node child
            if ( this.mouseStillInside(newChildInfo, existingActiveChild) ) {
                // do nothing (even if in a new overlapping node child)
                return;     
            }
            // WHEN mouse point is JUST exiting the EXISTING active node child
            else {
                // deactivate the active node and it's child
                existingActiveNode.deactivate();
                this.state.setNoNodesActive();
            }
        }
        // check for NEW active node
        else { 
                // if so, activate the new node and relevant child
                if (newChildInfo.whichChild !== 'none') { 
                    this.state.setWhichNodeActive(newChildInfo.activeNodeIndex);
                    newActiveNode = this.getNewActiveNode(newChildInfo);
                    newActiveNode.activate(newChildInfo);
                }
        }        
    }

        // HELPERS for mouseOver()

        activeNodeExists() {
            if (this.state.activeNodeIndex >= 0) {
                return true;
            }
            else {
                return false;
            }
        }

        getExistingActiveNode() {
            return this.nodesArray[this.state.activeNodeIndex];
        }

        getNewActiveNode(newChildInfo) {
            return this.nodesArray[newChildInfo.activeNodeIndex];
        }

        mouseStillInside(newChildInfo, existingActiveChild) {
            if (newChildInfo.whichChild === existingActiveChild
                && newChildInfo.activeNodeIndex === this.state.activeNodeIndex) {
                    return true;
            }
            else {
                return false;
            }
        }



    mousePress(mouseX, mouseY) {

        let existingActiveNode;

        // check for EXISTING active node
        if ( this.activeNodeExists() ) {
            existingActiveNode = this.getExistingActiveNode();
            existingActiveNode.setStyleMouseClick();
            existingActiveNode.state.mouseState.clickedPoint.set(mouseX,mouseY);
            this.printAllNodeDetails();
        }
        else { // mouse clicked in empty space
            return; // do nothing
        }
    }

    mouseDrag(mouseX, mouseY) {

        let existingActiveNode;

        // check for EXISTING active node
        if ( this.activeNodeExists() ) {
            existingActiveNode = this.getExistingActiveNode();
            existingActiveNode.drag(mouseX, mouseY);
            //this.nodesArray.splice(this.state.activeNodeIndex, 1, existingActiveNode); //update nodesArray
            this.recreateGPath();
        }
    }

    mouseRelease() {

        let existingActiveNode;

        // check for EXISTING active node
        if ( this.activeNodeExists() ) {
            existingActiveNode = this.getExistingActiveNode();
            existingActiveNode.setStyleMouseOver();
            existingActiveNode.dragRelease();
            this.printAllNodeDetails();
        }
        else { // mouse released in empty space
            return; // do nothing
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

    draw() {
        let node; 
        let draw = new Draw();

        draw.drawShape(this);

        for (let i = 0; i < this.nodesArray.length; i++ ) {
            node = this.nodesArray[i];
            draw.markUpNode(node);
        }
        
        
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

    dragNode(mouseX, mouseY, node) {

    }
    
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
