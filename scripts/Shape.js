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

        // HELPERS for addNode() 

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

            // HELPER for getHandleCoords() 
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

    mouseOver() {

        this.setMouseInsidePointMarkers();
        this.overlapHandler();
        
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

        // HELPERS for mouse action methods

        setMouseInsidePointMarkers() {

            let node;

            for (let i  = 0; i < this.nodesArray.length; i++) {
                node = this.nodesArray[i];

                // check mouse inside VERTEX
                this.setMouseInsideChildPointMarker(node, node.vertex, 'vertex', i);

                // check mouse inside HANDLE 1
                if (node.type === 'quad' || node.type === 'bezier') {
                    this.setMouseInsideChildPointMarker(node, node.handlesArray[0], 'handle1', i);
                }
                
                // check mouse inside HANDLE 2
                if (node.type === 'bezier') {
                    this.setMouseInsideChildPointMarker(node, node.handlesArray[1], 'handle2', i);
                }
            } // end for loop

        }


        setMouseInsideChildPointMarker(node, child, type, nodeIndex) {

            if (child.pointMarker.isMouseInside()) {
                if (child.pointMarker.isMouseAlreadyInside()) {
                    console.log(`inside node ${nodeIndex}'s ${type}`);
                }
                else { // mouse just entering
                    console.log(`entering node ${nodeIndex}'s ${type}`);
                    child.pointMarker.setMouseEntered();
                    this.state.mouseInsideHowManyPointMarkers++;
                }
                //activate when there is no overlap
                if (this.state.mouseInsideHowManyPointMarkers == 1) {
                    this.state.setWhichNodeActive(nodeIndex);
                    node.activate(type);
                }
            }
            else {
                // mouse is exiting the point marker
                if (child.pointMarker.isMouseAlreadyInside()) {
                    console.log(`exiting node ${nodeIndex}'s ${type}`);
                    child.pointMarker.setMouseExited();
                    this.state.mouseInsideHowManyPointMarkers--;
                    if (this.state.mouseInsideHowManyPointMarkers == 0) {
                        this.state.setWhichNodeActive(-1);
                        node.deactivate();
                    }
                }
            }

            
        }

        overlapHandler() {
            //console.log(`mouse inside how many: ${this.state.mouseInsideHowManyPointMarkers}`);
            
            // going into an overlap
            if(this.state.mouseInsideHowManyPointMarkers > 1) {
                console.log(`overlapHandler: activeNodeIndex is ${this.state.activeNodeIndex}`);
                this.deactivateExistingNode();
            }
        }

            // helper for overlapHandler()
            deactivateExistingNode() {
                //deactivate existing node 
                if (this.state.activeNodeIndex !== -1) {
                    this.getExistingActiveNode().deactivate();
                    this.state.setWhichNodeActive(-1);
                }
            }


        

    //===================================================================
    //
    //      DRAWING FUNCTIONS
    //
    //--------------------------------------------------------------------

    draw() {
        let draw = new Draw();
        draw.drawShape(this);
    }

    drawMarkUp() {
        let node; 
        let draw = new Draw();

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



    //replaceVertexByUpdated(vertex, index) {
    //    this.verticesArray.splice(index, 1, vertex);
    //}

    
    
}
