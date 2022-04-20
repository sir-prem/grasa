class Shape {

  constructor(fill, stroke, strokeWidth) {
    this.verticesArray = [];

    let scheme = {
        fill: fill,
        stroke: stroke,
        strokeWidth: strokeWidth
    }
    this.colourScheme = new ShapeColourScheme(scheme);

    this.path = new g.Path();
    this.applyColourSchemeToPath();
    
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
        let obj;
        let handleCoords;
    
        switch(type) {

            case 'start':
                this.path.moveTo(newVertex.x, newVertex.y);     break;
        
            case 'line':
                this.path.lineTo(newVertex.x, newVertex.y);     break;
    
            case 'bezier':
                obj = this.calculateAndStoreVertexHandles(newVertex, x, y, 'bezier');
                newVertex = obj.newVertex;
                handleCoords = obj.handleCoords;

                this.path.curveTo(  
                                    handleCoords.handle1Coords.x,
                                    handleCoords.handle1Coords.y,
                                    handleCoords.handle2Coords.x,
                                    handleCoords.handle2Coords.y,
                                    newVertex.x,  newVertex.y );  break;
            case 'quad':
                obj = this.calculateAndStoreVertexHandles(newVertex, x, y, 'quad');
                newVertex = obj.newVertex;
                handleCoords = obj.handleCoords;

                this.path.quadTo(  
                                    handleCoords.handle1Coords.x,
                                    handleCoords.handle1Coords.y,
                                    newVertex.x,  newVertex.y );  break;
        }
        this.verticesArray.push(newVertex);
    }

    calculateAndStoreVertexHandles(newVertex, x, y, type) {
        let prevVertexCoords = this.getPreviousVertexCoordinates();
        let handleCoords = newVertex.calculateInitialHandleCoordinates(
                                    x, y, 
                                    prevVertexCoords.x, prevVertexCoords.y);
        
        // first handle
        let newVertexHandle1 = new VertexHandle( 
            handleCoords.handle1Coords.x, 
            handleCoords.handle1Coords.y,
            config.handles.handle1.stroke, 
            config.handles.handle1.strokeWidth );
        newVertex.handlesArray.push(newVertexHandle1);

        // second handle is only required for bezier curves
        if (type === 'bezier') {
            let newVertexHandle2 = new VertexHandle( 
                handleCoords.handle2Coords.x, 
                handleCoords.handle2Coords.y,
                config.handles.handle2.stroke, 
                config.handles.handle2.strokeWidth );
            newVertex.handlesArray.push(newVertexHandle2);
        }

        return {
            newVertex: newVertex,
            handleCoords: handleCoords
        }
        
    }
    
    closeShape() {
        this.path.closePath();
    }



    // checks whether point is within (closed) shape's bounds
    containsPoint(x, y) {
        return this.path.contains(x,y);
    }

    // Reconstructs shape from moved vertices
    reconstructShape() {
        let handle1, handle2;
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
                    handle1 = vertex.handlesArray[0];
                    handle2 = vertex.handlesArray[1];
                    this.path.curveTo(  handle1.xDraggedPosition, handle1.yDraggedPosition,   
                                        handle2.xDraggedPosition, handle2.yDraggedPosition,   
                                        x,  y );  break;

                case 'quad':
                    handle1 = vertex.handlesArray[0];
                    this.path.quadTo(  handle1.xDraggedPosition, handle1.yDraggedPosition,  
                                        x,  y );  break;

            }
            
        }
        this.closeShape();
        this.applyColourSchemeToPath();
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

    isNewOverlappingNode(mouseOverNode) {
        //bool: true, index: i, type: 'handle', handleIndex: 1
        if (this.hasActiveVertex() || this.hasActiveHandle()) {
            switch(this.whichVertexTypeActive()) {
                case 'handle':
                    if (mouseOverNode.type !== 'handle'
                        || mouseOverNode.handleIndex !== this.activeHandleIndex) {
                            return true;
                    }
                    return false;
                case 'vertex':
                    if (mouseOverNode.type !== 'vertex'
                        || mouseOverNode.index !== this.activeVertexIndex) {
                            return true;
                    }
                    return false;
            }
        }
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
                vertex.handlesArray[1].drawVertexEllipse();     break;
            case 'quad':
                vertex.handlesArray[0].drawHandleLine(vertex.x, vertex.y);
                vertex.handlesArray[0].drawCoordinates(0);
                vertex.handlesArray[0].drawVertexEllipse();     break;
        }
    }

    drawPath() {  
        this.path.draw(drawingContext);
    }

    drawShape() {
        this.drawPath();
        for (let i = 0; i < this.verticesArray.length; i++) {
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

    getPreviousVertexCoordinates() {
        let prevVertexIndex = this.verticesArray.length - 1;
        let prevVertex = this.verticesArray[prevVertexIndex];
        return {
            x: prevVertex.x,
            y: prevVertex.y
        }
    }
    
}
