var shapesLibrary;
var load;
var shape1, shape2, shape3;

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

}

function draw() { 
    drawBackground();
    drawUIOverlay();
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
    if (shapesLibrary.shapesArray.length > 0) {
       shapesLibrary.mousePress();
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
    text(`grasa v1.0`, width-135, 30);
    textSize(10);
    text(`An abstract shape`, width-135, 45);
    text(`ideation tool`, width-135, 55);

    // draw mode and next action
    fill('lightseagreen');
    textSize(11);
    text(`${key} - ${mode} mode`, width-180, 130);
    text(`next action: ${nextAction}`, width-180, 145);
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