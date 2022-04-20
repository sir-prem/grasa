
function setup() {
    p5.disableFriendlyErrors = true; // disables FES

    let fps = 10;
    frameRate(fps);
    
    let sketchWidth = document.getElementById("grasa-div").offsetWidth;
    let sketchHeight = document.getElementById("grasa-div").offsetHeight;
    let renderer = createCanvas(sketchWidth, 700);
    renderer.parent("grasa-div");
    colorMode(HSB, 100);

    // do config
    config = setupConfig();



    mode = 'SCULPT';
    nextAction = 'sculpt shapeA';


    shapeBez = new Shape('steelblue', 'ivory', 3);
    shapeBez.addNewVertex( 100, 100, 'start');
    shapeBez.addNewVertex( 400, 400, 'bezier');
    shapeBez.addNewVertex( 550, 250, 'quad');
    shapeBez.addNewVertex( 130, 70, 'quad');
    shapeBez.closeShape();

}

function draw() { 
    drawBackground();
    shapeBez.drawShape(); 
    textStuff(); 
}

function mouseMoved() {
    shapeBez.mouseOverVertex(mouseX, mouseY);

    // prevent default
    return false;
}

function mousePressed() {
    console.log(`mouse pressed`);
    shapeBez.mousePressOnNode(mouseX, mouseY);
}

function mouseReleased() {
    shapeBez.mouseReleasedOnNode();
}

function mouseDragged() {
    shapeBez.mouseDraggingNode(mouseX, mouseY);
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
        vertex:         15,
        handle:         8
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