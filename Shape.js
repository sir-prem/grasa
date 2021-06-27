class Shape {
  constructor(startVertex) {
    this.verticesArray = [];
    this.verticesArray.push(startVertex);
    this.path = new g.Path();
    this.path.moveTo(startVertex.x, startVertex.y);
  }
  
  addNewVertex(newVertex) {
    this.verticesArray.push(newVertex);
    this.path.lineTo(newVertex.x, newVertex.y);
  }
  
  drawShape(fillColour, drawingContext) {
    this.path.closePath();
    this.path.fill = fillColour;
    this.path.draw(drawingContext);
  }

  containsPoint(x, y) {
    console.log(this.path.contains(x,y));
  }
  
}

//module.exports = Shape;
