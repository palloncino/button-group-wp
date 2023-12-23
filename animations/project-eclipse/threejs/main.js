// Basic Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Sphere setup
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterial1 = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const sphereMaterial2 = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

// Create two spheres
const sphere1 = new THREE.Mesh(sphereGeometry, sphereMaterial1);
const sphere2 = new THREE.Mesh(sphereGeometry, sphereMaterial2);

// Create four additional spheres
const sphere3 = new THREE.Mesh(sphereGeometry, new THREE.MeshStandardMaterial({ color: 0x0000ff }));
const sphere4 = new THREE.Mesh(sphereGeometry, new THREE.MeshStandardMaterial({ color: 0xffff00 }));
const sphere5 = new THREE.Mesh(sphereGeometry, new THREE.MeshStandardMaterial({ color: 0x00ffff }));
const sphere6 = new THREE.Mesh(sphereGeometry, new THREE.MeshStandardMaterial({ color: 0xff00ff }));

sphere3.visible = false;
sphere4.visible = false;
sphere5.visible = false;
sphere6.visible = false;

sphere1.position.set(-2, 2, 0);
sphere2.position.set(2, -2, 0);
sphere3.position.set(0, 0, 0);
sphere4.position.set(0, 0, 0);
sphere5.position.set(0, 0, 0);
sphere6.position.set(0, 0, 0);

scene.add(sphere1);
scene.add(sphere2);
scene.add(sphere3);
scene.add(sphere4);
scene.add(sphere5);
scene.add(sphere6);

// Animation variables
let t = 0;
let phase = "floating"; // "floating", "eclipse", "scatter"

// Scatter phase velocities
let scatterVelocities = [sphere1, sphere2, sphere3, sphere4, sphere5, sphere6].map(() => ({
  x: (Math.random() - 0.5) * 0.1,
  y: (Math.random() - 0.5) * 0.1,
}));

// Easing function
function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}

// Floating phase
function floatingPhase(sphere) {
  sphere.position.x += (Math.random() - 0.5) * 0.01;
  sphere.position.y += (Math.random() - 0.5) * 0.01;
}

// Eclipse phase
function eclipsePhase(sphere, initialPosition) {
  t += 0.005; // Adjust speed
  if (t > 1) t = 1;

  // Calculate eased progress
  let progress = easeOutCubic(t);

  // Move spheres to center
  sphere.position.x = THREE.MathUtils.lerp(initialPosition.x, 0, progress);
  sphere.position.y = THREE.MathUtils.lerp(initialPosition.y, 0, progress);
}

// Target positions for each sphere
const targets = [
  { x: -1, y: 2.5 }, // red
  { x: 1, y: 2.5 }, // green
  { x: 2, y: 1 }, // blue
  { x: 1, y: -1 }, // yellow
  { x: -1, y: -1 }, // aqua
  { x: -2, y: 1 }, // pink
];

// Function to move sphere towards a target
function moveToTarget(sphere, target, velocity) {
  const dx = target.x - sphere.position.x;
  const dy = target.y - sphere.position.y;

  // Check if the sphere is close to the target
  if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
    sphere.position.x += Math.sign(dx) * Math.min(Math.abs(velocity.x), Math.abs(dx));
    sphere.position.y += Math.sign(dy) * Math.min(Math.abs(velocity.y), Math.abs(dy));
  } else {
    // Sphere is close enough to the target
    sphere.position.x = target.x;
    sphere.position.y = target.y;
  }
}

// Click event listener
renderer.domElement.addEventListener("click", () => {
  if (phase === "floating") {
    phase = "eclipse";
    t = 0; // Reset animation time
  } else if (phase === "eclipse") {
    phase = "scatter";
    // Make additional spheres visible
    sphere3.visible = true;
    sphere4.visible = true;
    sphere5.visible = true;
    sphere6.visible = true;
    // Reset positions for scatter
    [sphere1, sphere2, sphere3, sphere4, sphere5, sphere6].forEach((sphere) => sphere.position.set(0, 0, 0));
  }
});

// Define bounds
const bounds = {
  minX: -2,
  maxX: 2,
  minY: -2,
  maxY: 2,
};

// Scatter phase with bounds
function scatterPhase(sphere, velocity) {
  let nextX = sphere.position.x + velocity.x;
  let nextY = sphere.position.y + velocity.y;

  // Check horizontal bounds
  if (nextX < bounds.minX || nextX > bounds.maxX) {
    velocity.x = -velocity.x; // Reverse direction
    nextX = sphere.position.x + velocity.x; // Recalculate next position
  }

  // Check vertical bounds
  if (nextY < bounds.minY || nextY > bounds.maxY) {
    velocity.y = -velocity.y; // Reverse direction
    nextY = sphere.position.y + velocity.y; // Recalculate next position
  }

  // Update position
  sphere.position.x = nextX;
  sphere.position.y = nextY;
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  if (phase === "floating") {
    // Apply floating movement to all spheres
    [sphere1, sphere2, sphere3, sphere4, sphere5, sphere6].forEach((sphere) => {
      floatingPhase(sphere);
    });
  } else if (phase === "eclipse") {
    // Only first two spheres move to form the eclipse
    eclipsePhase(sphere1, new THREE.Vector3(-2, 2, 0));
    eclipsePhase(sphere2, new THREE.Vector3(2, -2, 0));

    // Additional spheres remain at the center
    [sphere3, sphere4, sphere5, sphere6].forEach((sphere) => {
      sphere.position.set(0, 0, 0);
    });
  } else if (phase === "scatter") {
    // Move each sphere towards its target
    [sphere1, sphere2, sphere3, sphere4, sphere5, sphere6].forEach((sphere, index) => {
      moveToTarget(sphere, targets[index], scatterVelocities[index]);
    });
  }

  renderer.render(scene, camera);
}

animate();
