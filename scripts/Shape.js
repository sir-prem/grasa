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
                                        handleCoords.handle1Coords.y 
                                        );
            node.handlesArray.push(newVertexHandle1);

            // second handle - only required for bezier curves
            if (type === 'bezier') {
                let newVertexHandle2 = new Handle( 
                                            handleCoords.handle2Coords.x, 
                                            handleCoords.handle2Coords.y 
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

    mouseOverVertex(mouseX, mouseY) {

        // get array of nodes the mouse is over
        let mouseOverWhichNodes = this.isMouseOverWhichNodes(mouseX, mouseY);
        var mouseEnteringNewNode;

        // if mouse is in at least one node
        if (mouseOverWhichNodes[0].bool) {
            console.log(`index : ${mouseOverWhichNodes[0].index}`);


            /*
            // set "mouse inside" flag for all relevant nodes
            this.setMouseInsideFlag(mouseOverWhichNodes);


            // check if mouse is entering a new node, 
            // and if so, get node type and relevant indices
            // 
            //                  mouseEnteringNewNode = {
            //                                          bool:           false,
            //                                          type:           'undefined',
            //                                          vertexIndex:    -1,
            //                                          handleIndex:    -1
            //                                       };
            mouseEnteringNewNode = this.isMouseEnteringNewNode(mouseOverWhichNodes);
    
                // if so
                if (mouseEnteringNewNode.bool) {

                    // deactivate all nodes
                    this.deactivateAllNodes();

                    // activate the new node
                    this.activateNewNode(mouseEnteringNewNode);

                }
            */
        }

        // if mouse is not in any node
        else {
            /*
            // deactivate all nodes
            this.deactivateAllNodes();

            // unset "mouse inside" flag for all nodes
            this.unsetAllMouseInsideFlags();
            */
        }
        

/*

        let mouseOverNode = mouseOverWhichNodes[0];
        if (mouseOverWhichNodes.length > 1) {
            console.log(`length is: ${mouseOverWhichNodes.length}`);
        }
        let boolNewOverlapping;
        // mouse moving into a vertex
        if (mouseOverNode.bool) {

            
            // check if mouse is over a new overlapping node
            if (mouseOverNodeArray.length > 1) {
                // deactivate previous node
                this.checkForActiveNodeAndDeactivate();
            }
            

            // activate current (new) node
            switch(mouseOverNode.type) {
                case 'vertex':
                    this.activateVertexOrHandle(
                                mouseOverNode.index, 
                                -1, 
                                'vertex', config.mouseOverVertex);      break;
                case 'handle':
                    if (mouseOverNode.index !== this.activeVertexIndex 
                            || mouseOverNode.handleIndex !== this.activeHandleIndex) {
                                this.checkForActiveNodeAndDeactivate();
                    }
                    this.activateHandleAndItsParentVertex(
                                mouseOverNode.index,
                                mouseOverNode.handleIndex,
                                config.mouseOverVertex, config.mouseOverHandle);    break;
            }
        }

        // mouse moving out of a vertex
        else {
            this.checkForActiveNodeAndDeactivate(); 
        }

        */
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

    //returns array of which nodes the mouse is over
    isMouseOverWhichNodes(x, y) {
        let outputArray = [];
        for (let i = 0; i < this.verticesArray.length; i++) {
            let vertex = this.verticesArray[i];

            let vertexEllipsePath = this.getEllipsePath(vertex);
            if (vertexEllipsePath.contains(x, y)) {
                outputArray.push(
                    {bool: true, index: i, type: 'vertex', handleIndex: -1});
            }

            if (vertex.hasHandles()) {
                let handleEllipsePath1 = this.getEllipsePath(vertex.handlesArray[0]);
                if (handleEllipsePath1.contains(x, y)) {
                    outputArray.push(
                        {bool: true, index: i, type: 'handle', handleIndex: 0});
                }
                // only bezier has a second handle
                if (vertex.type === 'bezier') {
                    let handleEllipsePath2 = this.getEllipsePath(vertex.handlesArray[1]);
                    if (handleEllipsePath2.contains(x, y)) {
                        outputArray.push(
                            {bool: true, index: i, type: 'handle', handleIndex: 1});
                    }
                } 
            }

        }
        if (outputArray.length === 0) {
            outputArray.push(
                {bool: false, index: -1, type: 'undefined', handleIndex: -1});
        }
        return outputArray;
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

    drawVertexHandles(node) {
        let vertex = this.verticesArray[i];
        switch(vertex.type) {
            case 'bezier':
                vertex.handlesArray[0].drawHandleLine(vertex.x, vertex.y);
                vertex.handlesArray[0].drawCoordinates(0);
                vertex.handlesArray[0].drawVertexEllipse();
                vertex.handlesArray[1].drawHandleLine(vertex.x, vertex.y);
                vertex.handlesArray[1].drawCoordinates(1);
                vertex.handlesArray[1].drawVertexEllipse();     break;
            case 'quad':
                vertex.handlesArray[0].drawHandleLine(vertex.x, vertex.y);
                vertex.handlesArray[0].drawCoordinates(0);
                vertex.handlesArray[0].drawVertexEllipse();     break;
        }
    }

    drawGPath() {  
        this.gPath.draw(drawingContext);
    }

    drawShape() {
        this.drawGPath();
        for (let i = 0; i < this.nodesArray.length; i++) {
            this.drawVertexEllipse(i);
            this.drawVertexCoordinates(i);
            this.drawVertexHandles(i);
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
