class NodeState {

    constructor() {

        this.isActive = false;

        // whichChildIsActive can be either
        //        [ 'none', 
        //          'vertex', 
        //          'handle1', 
        //          'handle2'   ]
        this.whichChildIsActive = 'none'; 

        this.xChildDraggedDistance = 0;  //Child can be vertex or handle point 
        this.yChildDraggedDistance = 0;  //Child can be vertex or handle point
    }


    setActive() {
        this.isActive = true;
    }

    setInactive() {
        this.isActive = false;
    }

    setChildActive(whichChild) {
        this.whichChildIsActive = whichChild;
    }

    setChildInactive() {
        this.whichChildIsActive = 'none';
    }

}