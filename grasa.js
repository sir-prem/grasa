
function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 100);
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

  mode = 'SCULPT';
  nextAction = 'sculpt shapeA';
  
  shapeA = new Shape({ x: 300, y: 300 });
  shapeA.addNewVertex({ x: 360, y: 300 });
  shapeA.addNewVertex({ x: 400, y: 420 });
  shapeA.addNewVertex({ x: 270, y: 420 });
  shapeA.closeShape();
  
  shapeB = new Shape({ x: 200, y: 300 });
  shapeB.addNewVertex({ x: 335, y: 250 });
  shapeB.addNewVertex({ x: 320, y: 375 });
  shapeB.addNewVertex({ x: 250, y: 350 });
  shapeB.closeShape();

  shapeC = new Shape({ x: 50, y: 150 });
  shapeC.addNewVertex({ x: 185, y: 100 });
  shapeC.addNewVertex({ x: 170, y: 225 });
  shapeC.path.curveTo(90, 250, 150, 180, 115, 180);
  shapeC.path.quadTo(60, 200, 80, 250);
  shapeC.addNewVertex({ x: 50, y: 200 });
  shapeC.closeShape();
 
}



function draw() { 
  background(60,30,60);
  
  //////////////////////////
  //
  //  DRAW: SCULPT MODE
  //
  //////////////////////////
  if (mode === 'SCULPT') {
    
    if (shapeA.containsPoint(mouseX,mouseY) || shapeA.mouseOnVertex(mouseX,mouseY).bool) {
        shapeA.drawShape(_PURPLE,_IVORY);    
    }
    else {
        shapeA.drawShape(_YELLOW,_IVORY);
    }
    shapeB.drawShape(_BLUE,_IVORY);
    intersectShape = new IntersectionShape(shapeA, shapeB);
    intersectShape.drawShape(_IVORY,_DARKGREY); 
    
    if (shapeA.containsPoint(mouseX,mouseY) || shapeA.mouseOnVertex(mouseX,mouseY).bool) { 
      shapeA.drawVertexEllipses('transparent', 'red');   
    }
  }
  //////////////////////////
  //
  //  DRAW: CREATE MODE
  //
  //////////////////////////
  else if (mode === 'CREATE') {
    if (typeof newShape !== 'undefined') {
      newShape.drawShape('transparent',_IVORY);
      newShape.drawVertexEllipses('transparent', 'red');
    }


  }

  //logo and mode text
  textStuff();
  
}

function mousePressed() {
  if (mode === 'SCULPT') {
    if (shapeA.containsPoint(mouseX,mouseY) || shapeA.mouseOnVertex(mouseX,mouseY).bool) {
      shapeA.clickedX = mouseX;
      shapeA.clickedY = mouseY;
    }
  }
  //////////////////////////
  //
  //  MOUSE-PRESSED: CREATE MODE
  //
  //////////////////////////
  else if (mode === 'CREATE') {
    if (nextAction === 'startPoint') {
      newShape = new Shape({ x: mouseX, y: mouseY });
      nextAction = 'addLine'; //default next action to adding lines
    }
    else if (nextAction === 'addLine') {
      newShape.addNewVertex({ x: mouseX, y: mouseY });
    }
    newShape.addNewEllipse({ x: mouseX, y: mouseY });
    console.log(`ellipsesArray.length is: ${newShape.ellipsesArray.length}`);
    
  }
}

function mouseDragged() {
  if (mode === 'SCULPT') {
    if (shapeA.containsPoint(mouseX,mouseY) || shapeA.mouseOnVertex(mouseX,mouseY).bool) {  
      if (shapeA.mouseOnVertex(mouseX,mouseY).bool) {
        shapeA.moveVertex(mouseX,mouseY, shapeA.mouseOnVertex(mouseX,mouseY).index);
        shapeA.rebuildShape();
      }
      else {
        shapeA.translateShapeFromClickedPoint(mouseX,mouseY);
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
  
  else {
    mode = 'SCULPT';
    nextAction = 'sculptShape';
  }
}


function textStuff() {
  textSize(14);
  fill(0, 0, 90);
  text(`(${mouseX},${mouseY})`, mouseX+10, mouseY+20);
  textSize(14);
  fill(0, 0, 90);
  text(`(${mouseX},${mouseY})`, mouseX+10, mouseY+20);
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
