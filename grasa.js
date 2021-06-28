function setup() {
  createCanvas(800, 600);
  
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
  background(220);

  if (shapeA.containsPoint(mouseX,mouseY)) {
      shapeA.drawShape('red');    
  }
  else {
      shapeA.drawShape('yellow');
  }
  shapeB.drawShape('orange');
  intersectShape = new IntersectionShape(shapeA, shapeB);
  intersectShape.drawShape('white','black'); 

  textSize(14);
  fill(0, 180, 180);
  text(`(${mouseX},${mouseY})`, mouseX+10, mouseY+20);
}

function mousePressed() {
  if (shapeA.containsPoint(mouseX,mouseY)) {
    shapeA.clickedX = mouseX;
    shapeA.clickedY = mouseY;
  }
}

function mouseDragged() {
  if (shapeA.containsPoint(mouseX,mouseY)) {
    shapeA.translateShapeFromClicked(mouseX,mouseY);
  }
}

