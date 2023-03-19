var shapesLibrary;
var load;
var cp;
var sliderUI;
var newShape;
var consoleUI = new ConsoleUI();
var navUI;

function setup() {
    frameRate(10);
	colorMode(HSB, 100);
	setUpCanvas();
    config = setupConfig();
	initVariables();
	makeSocketConnection();
	actionLoadRequest();
	addColourSliders();
}

	// helper functions for setup()
	function disableFriendlyErrors() {
		p5.disableFriendlyErrors = true; // disables FES
	}

	function setUpCanvas() {
		let sketchWidth = document.getElementById("grasa-div").offsetWidth;
		let sketchHeight = document.getElementById("grasa-div").offsetHeight;
		let renderer = createCanvas(sketchWidth, 620);
		renderer.parent("grasa-div");
	}

	function initVariables() {
		navUI = consoleUI.navUI; 
		navUI.currentMode = 'SCULPT';
		nextAction = 'sculpt shapeA';
		shapesLibrary = new ShapesLibrary();
	}

	function makeSocketConnection() {
		socket = io.connect(
			'http://localhost:4000' || 
			'https://viridian-marked-fork.glitch.me'  );
	}

	function actionLoadRequest() {
		socket.on(`load req recd`, (JSONLoadData) => {
			console.log(JSONLoadData.message);

			if (JSONLoadData.result) {
				//NOTE: here there could be a warning, before loading old data from DB,
				//      e.g. Are you sure? Any unsaved work will be lost
				shapesLibrary = new ShapesLibrary(JSONLoadData.shapesLibraryFromDB);
			   console.log(`reached load data results.`);
				console.log(`shapes array length is: ${shapesLibrary.shapesArray.length}`); 
			}
			else {
				// anything here if req'd
			}
		});
	}

	function addColourSliders() {
		sliderUI = new SliderUI();

		sliderUI.createFillSliders();
		sliderUI.setFillSliderPositions(width-165, 220, 20);
		sliderUI.setFillSliderStyles('100px');
		
		sliderUI.createStrokeSliders();
		sliderUI.setStrokeSliderPositions(width-165, 350, 20);
		sliderUI.setStrokeSliderStyles('100px');
	}

function draw() { 
	clear();
	drawBackground();
	NavUI.drawHeader(width, height, sliderUI, key, navUI.currentMode, nextAction); 
	sliderUI.updateValues();
	consoleUI.draw(width-420, height-200, 370, 180);
	
	if (shapesLibrary.shapesArray.length > 0) {
        shapesLibrary.draw();
    }
	if (navUI.currentMode === 'CREATE newShape' && typeof newShape !== 'undefined') {
		newShape.draw();
		newShape.drawMarkUp();
	}
	g.ellipse({x: 0, y: 0}, 100, 100).draw(drawingContext);
}

function mouseMoved() {
    if (navUI.currentMode === 'SCULPT' || navUI.currentMode === 'INTERSECT') {
        shapesLibrary.mouseOver();
    }

    // prevent default
    return false;
}

function mousePressed() {
    if (navUI.currentMode === 'SCULPT' || navUI.currentMode === 'INTERSECT') {
       shapesLibrary.mousePress();
    }
	else if (navUI.currentMode === 'CREATE newShape' ) {
		switch (navUI.nextAction) {
			case 'startPoint':
				newShapeFillHSLA = {
					hue: 		sliderUI.fill_hue/360,
					saturation: sliderUI.fill_saturation/100,
					value: 		sliderUI.fill_value/100,
					alpha:		sliderUI.fill_alpha/100 };
				
				newShapeStrokeHSLA = {
					hue: 		sliderUI.stroke_hue/360,
					saturation: sliderUI.stroke_saturation/100,
					value: 		sliderUI.stroke_value/100,
					alpha:		sliderUI.stroke_alpha/100 };

				newStyle = new GPathStyle(
									newShapeFillHSLA,
									newShapeStrokeHSLA,
									sliderUI.stroke_width  );

				newShape = new Shape(newStyle);
				newShape.addNode(mouseX, mouseY, 'vertex', 'start');
				break;

			case 'addLine':
				newShape.addNode( mouseX, mouseY, 'vertex', 'line');  break;

			case 'addBezier':
				newShape.addNode( mouseX, mouseY, 'vertex', 'bezier');  break;

			case 'addQuad':
				newShape.addNode (mouseX, mouseY, 'vertex', 'quad');   break;
				
			case 'closeShape':
				cp = g.centerPoint(newShape.gPath);
				newShape.addNode ( cp.x, cp.y, 'centre', 'null');
				
				newShape.closeGPath();
				shapesLibrary.add(newShape);

				navUI.currentMode = 'SCULPT';
				navUI.nextAction = 'unknown';
				//sliderUI.fill_hue_slider.value(0);
				//sliderUI.fill_saturation_slider.value(50);
				break;
		}
	}
}

