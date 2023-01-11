class ShapesLibrary {

    constructor(JSONFromDB) {

        this.shapesArray = [];
        this.intersectionShapesArray = [];

        let JSONShapesArray, JSONShape, JSONNodesArray, JSONNode, JSONHandle1, JSONHandle2, nodeType;
        let node, shape, vertexX, vertexY, handle1, handle2;
        let i, j;

        if (arguments.length < 1) {
            return;
            
        }

        else {
            // reconstruct ShapesArray from DB
			JSONShapesArray = JSONFromDB.shapesArray;
			for (i = 0; i < JSONShapesArray.length ; i++) {

                JSONShape = JSONShapesArray[i];

                shape = new Shape( JSONShape.gPathStyle.fill, 
                                    JSONShape.gPathStyle.stroke, 
                                    JSONShape.gPathStyle.strokeWidth   );
                
                //populate nodesArray
                JSONNodesArray = JSONShape.nodesArray;

                for (j = 0; j < JSONNodesArray.length; j++) {

                    JSONNode = JSONNodesArray[j];
                    nodeType = JSONNode.type;

                    vertexX = JSONNode.vertex.x;
                    vertexY = JSONNode.vertex.y;

                    node = new Node(vertexX, vertexY, nodeType);

                    //re-create handles (if types quad or bezier) 
                    // and push them into handlesArray
                    if (nodeType === 'bezier' || nodeType === 'quad') {
                        // has at least 1 handle
                        JSONHandle1 = JSONNode.handlesArray[0];
                        handle1 = new Handle(JSONHandle1.x, JSONHandle1.y, 1);
                        node.handlesArray.push(handle1);
                    }

                    if (nodeType === 'bezier') {
                        // has 2nd handle
                        JSONHandle2 = JSONNode.handlesArray[1];
                        handle2 = new Handle(JSONHandle2.x, JSONHandle2.y, 2);
                        node.handlesArray.push(handle2);
                    }

                    //push node into shape.nodesArray
                    shape.nodesArray.push(node);

                }

                // push shape into shapesArray
                this.shapesArray.push(shape);

                
                
            }

            // reconstruct intersectionShapesArray
            let intersectionShape;
            let JSONIntersectionShapesArray = JSONFromDB.intersectionShapesArray;
            let k, JSONIntersectionShape;

            for (k = 0; k < JSONIntersectionShapesArray.length; k++) {
                JSONIntersectionShape = JSONIntersectionShapesArray[k];

                intersectionShape = new IntersectionShape(
                                JSONIntersectionShape.shapeA_index,
                                JSONIntersectionShape.shapeB_index,
                                JSONIntersectionShape.fill,
                                JSONIntersectionShape.stroke,
                                JSONIntersectionShape.strokeWidth
                );
                
                this.intersectionShapesArray.push(intersectionShape);

            }

        }
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

    mousePress() {
        let shape;
        for (let i = 0; i < this.shapesArray.length; i++) {

            shape = this.shapesArray[i];

            shape.mousePress(mouseX, mouseY);
        }

    }

    mouseDrag() {
        let shape;
        for (let i = 0; i < this.shapesArray.length; i++) {

            shape = this.shapesArray[i];

            shape.mouseDrag(mouseX, mouseY);
        }

    }

    mouseRelease() {
        let shape;
        for (let i = 0; i < this.shapesArray.length; i++) {

            shape = this.shapesArray[i];

            shape.mouseRelease(mouseX, mouseY);
        }

    }

    draw() {
        let i, j, k;
        let shape, intersectionShape;

        // draw shapes
        for (i = 0; i < this.shapesArray.length; i++) {
            shape = this.shapesArray[i];
            shape.recreateGPath();
            shape.draw();
            //shape.drawMarkUp();
        }

        // draw intersections
        for (j = 0; j < this.intersectionShapesArray.length; j++) {
            intersectionShape = this.intersectionShapesArray[j];
            intersectionShape.draw(this.shapesArray);
        }

        // draw shapes mark up (on top most layer)
        for (k = 0; k < this.shapesArray.length; k++) {
            shape = this.shapesArray[k];
            shape.drawMarkUp();
        }
    }

}
