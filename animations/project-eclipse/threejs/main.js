// Basic Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Sphere setup
const sphereGeometry = new THREE.SphereGeometry(.5, 32, 32);
const sphereMaterial1 = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const sphereMaterial2 = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

// Create two spheres
const sphere1 = new THREE.Mesh(sphereGeometry, sphereMaterial1);
const sphere2 = new THREE.Mesh(sphereGeometry, sphereMaterial2);

// Set initial positions off-screen
sphere1.position.x = -window.innerWidth / 2; 
sphere2.position.x = window.innerWidth / 2;  

scene.add(sphere1);
scene.add(sphere2);

// Add light
const pointLight = new THREE.PointLight(0xFFFFFF, 1, 100);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Camera position
camera.position.z = 5;

// Animation variables
let t = 0; 

// Easing function for smooth animation
function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    t += 0.005; // Adjust speed
    if (t > 1) t = 1;

    // Calculate eased progress
    let progress = easeOutCubic(t);

    // Move spheres
    sphere1.position.x = THREE.MathUtils.lerp(-window.innerWidth / 2, 0, progress);
    sphere2.position.x = THREE.MathUtils.lerp(window.innerWidth / 2, 0, progress);

    renderer.render(scene, camera);
}

animate();
