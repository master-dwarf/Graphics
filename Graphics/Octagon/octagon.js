// octagon.js
// Schläfli Number: 4.8.8
// golly-gee-wiz: The octagons are colored in a broad spectrum of RGB making nearly all the colors of the rainbow.
// Sources: In class demos of Genie-times-two and Shaded pentagon with rotation event listeners.
var gl;
var points;
var canvas
var program;
var vertices = [];

var width = 6; //number of occurances on the width
var height = 4; //number of occurances on the height

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    //  gl = WebGLUtils.setupWebGL( canvas );
    gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("webgl")); // For debugging
    if (!gl) {
        alert("WebGL isn't available");
    }

    // points for the octagon

    vertices = [
        vec2(0, 0), //center
        vec2(-.4, 1.0), //top left
        vec2(.4, 1.0), //top right
        vec2(1.0, .4), //right top
        vec2(1.0, -.4), //right bottom
        vec2(.4, -1.0), //bottom right
        vec2(-.4, -1.0), //bottom left
        vec2(-1.0, -.4), //left bottom
        vec2(-1.0, .4), //left top
        vec2(-.4, 1.0) //top left
    ];

    // Associate a RGBA color with each vertex of the octagon
    var colors = [
        vec4(0.0, 0.0, 0.0, 1.0), //center
        vec4(0.0, 0.0, 1.0, 1.0), //top left
        vec4(0.0, 0.0, 1.0, 1.0), //top right
        vec4(1.0, 0.0, 1.0, 1.0), //right top
        vec4(1.0, 0.0, 0.0, 1.0), //right bottom
        vec4(1.0, 0.0, 0.0, 1.0), //bottom right
        vec4(1.0, 1.0, 0.0, 1.0), //bottom left
        vec4(0.0, 1.0, 0.0, 1.0), //left bottom
        vec4(0.0, 1.0, 1.0, 1.0), //left top
        vec4(0.0, 0.0, 1.0, 1.0) //top left
    ];

    //  Configure WebGL

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //  Load shaders and initialize attribute buffers

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate our shader variables with our data buffer

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // Load the RGBA color data into the GPU

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    // Why the 4 in the next line?
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    //double for loop to move and paste the octagon to a different viewport
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            //give the shape colors for vertices
            gl.uniform1i(gl.getUniformLocation(program, "smooth_flag"), 1);
            //set the viewport to a specific quadrant of the canvas.
            gl.viewport((canvas.width / width) * x, (canvas.height / height) * y, canvas.width / width, canvas.height / height);
            //draw the octagon using TRIANGLE_FAN using colors
            gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices.length);
            //set the colors to white
            gl.uniform1i(gl.getUniformLocation(program, "smooth_flag"), 0);
            //draw the octagon again only the outline in white
            gl.drawArrays(gl.LINE_LOOP, 1, vertices.length - 2);
        }
    }

}
