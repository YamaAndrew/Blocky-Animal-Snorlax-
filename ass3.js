var VERTEX_SHADER = `
precision mediump float;
attribute vec4 a_Position;
attribute vec2 a_UV;
varying vec2 v_UV;
uniform mat4 u_ModelMatrix;
uniform mat4 u_GlobalRotateMatrix1;
uniform mat4 u_GlobalRotateMatrix2;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjectionMatrix;
void main() {
  gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix1 * u_GlobalRotateMatrix2 * u_ModelMatrix * a_Position;
  v_UV = a_UV;
} `

var FRAGMENT_SHADER = `
precision mediump float;
varying vec2 v_UV;
uniform vec4 u_FragColor;
uniform sampler2D u_Sampler0;
uniform sampler2D u_Sampler1;
uniform int u_whichTexture;
void main() {

  if (u_whichTexture == -2) {
    gl_FragColor = u_FragColor;                 // Use color

  } else if (u_whichTexture == -1) {            // Use UV debug color
    gl_FragColor = vec4(v_UV,1.0,1.0);

  } else if (u_whichTexture == 0) {             // Use textures
    gl_FragColor = texture2D(u_Sampler0, v_UV);

  } else if (u_whichTexture == 1) {
    gl_FragColor = texture2D(u_Sampler1, v_UV);

  } else {                                      // Error, put redish color
    gl_FragColor = vec4(1,.2,.2,1);
  }

} `

let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix1;
let u_GlobalRotateMatrix2;
let u_Sampler0;
let u_Sampler1;
let u_whichTexture;

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);

}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VERTEX_SHADER, FRAGMENT_SHADER)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // // Get the storage location of a_UV
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  // // Get the storage location of u_GlobalRotateMatrix1
  u_GlobalRotateMatrix1 = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix1');
  if (!u_GlobalRotateMatrix1) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix1');
    return;
  }

  // // Get the storage location of u_GlobalRotateMatrix2
  u_GlobalRotateMatrix2 = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix2');
  if (!u_GlobalRotateMatrix2) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix2');
    return;
  }

  // // Get the storage location of u_ViewMatrix
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  // // Get the storage location of u_ProjectionMatrix
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  // Get the storage location of u_Sampler0
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }

  // Get the storage location of u_Sampler1
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }

  // Get the storage location of u_whichTexture
  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return false;
  }

  // Set an initial value for this matrix to identify
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);


}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Globals related to UI elements
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_globalAngle1 = 0;
let g_globalAngle2 = 0;
let g_yellowAngle = 0;
let g_magentaAngle = 0;
let g_yellowAnimation = false;
let g_magentaAnimation = false;
let g_leftArmAngle = 0;
let g_rightArmAngle = 0;
let g_headAngle = 0;
let g_reachAnimation = false;
let g_clawAngle = 0;
let g_clawAnimation = false;
let g_leftFootAngle = 0;
let g_rightFootAngle = 0;
let g_tantrumAnimation = false;
let g_headAngle2 = 0;


function addActionsForHtmlUI() {

  //document.getElementById('clear').onclick = function () { g_shapesList = []; renderAllShapes();};


  // Size Slider Events
  //document.getElementById('size').addEventListener('mouseup', function() { g_selectedSize = this.value; });
  document.getElementById('angleSlide1').addEventListener('mousemove', function() { g_globalAngle1 = this.value; renderAllShapes(); });
  document.getElementById('angleSlide2').addEventListener('mousemove', function() { g_globalAngle2 = this.value; renderAllShapes(); });



}

function initTextures() {

  var image = new Image();  // Create the image object
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image.onload = function(){ loadTexture0(image); };
  //image.crossOrigin = "anonymous";
  // Tell the browser to load an image
  image.src = 'forest.jpeg';

  var image2 = new Image();  // Create the image object
  if (!image2) {
    console.log('Failed to create the image2 object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image2.onload = function(){ loadTexture1(image2); };
  //image.crossOrigin = "anonymous";
  // Tell the browser to load an image
  image2.src = 'grass.jpeg';


  return true;
}


function loadTexture0(image) {

  var texture0 = gl.createTexture();   // Create a texture object
  if (!texture0) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture0);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler0, 0);

  //gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
  console.log("finished loadTexture0");
}

function loadTexture1(image2) {

  var texture1 = gl.createTexture();   // Create a texture object
  if (!texture1) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE1);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture1);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image2);

  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler1, 1);

  //gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
  console.log("finished loadTexture1");
}

