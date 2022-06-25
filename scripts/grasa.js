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

    //========================================================================
    //
    //      Change here for local testing or server deployment
    //
    //------------------------------------------------------------------------

    socket = io.connect('http://localhost:4000');
    //socket = io.connect('https://boiling-river-33690.herokuapp.com');
    
    load = false;

    socket.on(`load req recd`, (JSONLoadData) => {

        console.log(JSONLoadData.message);

        if (JSONLoadData.result) {

            load = true;
            
            shapesLibrary = new ShapesLibrary(JSONLoadData.shapesLibraryFromDB);
            shape1 = shapesLibrary.shapesArray[0];
            shape1.recreateGPath();
            shape2 = shapesLibrary.shapesArray[1];
            shape2.recreateGPath();
            shape3 = shapesLibrary.shapesArray[2];
            shape3.recreateGPath();
            console.log(`JSONLoadData shapesArray length is: ${shapesLibrary.shapesArray.length}`);
            console.log(`first shape's vertex is at:
                                     (${shape1.nodesArray[0].vertex.x},${shape1.nodesArray[0].vertex.y}`);
        }
        else {
            // anything here if req'd
        }
    });

    
    

    if (load) {
        // this if .. else clause may no longer be needed

        console.log(`if load clause: shapesArray length is ${shapesLibrary.shapesArray.length}`);
        
    }
    else {
        // use test shapes
        // SHOULD BE - create shapes from new (create mode)
        /*

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
}

function draw() { 
    if (load) {
        //clear();
        drawBackground();
        //console.log(`DRAW() function: first shape's vertex is at:
        //                         (${shape1.nodesArray[0].vertex.x},${shape1.nodesArray[0].vertex.y}`);
        shape1.draw(); 
        shape2.draw(); 
        shape3.draw();
        intersectShape = new IntersectionShape(shape1, shape2, 'moccasin','ivory', 1);
        intersectShape.draw();
        shape1.drawMarkUp(); 
        shape2.drawMarkUp();
        shape3.drawMarkUp();
        textStuff();
    }
    else {

        drawBackground();
        /*
        shape1.draw(); 
        shape2.draw(); 
        shape3.draw();
        intersectShape = new IntersectionShape(shape1, shape2, 'moccasin','ivory', 1);
        intersectShape.draw();
        shape1.drawMarkUp(); 
        shape2.drawMarkUp();
        shape3.drawMarkUp();
        */
        textStuff(); 
    }
}

function mouseMoved() {
    //shape1.mouseOver();
    //shape2.mouseOver();
    if (load) {

        shapesLibrary.mouseOver();
    }

    // prevent default
    return false;
}

function mousePressed() {
    if (load) {
        //console.log(`mouse pressed`);
        shape1.mousePress(mouseX, mouseY);
        shape2.mousePress(mouseX, mouseY);
        shape3.mousePress(mouseX, mouseY);
    }
}

function mouseDragged() {
    if (load) {
    
        //console.log(`mouse dragged`);
        shape1.mouseDrag(mouseX, mouseY);
        shape2.mouseDrag(mouseX, mouseY);
        shape3.mouseDrag(mouseX, mouseY);
    }
}

function mouseReleased() {
    if (load) {
        //console.log(`mouse released`);
        shape1.mouseRelease();
        shape2.mouseRelease();
        shape3.mouseRelease();
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
    
    else {
        mode = 'SCULPT';
        nextAction = 'sculptShape';
    }
}

function textStuff() {
    textSize(14);
    fill(0, 0, 90);
    text(`(${Math.trunc(mouseX)},${Math.trunc(mouseY)})`, mouseX+10, mouseY+20);
    
    textSize(18);
    fill(0, 0, 100);
    text(`grasa v1.0`, width-135, 30);
    textSize(10);
    text(`An abstract shape`, width-135, 45);
    text(`ideation tool`, width-135, 55);

    fill(45, 90, 100);
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