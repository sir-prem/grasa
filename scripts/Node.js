class Node {

    constructor ( x, y, nodeType, vertexType) {
        this.type = nodeType;   // 'vertex' or 'centre'
		if (nodeType === 'vertex') {
			this.vertex = new Vertex(x, y, vertexType);
		}
		else {
			this.centrePoint = new CentrePoint(x, y);
		}
        this.state = new NodeState();
    }

    activate(nodePoint) {
        this.state.setActive();
        this.state.setActiveNodePoint(nodePoint);
        this.setStyleMouseOver();
        
	}

    deactivate() {
        this.state.setInactive();
        this.state.unsetActiveNodePoint();
		if (this.type === 'vertex') 
			this.unstyleAllVertexNodePoints();
		else if (this.type === 'centre')
			this.unstyleCentrePoint();
		

    }

    setStyleMouseOver() {
		if (this.type === 'vertex') {
			this.styleAllVertexNodePoints(config.mouseOverNode);
		}

		else {
			this.styleCentrePoint(config.mouseInsideNodePoint );
		}
    }

    setStyleMouseClick() {
        this.styleNodePoint(
                                    this.state.activeNodePoint,
                                    config.mouseClickNodePoint );
    }
    
    unstyleAllVertexNodePoints() {
        this.styleAllVertexNodePoints(config.defaultNodeStyle);
    }
          
	unstyleCentrePoint() {
		this.styleCentrePoint(config.defaultNodeStyle);
	}

            
    // STYLE SETTING FUNCTIONS
    
	styleCentrePoint(style) {
		this.centrePoint.pointMarker.setColour(style);
	}
	
    styleAllVertexNodePoints(style) {

        this.vertex.pointMarker.setColour(
                                        style );
                                        
        if (this.type === 'bezier' || this.type === 'quad') {

                this.handlesArray[0].pointMarker.setColour(
                                        style );
        }

        if (this.type === 'bezier') {
                this.handlesArray[1].pointMarker.setColour(
                                        style );
        }

    }

    styleNodePoint(nodePointType, style) {
        switch(nodePointType) {
            case 'vertex':
                this.vertex.pointMarker.setColour(style );   break;
            case 'centre':
                this.centrePoint.pointMarker.setColour(style );   break;
            case 'handle1':
                this.handlesArray[0].pointMarker.setColour(style );   break;
            case 'handle2':
                this.handlesArray[1].pointMarker.setColour(style );   break;
        }
    }

    drag(mouseX, mouseY, shape) {

		console.log(`dragging ${this.state.activeNodePoint}`);


		this.state.mouseState.drag.setDragging();

		/*
		this.updateMouseDraggedDistance();
        this.state.mouseState.setDragging();

        switch (this.state.activeNodePoint) {

            case 'vertex':
                this.vertex.moveTo(mouseX, mouseY, this);		
				shape.getCentreNode().centrePoint.recalculate(shape);	break;

            case 'handle1': 
                this.vertex.handle1.moveTo(mouseX, mouseY);    break;

            case 'handle2':
                this.vertex.handle2.moveTo(mouseX, mouseY);    break;
        }
		*/
    }

    dragRelease() {
        if (this.state.mouseState.isDragging) {
            this.state.mouseState.setNoLongerDragging();
        }
		if (this.isActiveNodePointHandle()) {
			this.resetHandlesInitialPosition();
		}
    }
    
    printDetails() {
        console.log(`*      Is Active:          ${this.state.isActive}`);
        console.log(`*      activeNodePoint: 	${this.state.activeNodePoint}`);

		if ( this.type === 'vertex') {
			console.log(`*		vertex.type:	${this.vertex.type}`);
			console.log(`*      Co-ords:          
				( ${Math.trunc(this.vertex.x)}, ${Math.trunc(this.vertex.y)} )`);
			switch (this.vertex.type) {
				case 'bezier':
					console.log(`*      Handle2:
								( 	${Math.trunc(this.vertex.handle2.x)}, 
									${Math.trunc(this.vertex.handle2.y)} )`);
				case 'quad':
					console.log(`*      Handle1:                
								( 	${Math.trunc(this.vertex.handle1.x)}, 
									${Math.trunc(this.vertex.handle1.y)} )`);
					break;
			}

		} 
		else if (this.type === 'centre') {
			console.log(`*      Co-ords:          
				( ${Math.trunc(this.centrePoint.x)}, ${Math.trunc(this.centrePoint.y)} )`);
		}
    }

	updateMouseDraggedDistance() {

        this.state.mouseState.draggedDistance.update(
                            this.state.mouseState.clickedPoint.x,
                            this.state.mouseState.clickedPoint.y, 
                            mouseX, 
                            mouseY  
                            );
	}

	resetHandlesInitialPosition() {
		
            switch (this.type) {
                case 'bezier':
                    this.handlesArray[1].resetInitialPosition();
                case 'quad':
                    this.handlesArray[0].resetInitialPosition();
            }
	}

	isActiveNodePointHandle() {
		if (this.state.activeNodePoint === 'handle1' ||
			this.state.activeNodePoint === 'handle2') {
			return true;
		}
		else return false;
	}

}