function main() {

  // Set up canvas and get gl variables
  setupWebGL();

  // Set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();

  // Set up actions for the HTML UI elements
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  //canvas.onmousedown = click;

  canvas.onmousedown = click;
  canvas.onmousemove = function (ev) {if(ev.buttons == 1) { click(ev) } };
  document.onkeydown = keydown;

  initTextures();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Render
  //gl.clear(gl.COLOR_BUFFER_BIT);
  //renderAllShapes();
  requestAnimationFrame(tick);
}

function click(ev) {
  if(ev.shiftKey && !g_tantrumAnimation){
    g_tantrumAnimation = true;
    return;
  } else if(ev.shiftKey && g_tantrumAnimation){
    g_tantrumAnimation = false;
    return;
  }

  [x,y,z] = convertCoordinatesEventToGL(ev);
  g_globalAngle1 = x * -100;
  g_globalAngle2 = y * 100;
  g_globalAngle3 = z * -100;
  renderAllShapes();
}

function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return ([x,y]);
}


var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;

function tick() {
  // Save the current time
  g_seconds = performance.now()/1000.0 - g_startTime;
  //console.log(g_seconds);

  // Update Animation Angles
  updateAnimationAngles();

  // Draw everthing
  renderAllShapes();

  // Tell the browser to update again when it has time
  requestAnimationFrame(tick);
}

// Update the angles of everything if currently animated
function updateAnimationAngles() {
  //if (g_yellowAnimation) {
  //  g_yellowAngle = (45*Math.sin(g_seconds));
  //}
  //if (g_magentaAnimation) {
  //  g_magentaAngle = (45*Math.sin(3*g_seconds));
  //}

  if (g_reachAnimation) {
    g_leftArmAngle = (Math.abs(90*Math.sin(g_seconds)));
    g_rightArmAngle = (Math.abs(90*Math.sin(g_seconds)));
    g_headAngle = (Math.abs(45*Math.sin(g_seconds)));
    g_leftFootAngle = (Math.abs(45*Math.sin(g_seconds)));
    g_rightFootAngle = (Math.abs(45*Math.sin(g_seconds)));
  }

  if (g_clawAnimation) {
    g_clawAngle = (Math.abs(90*Math.sin(g_seconds)));
  }

  if (g_tantrumAnimation) {
    g_leftArmAngle = 45*Math.sin(7*g_seconds);
    g_rightArmAngle = -g_leftArmAngle;
    g_headAngle2 = (10*Math.sin(5*g_seconds));
    g_leftFootAngle = (Math.abs(60*Math.cos(5*g_seconds)));
    g_rightFootAngle = (Math.abs(60*Math.sin(5*g_seconds)));
  }

}

//let g_camera = new Camera();

function keydown(ev) {

  if (ev.keyCode==68) { // A key (move left)
    g_eye[0] += 0.2;
    g_at[0] -= 0.2;

    //g_camera.left();
  } else
  if (ev.keyCode==65) { // D key (move right)
    g_eye[0] -= 0.2;
    g_at[0] += 0.2;

    //g_camera.right();
  } else
  if (ev.keyCode==87) { // W key (move forward
    g_eye[2] -= 0.2;
    g_at[2] -= 0.2;

    //g_camera.forward();
  } else
  if (ev.keyCode==83) { // S key (move backward)
    g_eye[2] += 0.2;
    g_at[2] += 0.2;

    //g_camera.backward();
  } else
  if (ev.keyCode==81) { // Q key (turn left)

    //g_camera.turnLeft();
  } else
  if (ev.keyCode==69) { // E key (turn right)

    //g_camera.turnRight();
  }

  //console.log(g_camera);

  renderAllShapes();
  console.log(ev.keyCode);
}

var g_eye = [0,0,3];
var g_at = [-0,0,-100];
var g_up = [0,1,0];

//var g_camera = new Camera();

//g_camera.eye = new Vector3([0, 0, 3]);
//g_camera.at = new Vector3([0, 0, -100]);
//g_camera.up = new Vector3([0, 1, 0]);

//var g_map = [
//  [1, 1, 1, 1, 1, 1, 1, 1],
//  [1, 0, 0, 0, 0, 0, 0, 1],
//  [1, 0, 0, 0, 0, 0, 0, 1],
//  [1, 0, 0, 1, 1, 0, 0, 1],
//  [1, 0, 0, 0, 0, 0, 0, 1],
//  [1, 0, 0, 0, 0, 0, 0, 1],
//  [1, 0, 0, 0, 1, 0, 0, 1],
//  [1, 0, 0, 0, 0, 0, 0, 1],
//];

