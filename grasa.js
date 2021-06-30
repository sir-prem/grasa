
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
}

function draw() {  
  background(60,30,60);

  if (shapeA.containsPoint(mouseX,mouseY) || shapeA.mouseOnVertex(mouseX,mouseY).bool) {
      shapeA.drawShape(_PURPLE);    
  }
  else {
      shapeA.drawShape(_YELLOW);
  }
  shapeB.drawShape(_BLUE);
  intersectShape = new IntersectionShape(shapeA, shapeB);
  intersectShape.drawShape(_IVORY,_DARKGREY); 
  
  if (shapeA.containsPoint(mouseX,mouseY) || shapeA.mouseOnVertex(mouseX,mouseY).bool) { 
    shapeA.drawVertexEllipses(_NONE, _RED);   
  }


  textSize(14);
  fill(0, 0, 90);
  text(`(${mouseX},${mouseY})`, mouseX+10, mouseY+20);
  textSize(18);
  fill(0, 0, 100);
  text(`grasa v1.0`, width-135, 30);
  textSize(10);
  text(`An abstract shape`, width-135, 45);
  text(`ideation tool`, width-135, 55);
}

function mousePressed() {
  if (shapeA.containsPoint(mouseX,mouseY)) {
    shapeA.clickedX = mouseX;
    shapeA.clickedY = mouseY;
  }
}

function mouseDragged() {
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
