class Cone {

  // Constructor
  constructor() {
    this.type = 'cone';
    //this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    //this.size = 5.0;
    //this.segments = 10;
    this.matrix = new Matrix4();
  }

  // Render this shape
  render() {
    //var xy = this.position;
    var rgba = this.color;
    //var size = this.size;


    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Pass the matrix to u_ModelMatrix atttribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // Front of cone
    drawTriangle3D( [0.0,0.0,0.0,   1.0,0.0,0.0,   0.5,1.0,0.5]);

    // Left of cone
    drawTriangle3D( [0,0,0,   .5,0,1,   .5,1,.5]);

    // Right of cone
    drawTriangle3D( [1,0,0,   .5,0,1,   .5,1,.5]);

    // Base of cone
    drawTriangle3D( [0,0,0,   1,0,0,   .5,0,1]);


    // Pass the color of a point to u_FragColor uniform variable
    gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*9, rgba[3]);

  }
}
