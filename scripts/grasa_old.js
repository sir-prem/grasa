
function setup() {
  let sketchWidth = document.getElementById("grasa-div").offsetWidth;
  let sketchHeight = document.getElementById("grasa-div").offsetHeight;
  let renderer = createCanvas(sketchWidth, 700);
  renderer.parent("grasa-div");
  colorMode(HSB, 100);

  mode = 'SCULPT';
  nextAction = 'sculpt shapeA';

  
  
  shapeB = new Shape('powderblue', 'ivory', 1);
  shapeB.addNewVertex(200, 300, 'start');
  shapeB.addNewVertex(335, 250, 'line');
  shapeB.addNewVertex(320, 375, 'line');
  shapeB.addNewVertex(250, 350, 'line');
  shapeB.closeShape();


  shapeC = new Shape('powderblue', 'ivory', 1);
  shapeC.addNewVertex({ x: 50, y: 150 }, 'start');
  shapeC.addNewVertex({ x: 185, y: 100 }, 'line');
  shapeC.addNewVertex({ x: 170, y: 225 }, 'line');
  shapeC.path.curveTo(90, 250, 150, 180, 115, 180);
  shapeC.path.quadTo(60, 200, 80, 250);
  shapeC.addNewVertex({ x: 50, y: 200 }, 'line');
  shapeC.closeShape() 

}

function draw() { 
  background(60,30,60);
  
  if (mode === 'SCULPT') { 
    sculptDraw();
  }
  
  else if (mode === 'CREATE') {
    createShape();
  }

  //logo and mode text
  textStuff(); 
}

function mousePressed() {
  //////////////////////////
  //
  //  MOUSE-PRESSED: SCULPT MODE
  //
  //////////////////////////
  if (mode === 'SCULPT') {
    if (typeof newShape !== 'undefined') {
      if (newShape.closed) {
        if ( newShape.mouseOnVertex(mouseX,mouseY).bool || newShape.containsPoint(mouseX,mouseY) ) { 
          if (newShape.mouseOnVertex(mouseX,mouseY).bool) {
            console.log(`mouseClicked: YES on vertex`);
          }
          else {
            console.log(`mouseClicked: YES in shape`);
          }
          newShape.clickedX = mouseX;
          newShape.clickedY = mouseY;
        }
      }
    }
  }
  //////////////////////////
  //
  //  MOUSE-PRESSED: CREATE MODE
  //
  //////////////////////////
  else if (mode === 'CREATE') {
    if (nextAction === 'startPoint') {
      newShape = new Shape( 'transparent', 'ivory', 1);
      newShape.addNewVertex(mouseX, mouseY, 'start');
      nextAction = 'addLine'; //default next action to adding lines
    }
    else if (nextAction === 'addLine') {
      newShape.addNewVertex(mouseX, mouseY, 'line');
    }
    else if (nextAction === 'closeShape') {
      newShape.closeShape();
      newShape.closed = true;
    }
    console.log(`verticesArray.length is: ${newShape.verticesArray.length}`);
  }
}

function mouseDragged() {
  if (mode === 'SCULPT') {
    if (typeof newShape !== 'undefined') {
      if (newShape.closed) {
        // instead do ... if newShape.vertexBeingDragged 
        // where vertexBeingDragged is bool
        // and whichVertexBeingDragged = index (of vertices array)
        if ( newShape.mouseOnVertex(mouseX,mouseY).bool || newShape.containsPoint(mouseX,mouseY) ) {
          if (newShape.mouseOnVertex(mouseX,mouseY).bool) {
            newShape.moveVertex(mouseX,mouseY, newShape.mouseOnVertex(mouseX,mouseY).index);
            newShape.rebuildShape();
          }
          else {
            newShape.translateShapeFromClickedPoint(mouseX,mouseY);
          }
        }
      }
    }
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


//////////////////////////
  //
  //  DRAW: SCULPT MODE
  //
  //////////////////////////
function sculptDraw() {

  shapeB.draw();
  shapeC.draw();

  if (typeof newShape !== 'undefined') {
    if (newShape.closed) {

      if ( newShape.mouseOnVertex(mouseX,mouseY).bool || newShape.containsPoint(mouseX,mouseY) ) {
          newShape.setColour('moccasin','ivory',1);
      }
      else {
          newShape.setColour('lightyellow','ivory',1);
      }
      newShape.draw();

      intersectShape = new IntersectionShape(newShape, shapeB, 'ivory', 'slateblue', 1);
      intersectShape.draw();

      intersectShape2 = new IntersectionShape(newShape, shapeC, 'ivory', 'slateblue', 1);
      intersectShape2.draw();
    }
    
    if ( newShape.mouseOnVertex(mouseX,mouseY).bool || newShape.containsPoint(mouseX,mouseY) ) { 
      newShape.drawVertexEllipses();   
    }
    
  }
}

//////////////////////////
  //
  //  DRAW: CREATE MODE
  //
  //////////////////////////
function createShape() {
  if (typeof newShape !== 'undefined') {
    newShape.draw();
    newShape.drawVertexEllipses();
  }
}


/*
  _RED = `hsl(0, 100%, 65%)`;
  _ORANGE = `hsl(30, 80%, 60%)`;
  _YELLOW = `hsl(60, 85%, 50%)`;
  _GREEN = `hsl(120, 60%, 50%)`;
  _TEAL = `hsl(165, 100%, 40%)`;
  _BLUE = `hsl(204, 100%, 50%)`;
  _PURPLE = `hsl(280, 100%, 70%)`;
  _SLATE = `hsl(240, 20%, 50%)`;
  _WHITE = `hsl(0, 0%, 100%)`;
  _DARKGREY = `hsl(0, 0%, 25%)`;
  _IVORY = `hsl(60, 30%, 95%)`;
  _NONE = `hsla(0, 0%, 0%, 0.0)`;

  shapeA = new Shape({ x: 300, y: 300 });
  shapeA.addNewVertex({ x: 360, y: 300 }, 'line');
  shapeA.addNewVertex({ x: 400, y: 420 }, 'line');
  shapeA.addNewVertex({ x: 270, y: 420 }, 'line');
  shapeA.closeShape();

  shapeC = new Shape(
    { x: 50, y: 150 });
  shapeC.addNewVertex({ x: 185, y: 100 }, 'line');
  shapeC.addNewVertex({ x: 170, y: 225 }, 'line');
  shapeC.path.curveTo(90, 250, 150, 180, 115, 180);
  shapeC.path.quadTo(60, 200, 80, 250);
  shapeC.addNewVertex({ x: 50, y: 200 }, 'line');
  shapeC.closeShape() 
  */