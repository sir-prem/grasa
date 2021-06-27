var pathA, pathB, pathE, r;

var shapeA;

function setup() {
  createCanvas(1300, 450);
  background(220);
 /* 
  pathA = new g.Path();
  
  pathA.moveTo(20, 20);
  pathA.lineTo(80, 20);
  pathA.lineTo(100, 80);
  pathA.lineTo(60, 80);
  pathA.lineTo(40, 120);
  pathA.closePath();
  pathA.fill = 'yellow';
  //pathA.draw(drawingContext);
  */
  shapeA = new Shape({ x: 300, y: 300 });
  shapeA.addNewVertex({ x: 360, y: 300 });
  shapeA.addNewVertex({ x: 400, y: 420 });
  shapeA.addNewVertex({ x: 270, y: 420 });
  shapeA.drawShape('yellow', drawingContext);
  
  
  
/*
  pathB = new g.Path();
  pathB.moveTo(40, 40);
  pathB.lineTo(100, 40);
  pathB.lineTo(140, 60);
  pathB.lineTo(10, 60);
  pathB.closePath();
  pathB.fill = 'orange';
  
  r = g.rect({x: 100, y: 100}, 50, 50);
  */
}


function draw() {
  shapeA.containsPoint(mouseX,mouseY);
  /*
  pathA.draw(drawingContext);
  r.draw(drawingContext);
  
  
  pathB.draw(drawingContext);
  
  pathE = g.compound(pathA, pathB, 'intersection');
  pathE.fill = 'white';
  pathE.stroke = 'black';
  pathE.draw(drawingContext);
  
  */
  
}

function mousePressed() {
  /*
    clear();
    background(220);
    console.log("mouse is pressed");
    pathA = g.translate(pathA, {x: 2, y: 2});
    r = g.translate(r, {x: 4, y: 4});
    */
  }
