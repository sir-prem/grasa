class ShapesLibrary {

    constructor() {

        this.shapesArray = [];
        this.intersectionShapesArray = [];
    }

    add(shape) {
        this.shapesArray.push(shape);
    }

    addIntersection(intersectionShape) {
        this.intersectionShapesArray.push(intersectionShape);
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