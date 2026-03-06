// Vertex shader: positions the points
const vsSource = `
  attribute vec4 aVertexPosition;
  void main() {
    gl_Position = aVertexPosition;
  }
`;

// Fragment shader: colors the pixels (red)
const fsSource = `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`;

const canvas = document.querySelector("#myCanvas");
const gl = canvas.getContext("webgl");

// Helper: Compile shaders
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

// Create the shader program
const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

// 3. Define the triangle (X, Y coordinates)
const positions = [
  0.0,
  0.5, // Top
  -0.5,
  -0.5, // Bottom Left
  0.5,
  -0.5, // Bottom Right
];

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// 4. Link the buffer to the shader attribute
const posLoc = gl.getAttribLocation(program, "aVertexPosition");
gl.enableVertexAttribArray(posLoc);
gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

// 5. Draw
gl.clearColor(0, 0, 0, 1); // Black background
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLES, 0, 3);
