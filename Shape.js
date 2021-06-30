class Shape {

  constructor(startVertex) {
    this.verticesArray = [];
    this.ellipsesArray;
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
    this.initialiseEllipsesArray();
  }
  
  drawShape(fillColour) {
    this.path.fill = fillColour;
    this.path.draw(drawingContext);
  }

  initialiseEllipsesArray() {
    this.ellipsesArray = [];
    
    let ellipseWidth = 20;
    let ellipseRadius = ellipseWidth/2;
    for (let i = 0; i < this.verticesArray.length; i++) {
      let ellipsePath = new g.Path();

      ellipsePath.addEllipse(this.verticesArray[i].x-ellipseRadius, 
                              this.verticesArray[i].y-ellipseRadius, 
                              ellipseWidth, ellipseWidth);

      ellipsePath = g.colorize(ellipsePath, 'transparent', 'red', 2);                        
      this.ellipsesArray.push(ellipsePath);
    }
  }

  // Draw circles over each vertex point
  drawVertexEllipses(fill,stroke) {
    for (let i = 0; i < this.ellipsesArray.length; i++) {
      let thisEllipsePath = this.ellipsesArray[i];
      thisEllipsePath.fill = fill;
      thisEllipsePath.stroke = stroke;
      thisEllipsePath.draw(drawingContext);
    }

  }

  translateShape(X,Y) {
    this.path = g.translate(this.path, {x: X, y: Y});
  }

  translateShapeFromClickedPoint(X, Y) {
    // distance from where mouse was clicked
    // .. to it's current (dragged) position
    let dx = X - this.clickedX;
    let dy = Y - this.clickedY;

    //translate the shape
    this.translateShape(dx, dy);

    //update vertices and vertex ellipses
    for (let i = 0; i < this.verticesArray.length; i++) {
      this.verticesArray[i].x += dx;
      this.verticesArray[i].y += dy;
      this.ellipsesArray[i] = g.translate(this.ellipsesArray[i], {x: dx, y: dy});
    }

    //update clicked position
    this.clickedX = X;
    this.clickedY = Y;
  }

  //returns index of array pointing to which vertex the mouse is on
  mouseOnVertex(X, Y) {
    for (let i = 0; i < this.ellipsesArray.length; i++) {
      let ellipsePath = this.ellipsesArray[i];
      if (ellipsePath.contains(X,Y)) {
        return {bool: true, index: i};
      }
    }
    return {bool: false, index: -1};
  }

  containsPoint(x, y) {
    return this.path.contains(x,y);
  }

  // Rebuilds shape from vertices array
  rebuildShape() {
    this.path = new g.Path();
    for (let i = 0; i < this.verticesArray.length; i++) {
      let x = this.verticesArray[i].x;
      let y = this.verticesArray[i].y;

      if (i == 0) {
        this.path.moveTo(x, y);
      }
      else {
        this.path.lineTo(x, y);
      }
    }
    this.closeShape();
  }

  //update verticesArray with moved vertex co-ordinates
  //for the vertex at the given index
  moveVertex(X,Y,index) {
    // update verticesArray
    this.verticesArray.splice(index, 1, {x:X, y:Y});
  }
  
}
