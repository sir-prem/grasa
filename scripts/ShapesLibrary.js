class ShapesLibrary {

    constructor() {

        this.shapesArray = [];
    }

    add(shape) {
        this.shapesArray.push(shape);
    }

    mouseOver() {

        let mouseInPointerMarkersTotal = 0;
        let shape;
        for (let i = 0; i < this.shapesArray.length; i++) {

            shape = this.shapesArray[i];

            shape.mouseOver();
            
            mouseInPointerMarkersTotal += 
                    shape.state.mouseInsideHowManyPointMarkers;
                     
            //console.log(`countTOTAL: ${mouseInPointerMarkersTotal}`);

            if (mouseInPointerMarkersTotal > 1) {
                // deactivate any existing nodes while in an overlap
                this.deactivateAnyExistingNodes();
            }
        }
    }

        // helper for mouseOver()

        deactivateAnyExistingNodes() {
            let shape;
            for (let i = 0; i < this.shapesArray.length; i++) {
                shape = this.shapesArray[i];
                shape.deactivateExistingNode();
            }
        }

}