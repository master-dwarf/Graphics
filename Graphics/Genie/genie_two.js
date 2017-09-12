// the-genie-times-two.js

// Demonstrate viewports


var gl;
var points;
var vertices = [];
var size = 0.25;
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

    // Manufacture the genie points in the array vertices by calling function

    genie(size);
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

function genie(size) {
    const NUM = 300;
    var i, fact, fact_now, fact7, fact8;
    
    fact = (8*Math.atan(1.0)) / NUM;
    for (i = 0; i < NUM; ++i) {
	fact_now = fact * i;
	fact7 = fact_now * 7;
	fact8 = fact_now * 8;
	vertices.push( vec2(size * (Math.cos(fact_now) + Math.sin(fact8)),
			    size * (2.0 * Math.sin(fact_now) + Math.sin(fact7))));
    }
};


function render() {
    gl.viewport( 0, 0, canvas.width/2, canvas.height/2 );
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.LINE_LOOP, 0, vertices.length );
    gl.viewport( canvas.width/2, canvas.height/2, canvas.width/2, canvas.height/2 );
    gl.drawArrays( gl.LINE_LOOP, 0, vertices.length );
}
