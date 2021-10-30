
function setup() {
    p5.disableFriendlyErrors = true; // disables FES

    let fps = 10;
    frameRate(fps);
    
    let sketchWidth = document.getElementById("grasa-div").offsetWidth;
    let sketchHeight = document.getElementById("grasa-div").offsetHeight;
    let renderer = createCanvas(sketchWidth, 700);
    renderer.parent("grasa-div");
    colorMode(HSB, 100);

    mode = 'SCULPT';
    nextAction = 'sculpt shapeA';


    shapeBez = new Shape('transparent', 'ivory', 3);
    shapeBez.addNewVertex( 100, 100, 'start');
    shapeBez.addNewVertex( 400, 400, 'bezier');

}

function draw() { 
    drawBackground();
    shapeBez.drawShape(); 
    textStuff(); 
}

function mouseMoved() {
    shapeBez.mouseOverVertex(mouseX, mouseY,
                            'goldenrod', 'indianred', 2,
                            'lightskyblue', 'lightsteelblue', 2,
                            'transparent', 'indianred', 2,
                            'transparent', 'lightsteelblue', 2);

// prevent default
return false;
}

function mousePressed() {
    if (shapeBez.isMouseOverWhichVertex(mouseX, mouseY).bool) {
        switch(shapeBez.isMouseOverWhichVertex(mouseX, mouseY).type) {
            case 'vertex':
                shapeBez.activateVertex(mouseX, mouseY, 'indianred', 'indianred', 2);
                shapeBez.updateClickedPosition(mouseX, mouseY);
            case 'handle':
                shapeBez.activateHandle(mouseX, mouseY, 'cornflowerblue', 'lightsteelblue', 2);
        }
        
    }
}

function mouseReleased() {
    // if vertex or handle was being dragged
    if (shapeBez.isDragging === true) {
        switch(shapeBez.whichVertexTypeActive()) {
            case 'vertex':
                shapeBez.dropVertexHandles(shapeBez.activeVertexIndex);  break;
            case 'handle':
                //shapeBez.dropVertexHandles(shapeBez.activeVertexIndex);  break;
        }
        shapeBez.isDragging = false;
    }
    // if mouse clicked and released on the spot (without dragging mouse)
    else {
        switch(shapeBez.whichVertexTypeActive()) {
            case 'vertex':
                shapeBez.setVertexEllipseColour( shapeBez.activeVertexIndex, 'goldenrod', 'indianred', 2); break;
            case 'handle':
                shapeBez.setHandleEllipseColour( shapeBez.activeHandleIndex, 'lightskyblue', 'lightsteelblue', 2); break;
            case 'neither':
                if (shapeBez.hasActiveHandle()) {
                    shapeBez.deactivateHandleAndVertex('transparent', 'indianred', 2,
                                                        'transparent', 'lightsteelblue', 2);
                }
                else if (shapeBez.hasActiveVertex()) {
                    shapeBez.deactivateVertex('transparent', 'indianred', 2);
                }
        }
    }
}

function mouseDragged() {
    if (shapeBez.hasActiveVertex() || shapeBez.hasActiveHandle()) {
        shapeBez.isDragging = true;
    }
    if (shapeBez.isDragging === true) {
        switch(shapeBez.whichVertexTypeActive()) {
            case 'vertex':
                shapeBez.moveOrOffsetVertex(mouseX,mouseY,true);  break;
            case 'handle':
                shapeBez.moveHandle(mouseX, mouseY);            break;
        }
        shapeBez.reconstructShape();
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
    background(60,30,90);
}
