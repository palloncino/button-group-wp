// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Sphere Creation
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterials = [
  new THREE.MeshStandardMaterial({ color: 0xff0000 }), // red
  new THREE.MeshStandardMaterial({ color: 0x00ff00 }), // green
  new THREE.MeshStandardMaterial({ color: 0x0000ff }), // blue
  new THREE.MeshStandardMaterial({ color: 0xffff00 }), // yellow
  new THREE.MeshStandardMaterial({ color: 0x00ffff }), // aqua
  new THREE.MeshStandardMaterial({ color: 0xff00ff }), // pink
];

const spheres = sphereMaterials.map((material) => new THREE.Mesh(sphereGeometry, material));
spheres.forEach((sphere, index) => {
  sphere.visible = index < 2; // Only the first two spheres are initially visible
  scene.add(sphere);
});

// Initial Positions
const initialPositions = [
  { x: -2, y: 2, z: 0 }, // red
  { x: 2, y: -2, z: 0 }, // green
  { x: 0, y: 0, z: 0 }, // blue
  { x: 0, y: 0, z: 0 }, // yellow
  { x: 0, y: 0, z: 0 }, // aqua
  { x: 0, y: 0, z: 0 }, // pink
];

spheres.forEach((sphere, index) => {
  sphere.position.set(initialPositions[index]?.x || 0, initialPositions[index]?.y || 0, 0);
});

// Animation Variables
const movementDuration = 5; // seconds
const frameRate = 60; // frames per second
let animationTime = 0;
let phase = "floating"; // "floating", "eclipse", "scatter"
let scatterStartTime;

// Easing Function
function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}

function easeOutExpo(x) {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

// Ellipse Parameters
const ellipseXRadius = 0.5; // Radius of ellipse along the x-axis
const ellipseYRadius = 0.25; // Radius of ellipse along the y-axis
const ellipseSpeed = 0.05; // Speed of movement along the ellipse

function floatingPhase(sphere, index) {
  let time = frameCount * ellipseSpeed;
  sphere.position.x = initialPositions[index].x + ellipseXRadius * Math.cos(time);
  sphere.position.y = initialPositions[index].y + ellipseYRadius * Math.sin(time);
}

function eclipsePhase(sphere, initialPosition) {
  animationTime += 0.002; // Slower increment
  if (animationTime > 1) animationTime = 1;

  let progress = easeOutExpo(animationTime);
  sphere.position.x = THREE.MathUtils.lerp(initialPosition.x, 0, progress);
  sphere.position.y = THREE.MathUtils.lerp(initialPosition.y, 0, progress);
}

// Target positions for each sphere
const targets = [
  { x: -1, y: 2 }, // red
  { x: 1, y: 2 }, // green
  { x: 2, y: 0 }, // blue
  { x: 1, y: -2 }, // yellow
  { x: -1, y: -2 }, // aqua
  { x: -2, y: 0 }, // pink
];

function moveToTarget(sphere, target, startTime, currentTime) {
  const duration = movementDuration * 1000; // Convert to milliseconds
  let timeElapsed = currentTime - startTime;
  if (timeElapsed > duration) timeElapsed = duration;

  let progress = easeOutExpo(timeElapsed / duration);
  sphere.position.x = THREE.MathUtils.lerp(sphere.position.x, target.x, progress);
  sphere.position.y = THREE.MathUtils.lerp(sphere.position.y, target.y, progress);
}

// Event Listener for Phase Transition
renderer.domElement.addEventListener("click", () => {
  if (phase === "floating") {
    phase = "eclipse";
    animationTime = 0;

    // Update initialPositions to current position
    spheres.forEach((sphere, index) => {
      initialPositions[index] = { x: sphere.position.x, y: sphere.position.y, z: sphere.position.z };
    });
  } else if (phase === "eclipse") {
    phase = "scatter";
    scatterStartTime = Date.now();
    spheres.forEach((sphere) => (sphere.visible = true));
  }
});

let frameCount = 0; // Initialize frameCount

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  frameCount++;

  let currentTime = Date.now();
  spheres.forEach((sphere, index) => {
    if (phase === "floating") floatingPhase(sphere, index);
    else if (phase === "eclipse") eclipsePhase(sphere, initialPositions[index] || { x: 0, y: 0, z: 0 });
    else if (phase === "scatter") moveToTarget(sphere, targets[index], scatterStartTime, currentTime);
  });

  renderer.render(scene, camera);
}

animate();
