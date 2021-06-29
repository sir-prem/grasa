class Shape {
  constructor(startVertex) {
    this.verticesArray = [];
    this.ellipsesArray = [];
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

    console.log(`vertices are: `);
    for (let i = 0; i < this.verticesArray.length; i++) {
      console.log(`(${this.verticesArray[i].x}, ${this.verticesArray[i].y})`);
    }

    this.initialiseEllipsesArray();
  }
  
  drawShape(fillColour) {
    this.path.fill = fillColour;
    this.path.draw(drawingContext);
    
    
  }

  initialiseEllipsesArray() {
    console.log(`length of ellipsesArray BEFORE: ${this.ellipsesArray.length}`);
    for (let i = 0; i < this.verticesArray.length; i++) {
      let ellipsePath = new g.Path();
      ellipsePath.addEllipse(this.verticesArray[i].x-7.5, this.verticesArray[i].y-7.5, 15, 15);
      this.ellipsesArray.push(ellipsePath);
    }
    console.log(`length of ellipsesArray AFTER: ${this.ellipsesArray.length}`);
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
        console.log(`mouse is on vertex ${i+1}`);
      }
    }
  }

  containsPoint(x, y) {
    return this.path.contains(x,y);
  }
  
}
