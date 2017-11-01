// assignment3.js -- A starting point for your work on Assignment 3

var canvas;
var gl;
var program;

var near = 0.3;
var far = 10.0;
var radius = 4.0;		// Used to establish eye point
var theta  = 0.0;		// Used to establish eye point
var phi    = 0.0;		// Used to establish eye point
var rotation_by_5_deg = 5.0 * Math.PI/180.0;
var rotY = 0.0;
var transY = 0.0;
var transX = 0.0;

var  fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect;       // Viewport aspect ratio

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var width;
var height;

var eye;			// Established by radius, theta, phi as we move
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var fColor;

const black = vec4(0.0, 0.0, 0.0, 1.0);
const red = vec4(1.0, 0.0, 0.0, 1.0);
const white = vec4(0.0, 0.0, 0.0, 0.0);
const blue = vec4(0.0,0.0,1.0, 1.0);
const green = vec4(0.0,1.0,0.0,1.0);
var color=false;

////////////////// Object 1 vertex information //////////////////

var nRows = 25;
var nColumns = 25;

var datax = [];
var datay = [];
var dataz = [];

var pointsArray1 = [];

function coordsForObj1()
{
  for( var i = 0; i <= nRows; ++i ) {
    datax.push( [] );
    datay.push( [] );
    dataz.push( [] );
    var u = 2.0 * Math.PI * (i/nRows);

    for( var j = 0; j <= nColumns; ++j ) {
      var v = -0.3 + ((j/nColumns) * 0.6);
      datax[i].push(Math.cos(u) + v * Math.sin(u/2.0) * Math.cos(u));
      datay[i].push(Math.sin(u) + v * Math.sin(u/2.0) * Math.sin(u));
      dataz[i].push(v * Math.cos(u/2.0));
    }
  }

  for(var i=0; i<nRows; i++) {
    for(var j=0; j<nColumns;j++) {
      pointsArray1.push( vec4(datax[i][j], datay[i][j], dataz[i][j],1.0));
      pointsArray1.push( vec4(datax[i+1][j], datay[i+1][j], dataz[i+1][j], 1.0));
      pointsArray1.push( vec4(datax[i+1][j+1], datay[i+1][j+1], dataz[i+1][j+1], 1.0));
      pointsArray1.push( vec4(datax[i][j+1], datay[i][j+1], dataz[i][j+1], 1.0));
    }
  }
}

///////// End of vertex information for Object 1  ////////
                      //buckyball//

var pointsArray2 = [];

function getBucky(){
  var vert = 0;
  for(var i=0;i<75;i++){//Hexagons
    if(vert==0){
      pointsArray2.push(buckyBall[i]);
      vert++;
    }
    else if(vert==1 | vert==2 | vert==5 | vert == 8 | vert == 10){
      pointsArray2.push(buckyBall[i]);
      pointsArray2.push(buckyBall[i]);
      vert++;
    }
    else if(vert==11){
      pointsArray2.push(buckyBall[i-vert]);
      vert = 0;
    }
    else{
      vert++;
    }
  }
  vert = 0;
  for(var p=75;p<buckyBall.length;p++){
    if(vert == 0){
      pointsArray2.push(buckyBall[i]);
      vert++;
    }
    else if(vert == 1 | vert == 2 | vert == 5 | vert == 7){
      pointsArray2.push(buckyBall[i]);
      vert++;
    }
    else if(vert==9){
      pointsArray2.push(buckyBall[i-vert]);
      vert = 0;
    }
    else{
      vert++;
    }
  }
}
/////////////////////////////////////////////////////////

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

       gl = WebGLUtils.setupWebGL( canvas );
    // gl = WebGLDebugUtils.makeDebugContext( canvas.getContext("webgl") ); // For debugging
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    aspect =  canvas.width/canvas.height;
    gl.clearColor( Math.random(), Math.random(), Math.random(), 1.0 );
    gl.enable(gl.DEPTH_TEST);

    gl.depthFunc(gl.LEQUAL)
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1.0,1.0);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    coordsForObj1();		// This will probably change once you finalize Object 1
    getBucky();

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
//    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray1), gl.STATIC_DRAW );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray1.concat(buckyBall)), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    // buttons for viewing parameters

    document.getElementById("Button1").onclick = function(){near  *= 1.02; far *= 1.02;};
    document.getElementById("Button2").onclick = function(){near *= 0.98; far *= 0.98;};
    document.getElementById("Button3").onclick = function(){radius *= 1.1;};
    document.getElementById("Button4").onclick = function(){radius *= 0.9;};
    document.getElementById("Button5").onclick = function(){theta += rotation_by_5_deg;};
    document.getElementById("Button6").onclick = function(){theta -= rotation_by_5_deg;};
    document.getElementById("Button7").onclick = function(){phi += rotation_by_5_deg;};
    document.getElementById("Button8").onclick = function(){phi -= rotation_by_5_deg;};
    document.getElementById("master").onclick = function(){if(color){color=false;}else{color=true;}};

    render();
};

var x=0;


var render = function(){
  if(color){
    if(x===0){
      gl.clearColor( Math.random(), Math.random(), Math.random(), 1.0 );
      x++;
    }
    else if(x==15){
      x=0;
    }
    else {
      x++;
    }
  }

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
               radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));

    // Object 1
    modelViewMatrix = lookAt(eye, at , up);
    modelViewMatrix = mult(modelViewMatrix, translate(-1.5,0.0,0.0));
    modelViewMatrix = mult(modelViewMatrix, rotateY(90));
    modelViewMatrix = mult(modelViewMatrix, scalem(1.0,1.0,1.0));
    projectionMatrix = perspective(fovy, aspect, near, far);

    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

    for(var i=0; i<pointsArray1.length; i+=4) {
        gl.uniform4fv(gl.getUniformLocation(program, "fColor"), flatten(green));
        gl.drawArrays( gl.TRIANGLE_FAN, i, 4 );
        gl.uniform4fv(gl.getUniformLocation(program, "fColor"), flatten(black));
        gl.drawArrays( gl.LINE_LOOP, i, 4 );
    }


    // The BuckyBall
    modelViewMatrix = lookAt(eye, at , up);
    rotY += 2.0;
    transY+=0.01;
    transX-=0.01;

    modelViewMatrix = mult(modelViewMatrix, translate((Math.tan(transX)),-Math.abs(2 * Math.cos(transY)),0.0));
    modelViewMatrix = mult(modelViewMatrix, translate(0.0,1.0,0.0));
    modelViewMatrix = mult(modelViewMatrix, rotateY(-rotY));
    modelViewMatrix = mult(modelViewMatrix, rotateX(rotY));
    modelViewMatrix = mult(modelViewMatrix, rotateZ(-rotY));
    modelViewMatrix = mult(modelViewMatrix, scalem(0.02,0.02,0.02));
    projectionMatrix = perspective(fovy, aspect, near, far);

    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

    gl.uniform4fv(gl.getUniformLocation(program, "fColor"),flatten(black));
    gl.drawArrays( gl.TRIANGLES, pointsArray1.length, buckyBall.length);

    gl.uniform4fv(gl.getUniformLocation(program, "fColor"),flatten(white));
    gl.drawArrays(gl.TRIANGLES, pointsArray1.length, pointsArray2.length );

    requestAnimFrame(render);
};
