var shapesLibrary;
var load;
var cp;
var sliderUI;
var newShape;

function setup() {
    p5.disableFriendlyErrors = true; // disables FES

    let fps = 10;
    frameRate(fps);
    
    let sketchWidth = document.getElementById("grasa-div").offsetWidth;
    let sketchHeight = document.getElementById("grasa-div").offsetHeight;
    let renderer = createCanvas(sketchWidth, 550);
    renderer.parent("grasa-div");
    colorMode(HSB, 100);

    // do config
    config = setupConfig();

    mode = 'SCULPT';
    nextAction = 'sculpt shapeA';

    shapesLibrary = new ShapesLibrary();

    //========================================================================
    //
    //      Change here for local testing or server deployment
    //
    //------------------------------------------------------------------------

    socket = io.connect('http://localhost:4000' || 'https://viridian-marked-fork.glitch.me');
    //socket = io.connect('https://viridian-marked-fork.glitch.me');


    socket.on(`load req recd`, (JSONLoadData) => {

        console.log(JSONLoadData.message);

        if (JSONLoadData.result) {

            //NOTE: here there could be a warning, before loading old data from DB,
            //      e.g. Are you sure? Any unsaved work will be lost
            
            shapesLibrary = new ShapesLibrary(JSONLoadData.shapesLibraryFromDB);
        }
        else {
            // anything here if req'd
        }
    });

    
    

    
        // create shapes from new (create mode)
        
        /*
        example of what create mode should do:
        ---------------------------------------

        shapesLibrary = new ShapesLibrary();

        shape1 = new Shape('thistle', 'lightseagreen', 6);
        shape1.addNode( 400, 150, 'start');
        shape1.addNode( 200, 350, 'line');
        shape1.addNode( 600, 350, 'line');
        shape1.closeGPath();
    
        shape2 = new Shape('steelblue', 'ivory', 3);
        shape2.addNode( 300, 100, 'start');
        shape2.addNode( 100, 400, 'bezier');
        shape2.addNode( 500, 400, 'line');
        shape2.closeGPath();
    
        shape3 = new Shape('ivory', 'mediumorchid', 1);
        shape3.addNode( 100, 100, 'start');
        shape3.addNode( 100, 300, 'bezier');
        shape3.addNode( 300, 200, 'line');
        shape3.closeGPath();
    
        shapesLibrary.add(shape1);
        shapesLibrary.add(shape2);
        shapesLibrary.add(shape3);
        */

 	// add Colour Sliders 
	sliderUI = new SliderUI();

	sliderUI.createFillSliders();
	sliderUI.setFillSliderPositions(width-165, 220, 20);
	sliderUI.setFillSliderStyles(100);
	
	sliderUI.createStrokeSliders();
	sliderUI.setStrokeSliderPositions(width-165, 350, 20);
	sliderUI.setStrokeSliderStyles(100);
	
}

function draw() { 
	clear();
	drawBackground();
    drawUIOverlay();

	sliderUI.updateValues();
	
	if (shapesLibrary.shapesArray.length > 0) {
        shapesLibrary.draw();
    }
	
	if (typeof newShape !== 'undefined') {
		newShape.draw();
		newShape.drawMarkUp();
	}	

	if (typeof cp !== 'undefined') {
		circle(cp.x, cp.y, 20);
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
	if (mode == 'CREATE' ) {
		if (nextAction == 'startPoint') {
			new_shape_fill_colour = g.hslColor(
										sliderUI.fill_hue/360,
										sliderUI.fill_saturation/100, 
										sliderUI.fill_value/100, 
										sliderUI.fill_alpha/100);

			new_shape_stroke_colour = g.hslColor(
										sliderUI.stroke_hue/360,
										sliderUI.stroke_saturation/100, 
										sliderUI.stroke_value/100, 
										sliderUI.stroke_alpha/100);


			newShape = new Shape(	new_shape_fill_colour, 
									new_shape_stroke_colour,
									sliderUI.stroke_width);	

			newShape.addNode(mouseX, mouseY, 'start');
		}
		else if (nextAction == 'addLine') {
			newShape.addNode( mouseX, mouseY, 'line');
		}
		else if (nextAction === 'addBezier') {
			newShape.addNode( mouseX, mouseY, 'bezier');
		}
		else if (nextAction === 'addQuad') {
			newShape.addNode (mouseX, mouseY, 'quad');
		}
		else if (nextAction == 'closeShape') {

			cp = g.centerPoint(newShape.gPath);
			//console.log(`center point is: ${cp}`);
			///console.log(`center point X is: ${cp.x}`);
			//console.log(`center point Y is: ${cp.y}`);
			
			newShape.addNode ( cp.x, cp.y, 'centre');
			
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

    mouseInsideChildNode = {
        fill:           'lightsteelblue',
        stroke:         'lightsteelblue',
        strokeWidth:    ellipseStrokeWidth
    };

    mouseClickChildNode = {
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
        mouseInsideChildNode,
        mouseClickChildNode,
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
