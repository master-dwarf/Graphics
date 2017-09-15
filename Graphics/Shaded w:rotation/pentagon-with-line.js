// pentagon-with-line.js

// Add event listeners (button and key) to rotate the pentagon

// Rotation amount control by a uniform variable theta

// Smooth shading done by a color vector interpolated in the fragment shader

var gl;
var points;
var program;
var vertices = [];
var canvas;

window.onload = function init(){
  canvas = document.getElementById( "gl-canvas" );

  //    gl = WebGLUtils.setupWebGL( canvas );
  gl = WebGLDebugUtils.makeDebugContext( canvas.getContext("webgl") ); // For debugging
  if ( !gl ) { alert( "WebGL isn't available" );
}
//the vertices

vertices = [
  vec2(0,0),
  vec2(-.4,1.0),
  vec2(.4,1.0),
  vec2(1.0,.4),
  vec2(1.0,-.4),
  vec2(.4,-1.0),
  vec2(-.4,-1.0),
  vec2(-1.0,-.4),
  vec2(-1.0,.4),
  vec2(-.4,1.0)
];

// Associate a RGBA color with each vertex
var colors = [
  vec4(vertices[0][0] + 0.5, 0.0, vertices[0][1] + 0.5, 1.0),
  vec4(vertices[1][0] + 0.5, 0.0, vertices[1][1] + 0.5, 1.0),
  vec4(vertices[2][0] + 0.5, 0.0, vertices[2][1] + 0.5, 1.0),
  vec4(vertices[3][0] + 0.5, 0.0, vertices[3][1] + 0.5, 1.0),
  vec4(vertices[4][0] + 0.5, 0.0, vertices[4][1] + 0.5, 1.0),
  vec4(vertices[5][0] + 0.5, 0.0, vertices[5][1] + 0.5, 1.0),
  vec4(vertices[6][0] + 0.5, 0.0, vertices[6][1] + 0.5, 1.0),
  vec4(vertices[7][0] + 0.5, 0.0, vertices[7][1] + 0.5, 1.0),
  vec4(vertices[8][0] + 0.5, 0.0, vertices[8][1] + 0.5, 1.0),
  vec4(vertices[9][0] + 0.5, 0.0, vertices[9][1] + 0.5, 1.0)
];


//  Configure WebGL

gl.viewport( 0, 0, canvas.width, canvas.height );
gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

//  Load shaders and initialize attribute buffers

program = initShaders( gl, "vertex-shader", "fragment-shader" );
gl.useProgram( program );

// Load the data into the GPU

var bufferId = gl.createBuffer();
gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

// Associate our shader variables with our data buffer

var vPosition = gl.getAttribLocation( program, "vPosition" );
gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray( vPosition );

// Load the RGBA color data into the GPU

var cBuffer = gl.createBuffer();
gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

var vColor = gl.getAttribLocation( program, "vColor" );
// Why the 4 in the next line?
gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
gl.enableVertexAttribArray( vColor );

render();
};

function render()
{
  gl.clear( gl.COLOR_BUFFER_BIT);

  // Here the line is drawn last to ensure it is highly visible
  // Use the vColor attribute
  // gl.drawArrays( gl.TRIANGLE_FAN, 0, vertices.length );
  for(var y=0;y<4;y++){
    for(var x=0;x<6;x++){
      gl.uniform1i(gl.getUniformLocation(program, "smooth_flag"),1);
      gl.viewport( (canvas.width/6)*x, (canvas.height/4)*y, canvas.width/6, canvas.height/4 );
      gl.drawArrays( gl.TRIANGLE_FAN, 0, vertices.length );
      gl.uniform1i(gl.getUniformLocation(program, "smooth_flag"),0);
      gl.drawArrays(gl.LINE_LOOP,1,vertices.length-2);
    }
  }

};
