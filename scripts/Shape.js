class Shape {

  constructor(newStyle) {
    this.nodesArray = [];
    this.gPath = new g.Path();
    this.gPathStyle = newStyle;
    this.setGPathStyle();
    this.state = new ShapeState();
  }
  
    //===================================================================
    //
    //      SHAPE FUNCTIONS - acting on shape as a whole
    //
    //--------------------------------------------------------------------

    printNodeData() {
        console.log(`******************************************`);
        console.log(`*      SHAPE: NODE DATA                  *`);
        console.log(`*                                        *`);

        for (let i = 0; i < this.nodesArray.length; i++) {
            console.log(`*----------------------------------------*`);
            console.log(`*      Node ${i+1}`);
			console.log(`* 		Type: ${this.nodesArray[i].type}`);
            console.log(`*      -----------`);
            this.nodesArray[i].printDetails();
        }
        
        console.log(`*                                        *`);
        console.log(`******************************************`);
    }

    setGPathStyle() {
        this.gPath = GPathStyle.set(this.gPath, this.gPathStyle);
    }

    addNode(mouseClickX, mouseClickY, nodeType, vertexType) {
        let newNode = new Node(mouseClickX, mouseClickY, nodeType, vertexType);
        let handleCoords;
    
		if (nodeType === 'vertex') {
			switch(vertexType) {
				case 'start':
					this.addStartPoint(newNode);     break;
			
				case 'line':
					this.addLineSegment(newNode);     break;
		
				case 'bezier':
				case 'quad':
					handleCoords = this.getHandleCoords(newNode);
					newNode = this.addHandles(newNode, handleCoords, vertexType);
					this.addBezierOrQuadSegment(newNode, handleCoords, vertexType);   break;
			}
		}
		else if (nodeType === 'centre') {
			this.addCentrePoint(newNode);
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

	addBezierOrQuadSegment(node, handleCoords, vertexType) {

		switch(vertexType) {
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
	
	addCentrePoint (newNode) {
		return;	
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

	addHandles(node, handleCoords, vertexType) {
		// first handle
		let newVertexHandle1 = 
			new Handle(	handleCoords.handle1Coords.x, 
						handleCoords.handle1Coords.y,
							1 	);
		node.vertex.handle1 = newVertexHandle1;

		// second handle
		if (vertexType === 'bezier') {
			let newVertexHandle2 = 
				new Handle( handleCoords.handle2Coords.x, 
							handleCoords.handle2Coords.y,
							 2	);
			node.vertex.handle2 = newVertexHandle2;
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
        let node, vertex, handleCoords, i;
        this.gPath = new g.Path();

        //initialise handleCoords
        handleCoords = {
            handle1Coords: { x: 0, y: 0 },
            handle2Coords: { x: 0, y: 0 }
        };
        
        for (i = 0; i < this.nodesArray.length-1; i++) {
            node = this.nodesArray[i];
			//node.printDetails();
			vertex = node.vertex;
            
            switch(vertex.type) {
                case 'start':
                    this.addStartPoint(node);         break;
                case 'line':
                    this.addLineSegment(node);         break; 
                case 'bezier':
                    handleCoords.handle2Coords.x = vertex.handle2.x;
                    handleCoords.handle2Coords.y = vertex.handle2.y;
                case 'quad':
                    handleCoords.handle1Coords.x = vertex.handle1.x;
                    handleCoords.handle1Coords.y = vertex.handle1.y;
                    this.addBezierOrQuadSegment(node, handleCoords, vertex.type);  break;
            }
            
        }
        this.closeGPath();
        this.setGPathStyle();
    }

	getCentreNode() {
		return this.nodesArray[this.nodesArray.length-1];
	}

	dragShape(x, y) {
		console.log('dragShape() initiated');

		let mouseDrag = window.mouseState.drag;

		for (let i= 0; i < this.nodesArray.length; i++) {
			let node = this.nodesArray[i];
			if (node.type === 'vertex') {
				node.vertex.offsetPosition(node);
			}
			else if (node.type === 'centre') {
				node.centrePoint.moveTo(x,y);
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

    mouseOver() {
        this.isMouseInsideAnyNodePoint();
        this.handleOverlaps();
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

        getActiveNode() {
            return this.nodesArray[this.state.activeNodeIndex];
        }

    mousePress(mouseX, mouseY) {
        let activeNode;

        // check for EXISTING active node
        if ( this.activeNodeExists() ) {
            activeNode = this.getActiveNode();
            activeNode.setStyleMouseClick();
            window.mouseState = new MouseState(mouseX,mouseY);
            this.printNodeData();
			return true;
        }
        else { // mouse clicked in empty space
            return; // do nothing
        }
    }

    mouseDrag(mouseX, mouseY) {
        if ( this.activeNodeExists() ) {
			this.dragNodePoint();
        }
    }

    mouseRelease() {
        // check for EXISTING active node
        if ( this.activeNodeExists() ) {
			this.releaseNodePoint();
        }
        else { // mouse released in empty space
            return; // do nothing
        }
    }

        // HELPERS for mouse action methods

		dragNodePoint() {
			let mouseDrag = window.mouseState.drag;
			let activeNode = this.getActiveNode();
			let centrePoint = this.getCentreNode().centrePoint;
			this.draggingInit();
			switch (activeNode.type) {
				case 'vertex':
				case 'handle':
					activeNode.drag(mouseX, mouseY, this); 		break;
				case 'centre':
					this.dragShape( mouseX, mouseY);
			}
			mouseDrag.updateStartPoint();
			let newCentrePoint = centrePoint.recalculate(this);	
			centrePoint.moveTo(newCentrePoint.x, newCentrePoint.y);	
		}

		draggingInit() {
			let mouseDrag = window.mouseState.drag;
			mouseDrag.setDragging();
			mouseDrag.setCurrentPoint(mouseX, mouseY);
			mouseDrag.updateDraggedDistance();
		}

		releaseNodePoint() {
			let activeNode = this.getActiveNode();
			let centrePoint = this.getCentreNode().centrePoint;
			let mouseDrag = window.mouseState.drag;
			if (mouseDrag.isDragging) {
				mouseDrag.setNoLongerDragging();
				activeNode.setStyleMouseOver();
				mouseDrag.resetDraggedDistance();
				if (activeNode.type === 'centre') {
					centrePoint.recalculate(this);
					centrePoint.moveTo(mouseX, mouseY);
				}
			}
		}

        isMouseInsideAnyNodePoint() {
            let node;

            for (let i  = 0; i < this.nodesArray.length; i++) {
                node = this.nodesArray[i];

				if (node.type === 'vertex') {
					this.isMouseInsideNodePoint(
							node, node.vertex, 'vertex', i  );
					
					// check mouse inside HANDLE 1
					if (node.vertex.type === 'quad' || 
						node.vertex.type === 'bezier') {
	                    this.isMouseInsideNodePoint(
							node, node.vertex.handle1, 'handle1', i  );
	                }
	                
	                // check mouse inside HANDLE 2
					if (node.vertex.type === 'bezier') {
	                    this.isMouseInsideNodePoint(
							node, node.vertex.handle2, 'handle2', i  );
	                }
				}
				else {
					this.isMouseInsideNodePoint(
							node, node.centrePoint, 'centre', i   );
				}
            } // end for loop
        }

        isMouseInsideNodePoint(node, child, type, nodeIndex) {
            if (child.pointMarker.isMouseInside()) {
                if (child.pointMarker.isMouseAlreadyInside()) {
                    console.log(`inside node ${nodeIndex}s ${type}`);
                }
                else { // mouse just entering
                    console.log(`entering node ${nodeIndex}s ${type}`);
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
                    console.log(`exiting node ${nodeIndex}s ${type}`);
                    child.pointMarker.setMouseExited();
                    this.state.mouseInsideHowManyPointMarkers--;
                    if (this.state.mouseInsideHowManyPointMarkers == 0) {
                        this.state.setWhichNodeActive(-1);
                        node.deactivate();
                    }
                }
            }
        }

        handleOverlaps() {
            //console.log(`mouse inside how many: 
			//			${this.state.mouseInsideHowManyPointMarkers}`);
            
            // going into an overlap
            if(this.state.mouseInsideHowManyPointMarkers > 1) {
                console.log(`handleOverlaps: activeNodeIndex is 
									${this.state.activeNodeIndex}`);
                this.deactivateNode();
            }
        }

            // helper for handleOverlaps()
            deactivateNode() {
                //deactivate existing node 
                if (this.state.isActive()) {
                    this.getActiveNode().deactivate();
                    this.state.setInactive();
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
}
