// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 1);
document.body.appendChild(renderer.domElement);

let currentBgColor = new THREE.Color(0xffffff); // Starting color: white

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// https://threejs.org/examples/fonts/helvetiker_regular.typeface.json
const loader = new THREE.FontLoader();
const radius = 1.5;
const orbitRadius = 0.7;
const textString = "Text"; // Replace with your desired text
const characters = textString.split("");
const totalAngle = Math.PI; // Use half a circle (180 degrees) or less for tighter grouping
const angleStep = totalAngle / characters.length;

loader.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", function (font) {
  const textHeight = 0.05; // Height of the text
  const textDistanceFromSphere = 0.6; // Distance above the sphere surface

  spheres.forEach((sphere, index) => {
    const textGeometry = new THREE.TextGeometry("Text " + (index + 1), {
      // Replace with your text
      font: font,
      size: 0.2,
      height: textHeight,
    });

    const textMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    // Position the text above the sphere
    textMesh.position.y = sphere.geometry.parameters.radius + textDistanceFromSphere;

    // Rotate the text to face the camera
    textMesh.lookAt(camera.position);

    // Slightly tilt the text to match the curvature of the sphere
    textMesh.rotation.x -= Math.PI / 15; // Adjust this value to match the curvature

    // Attach the text mesh to the sphere
    sphere.add(textMesh);
  });
});

function onMouseMove(event) {
  // Calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

window.addEventListener("mousemove", onMouseMove, false);

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
const ellipseSpeed = 0.01; // Reduced speed for slower movement

function floatingPhase(sphere, index) {
  let time = frameCount * ellipseSpeed;

  // Check if the sphere is the first one (red ball)
  if (index === 0) {
    // Rotate in the opposite direction for the red ball
    sphere.position.x = initialPositions[index].x + ellipseXRadius * Math.cos(-time);
    sphere.position.y = initialPositions[index].y + ellipseYRadius * Math.sin(-time);
  } else {
    // Original rotation direction for other spheres
    sphere.position.x = initialPositions[index].x + ellipseXRadius * Math.cos(time);
    sphere.position.y = initialPositions[index].y + ellipseYRadius * Math.sin(time);
  }
}

function eclipsePhase(sphere, initialPosition) {
  animationTime += 0.001; // Slower increment
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

function animate() {
  requestAnimationFrame(animate);
  frameCount++;

  let currentTime = Date.now();

  // Update the raycaster with the current mouse position
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the picking ray
  const intersects = phase === "scatter" ? raycaster.intersectObjects(spheres) : [];

  spheres.forEach((sphere, index) => {
    // Handle sphere movement based on phase
    if (phase === "floating") {
      floatingPhase(sphere, index);
      setSphereTextVisibility(sphere, false); // Hide text during floating
    } else if (phase === "eclipse") {
      eclipsePhase(sphere, initialPositions[index] || { x: 0, y: 0, z: 0 });
      setSphereTextVisibility(sphere, false); // Hide text during eclipse
      let progress = Math.min(animationTime / movementDuration, 1); // Ensure progress is between 0 and 1
      currentBgColor.lerp(new THREE.Color(0x000000), progress); // Interpolate towards black
      renderer.setClearColor(currentBgColor);
    } else if (phase === "scatter") {
      moveToTarget(sphere, targets[index], scatterStartTime, currentTime);
      setSphereTextVisibility(sphere, true); // Show text during scatter
    }

    // Scale spheres on hover only in the scatter phase
    if (phase === "scatter") {
      if (intersects.length > 0 && intersects[0].object === sphere) {
        // Scale up the hovered sphere
        sphere.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
      } else {
        // Scale down the non-hovered spheres
        sphere.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  renderer.render(scene, camera);
}

function setSphereTextVisibility(sphere, isVisible) {
  sphere.children.forEach((child) => {
    if (child instanceof THREE.Mesh && child.geometry instanceof THREE.TextGeometry) {
      child.visible = isVisible;
    }
  });
}

animate();
