class Node {

    // "type" can be either [ 'start', 'line', 'bezier', 'quad' ]
    constructor(x, y, type) {
        this.vertex = new Vertex(x, y);
        this.type = type;
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
    
    // methods
    // getWhichChildIsActive
    // howManyChildren
    // etc


}