function drawMap() {
  for (x = 0; x < 8; x++) {
    for (y = 0; y < 8; y++) {
      if (x == 0 || x == 7 || y == 0 || y == 7) {
        var body = new Cube();
        body.color = [1, 1, 1, 1];
        body.matrix.translate(0, -0.75, 0);
        body.matrix.scale(0.4, 0.4, 0.4);
        body.matrix.translate(x - 4, 0, y - 4);
        body.renderFast();
      }
    }
  }
}


// Draw ever shape that is supposed to be in the canvas
function renderAllShapes() {

  // Check the time at the start of this function
  var startTime = performance.now();

  // Pass the projection matrix
  var projMat = new Matrix4();
  projMat.setPerspective(50, canvas.width/canvas.height, .1, 100)
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  // Pass the vew matrix
  var viewMat = new Matrix4();
  viewMat.setLookAt(g_eye[0], g_eye[1], g_eye[2], g_at[0], g_at[1], g_at[2], g_up[0], g_up[1], g_up[2]); // (eye, at, up)
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  var globalRotMat1 = new Matrix4().rotate(g_globalAngle1,0,1,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix1, false, globalRotMat1.elements);

  var globalRotMat2 = new Matrix4().rotate(g_globalAngle2,1,0,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix2, false, globalRotMat2.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Draw a test triangle
  //drawTriangle3D( [-1.0,0.0,0.0,   -0.5,-1.0,0.0,  0.0,0.0,0.0] );

  drawMap();


  // Draw the floor
  var floor = new Cube();
  floor.color = [1.0,0.0,0.0,1.0];
  floor.textureNum=1
  floor.matrix.translate(0, -.75, 0.0);
  floor.matrix.scale(10,0,10);
  floor.matrix.translate(-.5, 0, -0.5);
  floor.render();

  // Draw the sky
  var sky = new Cube();
  sky.color = [1.0,0.0,0.0,1.0];
  sky.textureNum=0
  sky.matrix.scale(50,50,50);
  sky.matrix.translate(-.5, -.5, -0.5);
  sky.render();

  // Draw the body cube
  //var body = new Cube();
  //body.color = [1.0,0.0,0.0,1.0];
  //body.textureNum=0
  //body.matrix.translate(-.25, -.75, 0.0);
  //body.matrix.rotate(-5,1,0,0);
  //body.matrix.scale(0.5, .3, .5);
  //body.render();

  // Draw a left arm
  //var yellow = new Cube();
  //yellow.color = [1,1,0,1];
  //yellow.matrix.setTranslate(0, -.5, 0.0);
  //yellow.matrix.rotate(-5,1,0,0);

  //yellow.matrix.rotate(-g_yellowAngle, 0,0,1);

  //var yellowCoordniatesMat = new Matrix4(yellow.matrix);
  //yellow.matrix.scale(0.25, .7, .5);
  //yellow.matrix.translate(-.5,0,0);
  //yellow.render();

  // Test box
  //var box = new Cube();
  //box.color = [1,0,1,1];
  //box.textureNum=0;
  //box.matrix = yellowCoordniatesMat;
  //box.matrix.translate(0,.65,0);
  //box.matrix.rotate(-g_magentaAngle,0,0,1);
  //box.matrix.scale(.3,.3,.3);
  //box.matrix.translate(-.5,0,-0.001);
  //box.render();

  // Snorlax Body
  var snorlaxBody = new Cube();
  snorlaxBody.color = [0,.5,.5,1];
  snorlaxBody.matrix.translate(-.45,-.5,-.5);
  //snorlaxBody.matrix.rotate(-10,1,0,0);
  snorlaxBody.matrix.scale(.8,.3,.7);
  snorlaxBody.render();

  // Snorlax Stummy
  var stummy = new Cube();
  stummy.color = [1,.93,.67,1];
  stummy.matrix.translate(-.44,-.49,-.39);
  //stummy.matrix.rotate(-10.1,1,0,0);
  stummy.matrix.scale(.6,.02,.6);
  stummy.matrix.translate(.15,14.6,-.05);
  //stummy.matrix.rotate(-10, 0,0,0);
  stummy.render();



  // Snorlax left foot
  var leftFoot = new Cube();
  leftFoot.color = [1,.93,.67,1];
  leftFoot.matrix.translate(-.45,-.5,-.5);
  //leftFoot.matrix.rotate(-10.1,1,0,0);
  leftFoot.matrix.scale(.2,.2,.15);
  leftFoot.matrix.translate(.4,.3,-1.01);
  leftFoot.matrix.rotate(180, 1,0,0);
  leftFoot.matrix.translate(0,-1,-1);

  leftFoot.matrix.rotate(g_leftFootAngle, 1,0,0);

  leftFoot.render();

  // Snorlax right foot
  var rightFoot = new Cube();
  rightFoot.color = [1,.93,.67,1];
  rightFoot.matrix.translate(-.45,-.5,-.5);
  //rightFoot.matrix.rotate(-10.1,1,0,0);
  rightFoot.matrix.scale(.2,.2,.15);
  rightFoot.matrix.translate(2.7,.3,-1.01);
  rightFoot.matrix.rotate(180, 1,0,0);
  rightFoot.matrix.translate(0,-1,-1);

  rightFoot.matrix.rotate(g_rightFootAngle, 1,0,0);

  rightFoot.render();

  // Snorlax left sole
  var leftSole = new Cube();
  leftSole.color = [.79,.48,.5,1];
  leftSole.matrix = new Matrix4(leftFoot.matrix);
  leftSole.matrix.scale(.7,.7,.01 );
  leftSole.matrix.translate(.2,.3,100);
  leftSole.render();

  // Snorlax right sole
  var rightSole = new Cube();
  rightSole.color = [.79,.48,.5,1];
  rightSole.matrix = new Matrix4(rightFoot.matrix);
  rightSole.matrix.scale(.7,.7,.01 );
  rightSole.matrix.translate(.2,.3,100);
  rightSole.render();

  // Snorlax toes
  var toe1 = new Cone();
  toe1.matrix = leftFoot.matrix;
  toe1.matrix.scale(.5,.5,.5)
  toe1.matrix.rotate(180, 1,0,0);
  toe1.matrix.translate(0,-.8,-1.5);
  toe1.matrix.rotate(50, 0,0,1);
  toe1.render();

  var toe2 = new Cone();
  toe2.matrix = toe1.matrix;
  toe2.matrix.rotate(-50, 0,0,1);
  toe2.matrix.translate(.5,.5,0);
  toe2.render();

  var toe3 = new Cone();
  toe3.matrix = toe2.matrix;
  toe3.matrix.rotate(-50, 0,0,1);
  toe3.matrix.translate(.3,.8,0);
  toe3.render();

  var toe4 = new Cone();
  toe4.matrix = rightFoot.matrix;
  toe4.matrix.scale(.5,.5,.5)
  toe4.matrix.rotate(180, 1,0,0);
  toe4.matrix.translate(0,-.8,-1.5);
  toe4.matrix.rotate(50, 0,0,1);
  toe4.render();

  var toe5 = new Cone();
  toe5.matrix = toe4.matrix;
  toe5.matrix.rotate(-50, 0,0,1);
  toe5.matrix.translate(.5,.5,0);
  toe5.render();

  var toe6 = new Cone();
  toe6.matrix = toe5.matrix;
  toe6.matrix.rotate(-50, 0,0,1);
  toe6.matrix.translate(.3,.8,0);
  toe6.render();




  // Snorlax left arm
  var leftArm = new Cube();
  leftArm.color = [0,.5,.6,1];
  leftArm.matrix.translate(-.45,-.5,-.5);
  //leftArm.matrix.rotate(-10.1,1,0,0);
  leftArm.matrix.scale(.25,.2,.3);
  leftArm.matrix.translate(-1.001,1.3,2.25);
  leftArm.matrix.rotate(180,0,1,0);
  leftArm.matrix.rotate(180,0,0,1);

  leftArm.matrix.rotate(g_leftArmAngle, 1,0,0);

  leftArm.render();

  // Snorlax right arm
  var rightArm = new Cube();
  rightArm.color = [0,.5,.6,1];
  rightArm.matrix.translate(-.45,-.5,-.5);
  //rightArm.matrix.rotate(-10.1,1,0,0);
  rightArm.matrix.scale(.25,.2,.3);
  rightArm.matrix.translate(3.2,1.3,2.25);
  rightArm.matrix.rotate(180,0,1,0);
  rightArm.matrix.rotate(180,0,0,1);

  rightArm.matrix.rotate(g_rightArmAngle, 1,0,0);

  rightArm.render();

  // Snorlax claws
  var claw1 = new Cone();
  claw1.matrix = leftArm.matrix;
  claw1.matrix.scale(.3,.3,.3);
  claw1.matrix.translate(2.5,1.3,3.5);
  claw1.matrix.rotate(90, 1,0,0);
  claw1.matrix.rotate(180, 0,0,1);

  claw1.matrix.rotate(-g_clawAngle, 0,0,1);

  claw1.render();

  var claw2 = new Cone();
  claw2.matrix = leftArm.matrix;
  claw2.matrix.translate(0,0,-1);
  claw2.render();

  var claw3 = new Cone();
  claw3.matrix = leftArm.matrix;
  claw3.matrix.translate(0,0,-1);
  claw3.render();

  var claw4 = new Cone();
  claw4.matrix = rightArm.matrix;
  claw4.matrix.scale(.3,.3,.3);
  claw4.matrix.translate(1,1.2,3.7);
  claw4.matrix.rotate(-270, 1,0,0);
  claw4.matrix.rotate(-90, 0,0,1);

  claw4.matrix.rotate(g_clawAngle, 0,0,1);

  claw4.render();

  var claw5 = new Cone();
  claw5.matrix = rightArm.matrix;
  claw5.matrix.translate(0,0,-1);
  claw5.render();

  var claw6 = new Cone();
  claw6.matrix = rightArm.matrix;
  claw6.matrix.translate(0,0,-1);
  claw6.render();




  // Snorlax head
  var head = new Cube();
  head.color = [0,.5,.6,1];
  head.matrix.translate(0,-.2,-.5);
  head.matrix.scale(.45,.3,.3);
  head.matrix.translate(.4,0,2.3);
  head.matrix.rotate(180, 0,0,1);

  head.matrix.rotate(g_headAngle, 1,0,0);
  head.matrix.rotate(g_headAngle2, 0,0,1);

  head.render();

  // Snorlax face
  var face = new Cube();
  face.color = [1,.93,.67,1];
  face.matrix = new Matrix4(head.matrix);
  face.matrix.scale(.8,.001,.7);
  face.matrix.translate(.13,-1.1,0);
  face.render();

  // Snorlax face indent
  var faceIndent = new Cube();
  faceIndent.color = [0,.5,.5,1];
  faceIndent.matrix = face.matrix;
  faceIndent.matrix.scale(.3,1,.3);
  faceIndent.matrix.translate(.9,-.01,3.3);
  faceIndent.matrix.rotate(45, 0,1,0);
  faceIndent.render();

  // Snorlax left eye
  var leftEye = new Cube();
  leftEye.color = [0,0,0,1];
  leftEye.matrix = new Matrix4(faceIndent.matrix);
  leftEye.matrix.rotate(-45, 0,1,0);
  leftEye.matrix.scale(1.1,1,.1);
  leftEye.matrix.translate(1,-.05,-6);
  leftEye.render();

  // Snorlax right eye
  var rightEye = new Cube();
  rightEye.color = [0,0,0,1];
  rightEye.matrix = leftEye.matrix;
  rightEye.matrix.translate(-1.75,0,0);
  rightEye.render();

  // Snorlax mouth
  var mouth = new Cube();
  mouth.color = [0,0,0,1];
  mouth.matrix = leftEye.matrix;
  mouth.matrix.scale(1.5,1,1.5);
  mouth.matrix.translate(.5,0,-10);
  mouth.render();

  // Snorlax teeth
  var tooth1 = new Cube();
  tooth1.color = [1,1,1,1];
  tooth1.matrix = mouth.matrix;
  tooth1.matrix.scale(.2,1,4);
  tooth1.matrix.translate(4,-.05,0);
  tooth1.render();

  var tooth2 = new Cube();
  tooth2.color = [1,1,1,1];
  tooth2.matrix = tooth1.matrix
  tooth2.matrix.translate(-4,0,0);
  tooth2.render();

  // Snorlax left ear
  var leftEar = new Cone();
  leftEar.color = [0,.5,.5,1];
  leftEar.matrix = head.matrix
  leftEar.matrix.scale(.5,.5,.5);
  leftEar.matrix.rotate(90, 1,0,0);
  leftEar.matrix.translate(1,1.8,-1.5);
  leftEar.render();

  // Snorlax right ear
  var rightEar = new Cone();
  rightEar.color = [0,.5,.5,1];
  rightEar.matrix = leftEar.matrix;
  rightEar.matrix.translate(-1,0,0);
  rightEar.render();



  // Check the time at the end of the function, and show on web page
  var duration = performance.now() - startTime;
  sendTextToHTML( " ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration)/10, "numdot");
}

// Set the text of a HTML element
function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get" + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}
