
function setup() {
  let sketchWidth = document.getElementById("grasa-div").offsetWidth;
  let sketchHeight = document.getElementById("grasa-div").offsetHeight;
  let renderer = createCanvas(sketchWidth, 700);
  renderer.parent("grasa-div");
  colorMode(HSB, 100);

  mode = 'SCULPT';
  nextAction = 'sculpt shapeA';


  shapeBez = new Shape('transparent', 'ivory', 5);
  shapeBez.addNewVertex( 100, 100, 'start');
  shapeBez.addNewVertex( 400, 400, 'bezier');

}

function draw() { 
  background(60,30,60);

  shapeBez.drawVertexEllipses();
  shapeBez.draw();
  shapeBez.drawVertexCoordinates();
  shapeBez.drawVertexHandles();
 

  //logo and mode text
  textStuff(); 
}

function mousePressed() {
}

function mouseDragged() {
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
