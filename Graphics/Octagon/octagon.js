// octagon.js

var gl;
var points;
var canvas
var program;
var vertices = [];

window.onload = function init(){
  canvas = document.getElementById( "gl-canvas" );

  //    gl = WebGLUtils.setupWebGL( canvas );
  gl = WebGLDebugUtils.makeDebugContext( canvas.getContext("webgl") ); // For debugging
  if ( !gl ) { alert( "WebGL isn't available" );
}

// points for the octagon

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

// Associate a RGBA color with each vertex of the octagon
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
gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

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

function render() {
  gl.clear( gl.COLOR_BUFFER_BIT );
  //double for loop to move and paste the octagon to a different viewport
  for(var y=0;y<4;y++){
    for(var x=0;x<6;x++){
      //give the shape colors for vertices
      gl.uniform1i(gl.getUniformLocation(program, "smooth_flag"),1);
      //set the viewport to a specific quadrant of the canvas.
      gl.viewport( (canvas.width/6)*x, (canvas.height/4)*y, canvas.width/6, canvas.height/4 );
      //draw the octagon using TRIANGLE_FAN using colors
      gl.drawArrays( gl.TRIANGLE_FAN, 0, vertices.length );
      //set the colors to white
      gl.uniform1i(gl.getUniformLocation(program, "smooth_flag"),0);
      //draw the octagon again only the outline in white
      gl.drawArrays(gl.LINE_LOOP,1,vertices.length-2);
    }
  }

}
