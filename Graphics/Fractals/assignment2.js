// fractal-by-ifs.js
// Generate fractal by iterating tranformations taken from an IFS specification
// The variable myIFS is loaded from a JSON representation of the IFS specification

var gl;
var pMatrix;
var projection;
var vertices = [];
var colors = [];
var tweenLoc;
var tweenFactor = 0.0;
var toChaos = false;
var canvas;

// WC window will have to be adjusted based on the fractal's properties
// Those below work for the dragon fractal
var LEFTD = -10.0;
var RIGHTD = 10.0;
var BOTTOMD = 0.0;
var TOPD = 10.0;

// Those below work for the Sierpinski's triangle
var LEFTG = -3.5;
var RIGHTG = 3.75;
var BOTTOMG = -2.5;
var TOPG = 4.0;

//generate random colors
var DR = Math.random();
var DG = Math.random();
var DB = Math.random();
var GR = Math.random();
var GG = Math.random();
var GB = Math.random();

// Number of fractal points to generate
var numpts = 10000;

window.onload = function init(){
  canvas = document.getElementById( "gl-canvas" );

  //    gl = WebGLUtils.setupWebGL( canvas );
  gl = WebGLDebugUtils.makeDebugContext( canvas.getContext("webgl") ); // For debugging
  if ( !gl ) { alert( "WebGL isn't available" );
}

///////////////// Generate the fractal points //////////////////////////////////////////////
generateFractalPoints();
///////////////// Point generation completed ///////////////////////////////////////////////

colors = [
	vec4(Math.random(), Math.random(),Math.random(), 1.0),
	vec4(Math.random(), Math.random(),Math.random(), 1.0)
    ];

//  Configure WebGL

gl.viewport( 0, 0, canvas.width, canvas.height );
gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

//  Load shaders and initialize attribute buffers

var program = initShaders( gl, "vertex-shader", "fragment-shader" );
gl.useProgram( program );

// Load the data into the GPU

var bufferId = gl.createBuffer();
gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

// Associate our shader variables with our data buffer

var sPosition = gl.getAttribLocation( program, "sPosition" );
gl.vertexAttribPointer(sPosition, 2, gl.FLOAT, false, 16, 0 );
gl.enableVertexAttribArray( sPosition );

var gPosition = gl.getAttribLocation( program, "gPosition" );
gl.vertexAttribPointer(gPosition, 2, gl.FLOAT, false, 16, 8 );
gl.enableVertexAttribArray( gPosition );

projection = gl.getUniformLocation( program, "projection" );
tweenLoc = gl.getUniformLocation(program, "tween");

render();
};

function generateFractalPoints () {

  var iter, trit, chaost;
  var oldtrix = 0;
  var oldtriy = 0;
  var chaosoldx = 0;
  var chaosoldy = 0;
  var trix, triy, trip, chaosx, chaosy, chaosp;
  var cumulative_prob_tri = [];
  var cumulative_prob_chaos = [];

  cumulative_prob_tri.push(tri.transformations[0].prob);
  for (var i = 1; i < tri.transformations.length; i++)
  cumulative_prob_tri.push(cumulative_prob_tri[i-1] + tri.transformations[i].prob);

  cumulative_prob_chaos.push(chaos.transformations[0].prob);
  for (var i = 1; i < chaos.transformations.length; i++)
  cumulative_prob_chaos.push(cumulative_prob_chaos[i-1] + chaos.transformations[i].prob);

  iter = 0;
  while (iter < numpts)
  {
    trip = Math.random();

    // Select transformation t
    trit = 0;
    while ((trip > cumulative_prob_tri[trit]) && (trit < tri.transformations.length - 1)) trit++;

    // Transform point by transformation t
    trix = tri.transformations[trit].rotate_scalexx*oldtrix
    + tri.transformations[trit].rotate_scalexy*oldtriy
    + tri.transformations[trit].trans_x;
    triy = tri.transformations[trit].rotate_scaleyx*oldtrix
    + tri.transformations[trit].rotate_scaleyy*oldtriy
    + tri.transformations[trit].trans_y;

    chaosp = Math.random();

    // Select transformation t
    chaost = 0;
    while ((chaosp > cumulative_prob_chaos[chaost]) && (chaost < chaos.transformations.length - 1)) chaost++;

    // Transform point by transformation t
    chaosx = chaos.transformations[chaost].rotate_scalexx*chaosoldx
    + chaos.transformations[chaost].rotate_scalexy*chaosoldy
    + chaos.transformations[chaost].trans_x;
    chaosy = chaos.transformations[chaost].rotate_scaleyx*chaosoldx
    + chaos.transformations[chaost].rotate_scaleyy*chaosoldy
    + chaos.transformations[chaost].trans_y;

    // Jump around for awhile without plotting to make
    //   sure the first point seen is attracted into the
    //   fractal
    if (iter > 20) {
      vertices.push(vec2(trix, triy, 0.0));
      vertices.push(vec2(chaosx,chaosy, 0.0));
    }
    oldtrix = trix;
    oldtriy = triy;
    chaosoldx = chaosx
    chaosoldy = chaosy
    iter++;
  }
};

function render() {
  gl.clear( gl.COLOR_BUFFER_BIT );
  if (toChaos) {
    tweenFactor = Math.min(tweenFactor + 0.007, 1.0);//DRAGON TO GALAXY
    pMatrix = ortho((1.0 - tweenFactor) * LEFTD + tweenFactor * LEFTG,
      (1.0 - tweenFactor) * RIGHTD + tweenFactor * RIGHTG,
      (1.0 - tweenFactor) * BOTTOMD + tweenFactor * BOTTOMG,
      (1.0 - tweenFactor) * TOPD + tweenFactor * TOPG,-1,1);
  }
  else{
    tweenFactor = Math.max(tweenFactor - 0.007, 0.0);//GALAXY TO DRAGON
    pMatrix = ortho((1.0 - tweenFactor) * LEFTD + tweenFactor * LEFTG,
      (1.0 - tweenFactor) * RIGHTD + tweenFactor * RIGHTG,
      (1.0 - tweenFactor) * BOTTOMD + tweenFactor * BOTTOMG,
      (1.0 - tweenFactor) * TOPD + tweenFactor * TOPG,-1,1);
  }
  // pMatrix = ortho(LEFTD,RIGHTD,BOTTOMD,TOPD,-1,1);
  gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );
  gl.uniform1f(tweenLoc, tweenFactor);
  gl.drawArrays( gl.POINTS, 0, vertices.length/2);

  // Currently animation isn't needed, but perhaps in an assignment ...
  requestAnimFrame( render );
}

window.onkeydown = function(event) {
  var key = String.fromCharCode(event.keyCode);

  switch (key) {
    case 'R' :
      if(toChaos) {
        toChaos = false;
        document.getElementById('caption-for-the-goal').innerHTML="galaxy-to-dragon";
        // document.getElementById('caption-for-the-goal').style.color = ;
      }
      else {
        toChaos = true;
        document.getElementById('caption-for-the-goal').innerHTML="dragon-to-galaxy"
        // document.getElementById('caption-for-the-goal').style.color = rgb(colors[1]);
      };
    break;
  }
};
