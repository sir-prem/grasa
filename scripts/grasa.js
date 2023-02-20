var shapesLibrary;
var load;
var cp;
var sliderUI;
var newShape;

function setup() {
    frameRate(10);
	colorMode(HSB, 100);
	setUpCanvas();
    config = setupConfig();
	setInitialModeAndAction();
    shapesLibrary = new ShapesLibrary();
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

	function setInitialModeAndAction() {
		mode = 'SCULPT';
		nextAction = 'sculpt shapeA';
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
			   console.log(`reached load data results. shapes array length is: ${shapesLibrary.shapesArray.length}`); 
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
    drawUIOverlay();
	sliderUI.updateValues();
	
	if (shapesLibrary.shapesArray.length > 0) {
        shapesLibrary.draw();
    }
	
	else if (mode === 'CREATE' && typeof newShape !== 'undefined') {
		newShape.draw();
		newShape.drawMarkUp();
	}	
}

function mouseMoved() {
    if (shapesLibrary.shapesArray.length > 0) {
        shapesLibrary.mouseOver();
    }

    // prevent default
    return false;
}

function mousePressed() {
    if (shapesLibrary.shapesArray.length > 0) {
       shapesLibrary.mousePress();
    }
	if (mode === 'CREATE' ) {
		if (nextAction === 'startPoint') {
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
		}
		else if (nextAction === 'addLine') {
			newShape.addNode( mouseX, mouseY, 'vertex', 'line');
		}
		else if (nextAction === 'addBezier') {
			newShape.addNode( mouseX, mouseY, 'vertex', 'bezier');
		}
		else if (nextAction === 'addQuad') {
			newShape.addNode (mouseX, mouseY, 'vertex', 'quad');
		}
		else if (nextAction === 'closeShape') {
			cp = g.centerPoint(newShape.gPath);
			
			newShape.addNode ( cp.x, cp.y, 'centre', 'null');
			
			newShape.closeGPath();
			shapesLibrary.add(newShape);

			mode = 'SCULPT';
			sliderUI.fill_hue_slider.value(0);
			sliderUI.fill_saturation_slider.value(50);
		}
	}
}

function mouseDragged() {
    if (shapesLibrary.shapesArray.length > 0) {
       shapesLibrary.mouseDrag();
    }     
}

function mouseReleased() {
    if (shapesLibrary.shapesArray.length > 0) {
       shapesLibrary.mouseRelease();
    }
}

function keyPressed() {
    if (key === 'c') {
        mode = 'CREATE';
        nextAction = 'startPoint';
    }
    else if (key === 'l') {
        mode = 'CREATE';
        nextAction = 'addLine';
    }
	else if (key === 'b') {
		mode = 'CREATE';
		nextAction = 'addBezier';
	}
	else if (key === 'q') {
		mode = 'CREATE';
		nextAction = 'addQuad';
	}	
    else if (key === 'x') {
        mode = 'CREATE';
        nextAction = 'closeShape';
    }
    
    else if (key === 's') {
        mode = 'SCULPT';
        nextAction = 'sculptShape';
    }
    else {
        mode = 'UNKNOWN';
        nextAction = 'unknown';
    }
}

function drawUIOverlay() {
    //draw mouse co-ords
    fill('indianred');
    textSize(14);
    text(`(${Math.trunc(mouseX)},${Math.trunc(mouseY)})`, mouseX+10, mouseY+20);
    
    // draw header/logo
    fill('ivory');
    textSize(18);
    text(`GRASA v1.0`, width-250, 30);
    textSize(10);
    text(`An abstract shape`, width-250, 45);
    text(`ideation tool`, width-250, 55);

    // draw mode and next action
    //fill('lightseagreen');
    textSize(11);
    text(`${key} - ${mode} mode`, width-250, height-50);
    text(`next action: ${nextAction}`, width-250, height-30);

	text(`FILL`, width-250, 165);
	text(`Hue`, width-250, 185);
	text(`Saturation`, width-250, 205);
	text(`Lightness`, width-250, 225);
	text(`Opacity`, width-250, 245);
	
	text(`STROKE`, width-250, 295);
	text(`Hue`, width-250, 315);
	text(`Saturation`, width-250, 335);
	text(`Lightness`, width-250, 355);
	text(`Opacity`, width-250, 375);
	text('Width', width-250, 395);

	fill_alpha_decimal = sliderUI.fill_alpha/100;

	fill_colour = color(`hsla(${sliderUI.fill_hue}, 
				${sliderUI.fill_saturation}%, 
				${sliderUI.fill_value}%, 
				${fill_alpha_decimal})`);

	stroke_alpha_decimal = sliderUI.stroke_alpha/100;

	stroke_colour = color(`hsla(${sliderUI.stroke_hue}, 
				${sliderUI.stroke_saturation}%, 
				${sliderUI.stroke_value}%, 
				${stroke_alpha_decimal})`);

	fill(fill_colour);
	stroke(stroke_colour);
	strokeWeight(sliderUI.stroke_width);
	
	rect(width-120, 100, 45, 45); // Draw rectangle
	noStroke();
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
