class NodeState {

    constructor() {
        this.isActive = false;
        this.activeNodePoint = 'none';  
				// either 'none', 'vertex', 
				// 'handle1', 'handle2', 
				// 'centrePoint'
    }


    setActive() {
        this.isActive = true;
    }

    setInactive() {
        this.isActive = false;
		this.unsetActiveNodePoint();
    }

    setActiveNodePoint(type) {
        this.activeNodePoint = type;
    }

    unsetActiveNodePoint() {
        this.activeNodePoint = 'none';
    }

}
