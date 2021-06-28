class Shape {
  constructor(startVertex) {
    this.verticesArray = [];
    this.verticesArray.push(startVertex);
    this.path = new g.Path();
    this.path.moveTo(startVertex.x, startVertex.y);
    this.clickedX = 0;
    this.clickedY = 0;
  }
  
  addNewVertex(newVertex) {
    this.verticesArray.push(newVertex);
    this.path.lineTo(newVertex.x, newVertex.y);
  }
  
  closeShape() {
    this.path.closePath();
  }
  
  drawShape(fillColour) {
    this.path.fill = fillColour;
    this.path.draw(drawingContext);
  }

  translateShape(X,Y) {
    this.path = g.translate(this.path, {x: X, y: Y});
  }

  translateShapeFromClicked(X, Y) {
    this.path = g.translate(this.path, {x: X-this.clickedX, y: Y-this.clickedY});
    this.clickedX = X;
    this.clickedY = Y;
  }

  containsPoint(x, y) {
    return this.path.contains(x,y);
  }
  
}
