var shapesLibrary;
var load;
var shape1, shape2, shape3;
var global_fill_hue, global_fill_saturation, global_fill_value;
var global_stroke_hue, global_stroke_saturation, global_stroke_value;
var global_stroke_width;
var fill_hue_slider, fill_saturation_slider, fill_value_slider, fill_alpha_slider;
var stroke_hue_slider, stroke_saturation_slider, stroke_value_slider;
var stroke_width_slider;

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

    socket = io.connect('http://localhost:4000');
    //socket = io.connect('https://boiling-river-33690.herokuapp.com');


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

	global_fill_hue = 0;

	//draw sliders
	fill_hue_slider = 			createSlider(0, 100, global_fill_hue, 1);
	fill_saturation_slider = 	createSlider(0, 100, global_fill_saturation, 1);
	fill_value_slider = 		createSlider(0, 100, global_fill_value, 1);
	fill_alpha_slider =			createSlider(0, 100, global_fill_alpha, 1);

  	fill_hue_slider.position(width-200, 220);
  	

	fill_hue_slider.style('width', '100px');


}

function draw() { 
	clear();
		drawBackground();
    drawUIOverlay();

	global_fill_hue = slider.value();

        if (shapesLibrary.shapesArray.length > 0) {
        shapesLibrary.draw();
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
	let new_shape_fill_hue;
    if (shapesLibrary.shapesArray.length > 0) {
       shapesLibrary.mousePress();
    }
	if (mode == 'CREATE' ) {
		if (nextAction == 'startPoint') {
			console.log(`global fill hue is: ${global_fill_hue}`);
			new_shape_fill_hue = g.hslColor(global_fill_hue/100, 0.5, 0.8, 0.5);
			newShape = new Shape(new_shape_fill_hue, 'indianred',2);	
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
			newShape.closeGPath();
			shapesLibrary.add(newShape);
			mode = 'SCULPT';
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
    fill('lightseagreen');
    textSize(11);
    text(`${key} - ${mode} mode`, width-250, 130);
    text(`next action: ${nextAction}`, width-250, 145);

	text(`FILL COLOUR`, width-250, 170);
	text(`Hue`, width-250, 185);
	c = color(`hsla(${global_fill_hue}, 50%, 50%, 1)`);
	fill(c);
	rect(width-50, 165, 35, 35); // Draw rectangle
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
