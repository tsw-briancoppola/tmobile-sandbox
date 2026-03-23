// =-=-=-=-=-=-=-=-
// Global variables
// =-=-=-=-=-=-=-=-

const COLOR_BACKGROUND = 0x222222;
const COLOR_CUBE = "#e20074";
const COLOR_FLOOR = 0x334455;
const COLOR_WALL1 = 0x999999;
const COLOR_WALL2 = 0x667766;
const COLOR_WALL3 = 0x445566;

// =-=-=-=-=-=-=-=-=-=-=
// Three.js render setup
// =-=-=-=-=-=-=-=-=-=-=

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;

// Enable shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadows

// Set background color
scene.background = new THREE.Color(COLOR_BACKGROUND);

// =-=-=-=-=-=
// Render cube
// =-=-=-=-=-=

// Load SVG for the cube sides
const loader = new THREE.TextureLoader();
// Updated Path and Wrapper
const svgPathTMobileLogo =
  "M29.2,48.1h-10v-10h10v10ZM19.2,15.2v16.9h3v-.5c0-8,4.5-13,13-13h.5v35.9c0,5-2,7-7,7h-1.5v3.5h25.9v-3.5h-1.5c-5,0-7-2-7-7V18.7h.5c8.5,0,13,5,13,13v.5h3V15.2H19.2ZM51.1,48.1h10v-10h-10v10Z";
const svgFull = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="10 10 60 60" width="512" height="512">
  <rect width="100%" height="100%" x="10" y="10" fill="${COLOR_CUBE}" />
  <path d="${svgPathTMobileLogo}" fill="white" />
</svg>`;

const svgData = `data:image/svg+xml;base64,${btoa(svgFull)}`;
const svgTexture = loader.load(svgData);

// 3. Updated Materials
const materials = Array(6)
  .fill(null)
  .map(
    () =>
      new THREE.MeshStandardMaterial({
        map: svgTexture,
        color: 0xffffff,
        roughness: 0.4, // 0 is mirror-smooth, 1 is like chalk
        metalness: 0.2, // 0 is plastic/wood, 1 is pure metal
      }),
  );

const geometry = new THREE.BoxGeometry(1, 1, 1);
const cube = new THREE.Mesh(geometry, materials);

// Add edge lines to cube
const edges = new THREE.EdgesGeometry(geometry);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x222222 });
const wireframe = new THREE.LineSegments(edges, lineMaterial);
cube.add(wireframe);

scene.add(cube);

// =-=-=-=-=-=-
// Render light
// =-=-=-=-=-=-

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1.2);
pointLight.position.set(2, 3, 0); // Position: X, Y, Z
scene.add(pointLight);

// const light = new THREE.DirectionalLight(0xffffff, 1);
// light.position.set(5, 5, 5);
// scene.add(light);

// Add light helper shape
const lightHelper = new THREE.PointLightHelper(pointLight, 0.5);
scene.add(lightHelper);

// =-=-=-=-=-=-=-=
// Render 3D floor
// =-=-=-=-=-=-=-=

// 1. Create a large flat plane (width, height)
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({ color: COLOR_FLOOR });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);

// 2. Rotate it so it's flat on the ground (X-axis rotation)
floor.rotation.x = -Math.PI / 2;
floor.position.y = -2.5; // Move it below the cube

// 3. Tell the floor to RECEIVE shadows
floor.receiveShadow = true;
scene.add(floor);

cube.castShadow = true;

// 2. The Light (Only certain lights cast shadows, PointLight is one of them)
pointLight.castShadow = true;

// =-=-=-=-=-=-=-
// Render 3D wall
// =-=-=-=-=-=-=-

const createWall = (width, height, color, x, y, z, rotationY = 0, texture = null) => {
  const wallGeometry = new THREE.PlaneGeometry(width, height);
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.7,
    map: texture,
  });

  const wall = new THREE.Mesh(wallGeometry, wallMaterial);
  wall.position.set(x, y, z);
  wall.rotation.y = rotationY;
  wall.receiveShadow = true;

  scene.add(wall);
  return wall;
};

createWall(20, 15, COLOR_WALL1, 0, 5, -10, 0, svgTexture);
createWall(20, 15, COLOR_WALL2, -10, 5, 0, Math.PI / 2);
createWall(20, 15, COLOR_WALL2, 10, 5, 0, (Math.PI / 2) * -1);
createWall(20, 15, COLOR_WALL3, 0, 5, 10, Math.PI);

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// OrbitControls for user interaction
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

const controls = new THREE.OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2.1;
controls.minDistance = 2; // Don't let them zoom into the cube
controls.maxDistance = 15; // Don't let them fly away into space
// controls.enablePan = false;

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Event listener for window resizing
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

window.addEventListener("resize", () => {
  // Update the camera's aspect ratio
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});

// =-=-=-=-=-=-=-=-
// Animate function
// =-=-=-=-=-=-=-=-

const animate = () => {
  requestAnimationFrame(animate);

  // Move the light in a circle
  const time = Date.now() * 0.0005;
  // pointLight.position.x = Math.sin(time) * 5;
  // pointLight.position.z = Math.cos(time) * 5;

  // The helper will automatically follow the light!
  lightHelper.update();

  // Cube rotation direction and speed
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
};

// =-=-=-=
// On load
// =-=-=-=

// const loadGTLF = () => {
//   const loader = new THREE.GLTFLoader();
//   const gltfString = '{ "asset": { "version": "2.0" }, ... }'; // Your variable

//   loader.parse(
//     helmetGTLF,
//     "",
//     function (gltf) {
//       scene.add(gltf.scene); // Add the parsed model to your scene
//     },
//     function (error) {
//       console.error("An error happened during parsing", error);
//     },
//   );
// };

window.addEventListener("load", () => {
  animate();
  // loadGTLF();
});