function mouseDragged() {
    if (navUI.currentMode === 'SCULPT' || navUI.currentMode === 'INTERSECT') {
       shapesLibrary.mouseDrag();
    }     
}

function mouseReleased() {
    if (navUI.currentMode === 'SCULPT' || navUI.currentMode === 'INTERSECT') {
       shapesLibrary.mouseRelease();
    }
}

function keyPressed() {
	navUI.processKeyPress(key);
}

function drawBackground() {
    // hue (0-360)
    // saturation (0-100)
    // value (0-100) where 0 is black, and 100 is white
    background(config.backgroundColour.hue,
                config.backgroundColour.saturation,
                config.backgroundColour.value);
}

function setupConfig() {
    let ellipseStrokeWidth = 1;

    mouseOverNode = {
        fill:           'transparent',
        stroke:         'lightsteelblue',
        strokeWidth:    ellipseStrokeWidth
    };

    mouseInsideNodePoint = {
        fill:           'lightsteelblue',
        stroke:         'lightsteelblue',
        strokeWidth:    ellipseStrokeWidth
    };

    mouseClickNodePoint = {
        fill:           'goldenrod',
        stroke:         'lightsteelblue',
        strokeWidth:    ellipseStrokeWidth
    };

    defaultNodeStyle = {
        fill:           'transparent',
        stroke:         'indianred',
        strokeWidth:    ellipseStrokeWidth
    };

    mouseOverVertex = {
        fill:           'goldenrod',
        stroke:         'indianred',
        strokeWidth:    ellipseStrokeWidth
    };

    mouseOutVertex = {
        fill:           'transparent',
        stroke:         'indianred',
        strokeWidth:    ellipseStrokeWidth
    };

    mouseClickVertex = {
        fill:           'indianred',
        stroke:         'indianred',
        strokeWidth:    ellipseStrokeWidth
    };

    mouseOverHandle = {
        fill:           'lightskyblue',
        stroke:         'lightsteelblue',
        strokeWidth:    ellipseStrokeWidth
    };

    mouseOutHandle = {
        fill:           'transparent',
        stroke:         'indianred',
        strokeWidth:    ellipseStrokeWidth
    };

    mouseClickHandle = {
        fill:           'cornflowerblue',
        stroke:         'lightsteelblue',
        strokeWidth:    ellipseStrokeWidth
    };

    ellipseRadii = {
        vertex:         15,             //15
        handle:         8              //8
    };

    handles = {
        handle1: {
            stroke:         'lightpink',
            strokeWidth:    1
        },
        handle2: {
            stroke:         'tan',
            strokeWidth:    1
        }
    };

    backgroundColour = {
        hue:            60,
        saturation:     25,
        value:          35
    };


    configData = {
        mouseOverNode,
        mouseInsideNodePoint,
        mouseClickNodePoint,
        defaultNodeStyle,
        mouseOverVertex,
        mouseOutVertex,
        mouseClickVertex,
        mouseOverHandle,
        mouseOutHandle,
        mouseClickHandle,
        ellipseRadii,
        handles,
        backgroundColour
    }

    config = new Config(configData);
    return config;
}
