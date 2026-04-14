// =-=-=-=-=-=-=-=-
// Global variables
// =-=-=-=-=-=-=-=-

const COLOR_BACKGROUND = 0x222222;
const COLOR_FLOOR = 0x334455;
const COLOR_MAGENTA = 0xe20074;
const FLOOR_Y = -2.5;

const FOOTBALL_SPIRAL_RATE = 0.01;

// =-=-=-=-=-=-=-=-=-=-=
// Three.js render setup
// =-=-=-=-=-=-=-=-=-=-=

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(-9, 7, 7);

// Enable shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Set background color
scene.background = new THREE.Color(COLOR_BACKGROUND);

// =-=-=-=-=-=-
// Render light
// =-=-=-=-=-=-

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1.2);
pointLight.position.set(4, 7, 0);
pointLight.castShadow = true; // Light casts shadows
scene.add(pointLight);

const lightHelper = new THREE.PointLightHelper(pointLight, 0.5);
scene.add(lightHelper);

// =-=-=-=-=-=-=-=
// Render 3D floor
// =-=-=-=-=-=-=-=

const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({ color: COLOR_FLOOR });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);

floor.rotation.x = -Math.PI / 2;
floor.position.y = FLOOR_Y;
floor.receiveShadow = true; // Floor receives shadows
scene.add(floor);

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// OrbitControls for user interaction
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2.1;
controls.minDistance = 2;
controls.maxDistance = 15;

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Event listener for window resizing
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// =-=-=-=-=-=-=-=
// Render football
// =-=-=-=-=-=-=-=

let football;

const loadFootball = () => {
  const gltfLoader = new THREE.GLTFLoader();

  gltfLoader.parse(magentaFootball, "", function (gltf) {
    football = gltf.scene;

    football.scale.set(0.5, 0.5, 0.5);
    football.position.y = FLOOR_Y + 4;

    // Enable shadows for the model
    football.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        // node.material.color.set(COLOR_MAGENTA);
      }
    });

    scene.add(football);
  });
};

// =-=-=-=-=-=-=-=-
// Animate function
// =-=-=-=-=-=-=-=-

const animate = () => {
  requestAnimationFrame(animate);

  // Move the light in a circle
  const time = Date.now() * 0.0005;
  pointLight.position.x = Math.sin(time) * 5;
  pointLight.position.z = Math.cos(time) * 5;

  controls.update(); // Required for enableDamping
  // The helper will automatically follow the light!
  lightHelper.update();

  if (football) {
    football.rotation.z += FOOTBALL_SPIRAL_RATE;
  }

  renderer.render(scene, camera);
};

// =-=-=-=
// On load
// =-=-=-=

window.addEventListener("load", () => {
  loadFootball();
  animate();
});
