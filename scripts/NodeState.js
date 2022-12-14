class NodeState {

    constructor() {
        this.isActive = false;
        this.whichChildIsActive = 'none';  // either 'none', 'vertex', 'handle1', 'handle2', 'centre'
        this.mouseState = new MouseState('node');
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
