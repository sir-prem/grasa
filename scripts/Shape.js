class Shape {

  constructor(fill, stroke, strokeWidth) {
    this.verticesArray = [];
    this.fill = fill;
    this.stroke = stroke;
    this.strokeWidth = strokeWidth;
    this.path = new g.Path();
    this.path = g.colorize(this.path, fill, stroke, strokeWidth);
    this.clickedX = 0;
    this.clickedY = 0;
    this.closed = false;
  }
  
  addNewVertex(x, y, type) {

    let newVertex = new Vertex(x, y, type);

    switch(type) {
      
      case 'start':

        this.path.moveTo(newVertex.x, newVertex.y);     break;

      case 'line':

        this.path.lineTo(newVertex.x, newVertex.y);     break;

      case 'bezier':

        let newVertexHandle1 = new VertexHandle( 350, 150, 'transparent', 'lightpink', 0.5 );
        let newVertexHandle2 = new VertexHandle( 150, 350, 'transparent', 'tan', 0.5 );
        newVertex.handlesArray.push(newVertexHandle1);
        newVertex.handlesArray.push(newVertexHandle2);

        this.path.curveTo(  350, 150,   
                            150, 350,   
                            newVertex.x,  newVertex.y );  break;
    }
    
    this.verticesArray.push(newVertex);

  }

 
  
  closeShape() {
    this.path.closePath();
  }
  
  draw() {  
    this.path.draw(drawingContext);
  }

  setColour(fill, stroke, strokeWidth) {
    this.path = g.colorize(this.path, fill, stroke, strokeWidth);
  }

  // Draw circles over each vertex point for this shape
  drawVertexEllipses() {
    for (let i = 0; i < this.verticesArray.length; i++) {
      let vertexEllipse = this.verticesArray[i].vertexEllipse;
      vertexEllipse.draw();
    }
  }

  drawVertexCoordinates() {
    for (let i = 0; i < this.verticesArray.length; i++) {
      let vertex = this.verticesArray[i];
      vertex.drawCoordinates();
    }
  }

  drawVertexHandles() {
    for (let i = 0; i < this.verticesArray.length; i++) {
      let vertex = this.verticesArray[i];
      switch(vertex.type) {
        case 'bezier':
          vertex.handlesArray[0].drawHandleLine(vertex.x, vertex.y);
          vertex.handlesArray[0].drawCoordinates(0);
          vertex.handlesArray[1].drawHandleLine(vertex.x, vertex.y);
          vertex.handlesArray[1].drawCoordinates(1);
      }
    }
  }

  translateShape(x,y) {
    this.path = g.translate(this.path, {x: x, y: y});
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
      let vertex = this.verticesArray[i];
      vertex.x += dx;
      vertex.y += dy;
      vertex.vertexEllipse.translate(vertex.x,vertex.y);
    }

    //update clicked position
    this.clickedX = X;
    this.clickedY = Y;
  }

  //returns index of array pointing to which vertex the mouse is on
  mouseOnVertex(x, y) {
    for (let i = 0; i < this.verticesArray.length; i++) {
      let ellipsePath = this.getEllipsePath(i);
      if (ellipsePath.contains(x, y)) {
        return {bool: true, index: i};
      }
    }
    return {bool: false, index: -1};
  }

  //get ellipseVertex path for vertex at index 
  getEllipsePath(index) {
    let vertex = this.verticesArray[index];
    return vertex.vertexEllipse.getPath();
  }

  containsPoint(x, y) {
    return this.path.contains(x,y);
  }

  // Rebuilds shape from vertices array
  rebuildShape() {
    this.path = new g.Path();
    for (let i = 0; i < this.verticesArray.length; i++) {
      let vertex = this.verticesArray[i];
      let x = vertex.x;
      let y = vertex.y;

      if (i == 0) {
        this.path.moveTo(x, y);
      }
      else {
        this.path.lineTo(x, y);
      }
    }
    this.closeShape();
    this.setColour(this.fill, this.stroke, this.strokeWidth);
  }

  //update verticesArray with moved vertex co-ordinates
  //for the vertex at the given index
  moveVertex(x,y,index) {
      //update vertex position
      let vertex = this.verticesArray[index];
      vertex.x = x;
      vertex.y = y;
      //update vertex's ellipse position
      vertex.vertexEllipse.translate(vertex.x,vertex.y);
    // replace old vertex in verticesArray with updated one
    this.verticesArray.splice(index, 1, vertex);
  }
  
}
