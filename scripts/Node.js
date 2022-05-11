class Node {

    
    constructor(x, y, type) {
        this.vertex = new Vertex(x, y);
        this.type = type;   // either 'start', 'line', 'bezier', 'quad'
        this.handlesArray = [];
        this.state = new NodeState();

          

    }



    activate(whichChildInfo) {
        this.state.setActive();
        this.state.setChildActive(whichChildInfo.whichChild);

        this.setStyleMouseOver();
        
    }

    deactivate() {
        this.state.setInactive();
        this.state.setChildInactive();
        this.setStyleDefault();
    }

    setStyleMouseOver() {
        // set all children (vertex + handle(s) ) to mouse over style
        this.setStyleToAllChildren(config.mouseOverNode);

        // set active child to mouse inside style
        this.setStyleToSpecificChild(
                                    this.state.whichChildIsActive,
                                    config.mouseInsideChildNode );
    }

    setStyleMouseClick() {
        this.setStyleToSpecificChild(
                                    this.state.whichChildIsActive,
                                    config.mouseClickChildNode );
    }
    
    setStyleDefault() {
        // set all children (vertex + handle(s) ) to mouse over style
        this.setStyleToAllChildren(config.defaultNodeStyle);
    }
            

            
    // STYLE SETTING FUNCTIONS
    
    setStyleToAllChildren(style) {

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

    setStyleToSpecificChild(whichChild, style) {
        switch(whichChild) {
            case 'vertex':
                this.vertex.pointMarker.setColour(style );   break;
            case 'handle1':
                this.handlesArray[0].pointMarker.setColour(style );   break;
            case 'handle2':
                this.handlesArray[1].pointMarker.setColour(style );   break;
        }
    }

    drag(mouseX, mouseY) {

        //check which child active
        let activeChild = this.state.whichChildIsActive;

        // update mouse dragged distance (from clicked point to current mouse location)
        this.state.mouseState.draggedDistance.update(
                            this.state.mouseState.clickedPoint.x,
                            this.state.mouseState.clickedPoint.y, 
                            mouseX, 
                            mouseY  
                            );

        // set node's mouse state to dragging
        this.state.mouseState.setDragging();

        switch (activeChild) {

            case 'vertex':
                // move vertex and update handles accordingly
                this.vertex.moveTo(mouseX, mouseY, this);
                console.log(`dragging ${activeChild}`);         break;
    
            case 'handle1': 
                this.handlesArray[0].moveTo(mouseX, mouseY);    break;
            case 'handle2':
                // move handle to reshape the curve (quad or bezier)
                console.log(`dragging ${activeChild}`);
                this.handlesArray[1].moveTo(mouseX, mouseY);    break;

        }

        
    }

    dragRelease() {
        if (this.state.mouseState.isDragging) {
            this.state.mouseState.setNoLongerDragging();
        }
        //check which child active
        let activeChild = this.state.whichChildIsActive;

        //reset handle initial position
        if (activeChild !== 'none') {

            switch (this.type) {
                case 'bezier':
                    this.handlesArray[1].resetInitialPosition();
                case 'quad':
                    this.handlesArray[0].resetInitialPosition();
            }

        }

    }
/*
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
        */
    
    printDetails() {
        console.log(`*      Is Active:          ${this.state.isActive}`);
        console.log(`*      Which Child Active: ${this.state.whichChildIsActive}`);
        console.log(`*      Type:               ${this.type}`);
        console.log(`*      Vertex:             ( ${Math.trunc(this.vertex.x)}, ${Math.trunc(this.vertex.y)} )`);
        switch (this.type) {
            case 'bezier':
                console.log(`*      Handle2:                ( ${Math.trunc(this.handlesArray[1].x)}, ${Math.trunc(this.handlesArray[1].y)} )`);
            case 'quad':
                console.log(`*      Handle1:                ( ${Math.trunc(this.handlesArray[0].x)}, ${Math.trunc(this.handlesArray[0].y)} )`);
                break;
        }
    }

    // methods
    // getWhichChildIsActive
    // howManyChildren
    // etc


}
