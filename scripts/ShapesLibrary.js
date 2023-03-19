class ShapesLibrary {

    constructor(JSONFromDB) {
        this.shapesArray = [];
		this.linksArray = [];
		this.indexShape1;
		this.indexShape2;

        let JSONShapesArray, JSONShape, JSONShapeStyle, JSONNodesArray, 
				JSONNode, JSONHandle1, JSONHandle2, nodeType, vertexType;
        let node, shape, vertex, vertexX, vertexY, handle1, handle2,
				centrePoint;
		let JSONLinksArray, JSONShapesLink, JSONIndexShape1, JSONIndexShape2,
				JSONIntersectionStyle, shapesLink;
        let i, j, k;

        if (arguments.length < 1) {
            return;
        }
        else {
            // reconstruct ShapesArray from DB
			JSONShapesArray = JSONFromDB.shapesArray;
			for (i = 0; i < JSONShapesArray.length ; i++) {

                JSONShape = JSONShapesArray[i];
				JSONShapeStyle = JSONShape.gPathStyle;

                shape = new Shape( JSONShapeStyle );
                
                //populate nodesArray
                JSONNodesArray = JSONShape.nodesArray;

                for (j = 0; j < JSONNodesArray.length; j++) {

                    JSONNode = JSONNodesArray[j];
                    nodeType = JSONNode.type;

					if (nodeType === 'vertex') {
						vertex = JSONNode.vertex;

						node = new Node(vertex.x, vertex.y, nodeType, vertex.type);

						//re-create handles (if types quad or bezier) 
						// and push them into handlesArray
						if (vertex.type === 'bezier' || vertex.type === 'quad') {
							// has at least 1 handle
							JSONHandle1 = JSONNode.vertex.handle1;
							handle1 = new Handle(JSONHandle1.x, JSONHandle1.y, 1);
							node.vertex.handle1 = handle1;
						}

						if (vertex.type === 'bezier') {
							// has 2nd handle
							JSONHandle2 = JSONNode.vertex.handle2;
							handle2 = new Handle(JSONHandle2.x, JSONHandle2.y, 2);
							node.vertex.handle2 = handle2;
						}
					}
					else if (nodeType === 'centre') {
						centrePoint = JSONNode.centrePoint;
						node = new Node(centrePoint.x, centrePoint.y, nodeType, 'null');
					}
                    shape.nodesArray.push(node);
                }
                this.shapesArray.push(shape);
            }

			// reconstruct linksArray
			JSONLinksArray = JSONFromDB.linksArray;
			for (k = 0; k < JSONLinksArray.length ; k++) {

                JSONShapesLink = JSONLinksArray[k];
				JSONIndexShape1 = JSONShapesLink.indexShape1;
				JSONIndexShape2 = JSONShapesLink.indexShape2;
				JSONIntersectionStyle = JSONShapesLink.intersectionStyle;

				shapesLink = new ShapesLink(
										JSONIndexShape1,
										JSONIndexShape2,
										JSONIntersectionStyle );
				this.linksArray.push(shapesLink);
			}
        }
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
                     
            console.log(`mouse in point markers: ${mouseInPointerMarkersTotal}`);

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
                shape.deactivateNode();
            }
        }

    mousePress() {
        let shape;
		let shapesLink;
		let pressedActiveNode;
		let intersectShapeFillHSLA, intersectShapeStrokeHSLA;
		let intersectShapeStyle;

        for (let i = 0; i < this.shapesArray.length; i++) {
            shape = this.shapesArray[i];
            pressedActiveNode = shape.mousePress(mouseX, mouseY);
			if (navUI.currentMode === 'INTERSECT' && pressedActiveNode) {
				switch(navUI.nextAction) {
					case 'firstShape':
						this.indexShape1 = i;
						console.log(`--- 1 shape clicked so far...`);
						console.log(`--- indexShape1 is: ${this.indexShape1}...`);
						break;
					case 'nextShape':
						this.indexShape2 = i;
						console.log(` ---- 2 shapes now clicked`);
						console.log(`--- indexShape1 is: ${this.indexShape1}...`);
						console.log(`--- indexShape2 is: ${this.indexShape2}...`);

						intersectShapeFillHSLA = {
							hue: 		sliderUI.fill_hue/360,
							saturation: sliderUI.fill_saturation/100,
							value: 		sliderUI.fill_value/100,
							alpha:		sliderUI.fill_alpha/100 };

						intersectShapeStrokeHSLA = {
							hue: 		sliderUI.stroke_hue/360,
							saturation: sliderUI.stroke_saturation/100,
							value: 		sliderUI.stroke_value/100,
							alpha:		sliderUI.stroke_alpha/100 };

						intersectShapeStyle = new GPathStyle(
											intersectShapeFillHSLA,
											intersectShapeStrokeHSLA,
											sliderUI.stroke_width  );

						shapesLink = new ShapesLink( this.indexShape1, this.indexShape2,
														intersectShapeStyle );

						this.linksArray.push(shapesLink);

						// change mode back to SCULPT mode
						navUI.currentMode = 'SCULPT';
						break;
				}
			}
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
        let shape, shape3, shape4;
		let shape1, shape2, path1, path2, intersectionGPath; 

		var gpath3, gpath4, subtr;

        // draw shapes
        for (i = 0; i < this.shapesArray.length; i++) {
            shape = this.shapesArray[i];
            shape.recreateGPath();
            if (i == 0 || i == 1) {
				shape.draw();
			}
        }

        // draw intersections
        for (j = 0; j < this.linksArray.length; j++) {
			let shapesLink = this.linksArray[j];
			let intersectionStyle = shapesLink.intersectionStyle;
			let indexShape1 = shapesLink.indexShape1;
			let indexShape2 = shapesLink.indexShape2;
			let shape1 = this.shapesArray[indexShape1];
			let shape2 = this.shapesArray[indexShape2];
			let path1 = shape1.gPath;
			let path2 = shape2.gPath;
			let intersectionGPath = g.compound(path1, path2, 'intersection');
			intersectionGPath = GPathStyle.set(intersectionGPath, intersectionStyle);
			intersectionGPath.draw(drawingContext);
        }

        // draw shapes mark up (on top most layer)
        for (k = 0; k < this.shapesArray.length; k++) {
            shape = this.shapesArray[k];
			if (k == 0 || k == 1) {
            	shape.drawMarkUp();
			}
        }
		shape3 = this.shapesArray[2];
		shape4 = this.shapesArray[3];
		gpath3 = shape3.gPath;
		gpath4 = shape4.gPath;
		subtr = g.compound( gpath3, gpath4, 'difference');
		subtr = g.colorize(subtr, 'indigo', 'orange', 5);
		subtr.draw(drawingContext);
		shape3.drawMarkUp();
		shape4.drawMarkUp();
    }

}
