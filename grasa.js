function setup() {
  createCanvas(800, 800);
  background(220);
}


function draw() {
  noStroke();
  
  if (mouseIsPressed) {
   fill(0);
  } else {
   fill(255);
  }
  ellipse(mouseX, mouseY, 5, 5);
}
