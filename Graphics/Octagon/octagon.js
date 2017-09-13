// octagon.js

var gl;
var points;
var vertices = [];
var canvas;

window.onload = function init(){
  canvas = document.getElementById( "gl-canvas" );

  //    gl = WebGLUtils.setupWebGL( canvas );
  gl = WebGLDebugUtils.makeDebugContext( canvas.getContext("webgl") ); // For debugging
  if ( !gl ) { alert( "WebGL isn't available" );
}

//  Configure WebGL

gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

//  Load shaders and initialize attribute buffers

var program = initShaders( gl, "vertex-shader", "fragment-shader" );
gl.useProgram( program );

// points for the octagon

vertices = [
  vec2(0,0),
  vec2(-.4,.99),
  vec2(.4,.99),
  vec2(.99,.4),
  vec2(.99,-.4),
  vec2(.4,-.99),
  vec2(-.4,-.99),
  vec2(-.99,-.4),
  vec2(-.99,.4),
  vec2(-.4,.99)
];

// Load the data into the GPU

var bufferId = gl.createBuffer();
gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

// Associate our shader variables with our data buffer

var vPosition = gl.getAttribLocation( program, "vPosition" );
gl.vertexAttribPointer(
  vPosition, // Specifies the index of the generic vertex attribute to be modified.
  2,	   // Specifies the number of components per generic vertex attribute.
  // Must be 1, 2, 3, or 4.
  gl.FLOAT,  // Specifies the data type of each component in the array.
  // GL_BYTE, GL_UNSIGNED_BYTE, GL_SHORT, GL_UNSIGNED_SHORT, GL_FIXED, or GL_FLOAT.
  false,     // Specifies whether fixed-point data values should be normalized (GL_TRUE)
  // or converted directly as fixed-point values (GL_FALSE) when they are accessed.
  0,	       // Specifies the byte offset between consecutive generic vertex attributes.
  // If stride is 0, the generic vertex attributes are understood
  // to be tightly packed in the array.
  0	       // Specifies a pointer to the first component
  // of the first generic vertex attribute in the array.
);
gl.enableVertexAttribArray( vPosition );
render();
};

function render() {
  gl.clear( gl.COLOR_BUFFER_BIT );
  for(var y=0;y<4;y++){
    for(var x=0;x<6;x++){
      gl.viewport( (canvas.width/6)*x, (canvas.height/4)*y, canvas.width/6, canvas.height/4 );
      gl.drawArrays( gl.TRIANGLE_FAN, 0, vertices.length );
    }
  }
}
