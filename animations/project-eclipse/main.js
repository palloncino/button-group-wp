document.addEventListener("DOMContentLoaded", () => {
  const THROTTLE_WHEEL_MS = 50;
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  let scrollPosition = 1;

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  let atom1InitialX = canvas.width * 0.1; // Starting X for atom1 aligned with the initial drawing position
  let atom2InitialX = canvas.width * 0.9; // Starting X for atom2 aligned with the initial drawing position

  let centerX = canvas.width / 2; // Center X position
  let atoms = [
    { x: atom1InitialX, y: canvas.height / 2, color: 'green' },
    { x: atom2InitialX, y: canvas.height / 2, color: 'blue' },
    // Additional atoms for phase 2
    { x: centerX, y: canvas.height / 2, color: 'red' },
    { x: centerX, y: canvas.height / 2, color: 'orange' },
    { x: centerX, y: canvas.height / 2, color: 'yellow' },
    { x: centerX, y: canvas.height / 2, color: 'purple' },
  ];

  const MAX_SCROLL_POSITION = 1000; // Define the maximum scroll value
  const maxScrollPhase1 = 333;
  const maxScrollPhase2 = 666;
  const maxScrollPhase3 = 999;

  function drawSpecificAtoms(atomsToDraw) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    atomsToDraw.forEach((atom) => drawAtom(atom.x, atom.y, atom.color));
  }

  // Define drawAtom function here to ensure it has access to ctx
  function drawAtom(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI); // Draw a circle for the atom
    ctx.fillStyle = color;
    ctx.fill();
  }

  // Initial draw
  drawSpecificAtoms(atoms.slice(0, 2));

  // +-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -+
  // | ACTION                                             |
  // +-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -+
  function phase1Animation(scrollPos) {
    let progress = scrollPos / maxScrollPhase1;
    progress = Math.min(progress, 1);

    // Update positions of the first two atoms
    atoms[0].x = atom1InitialX + (centerX - atom1InitialX) * progress;
    atoms[1].x = atom2InitialX - (atom2InitialX - centerX) * progress;

    drawSpecificAtoms(atoms.slice(0, 2));
  }

  function phase2Animation(scrollPos) {
    console.log("Phase 2", scrollPos);
    let progress = (scrollPos - maxScrollPhase1) / (maxScrollPhase2 - maxScrollPhase1);
    progress = Math.min(progress, 1);

    // Apply an easing function for acceleration and deceleration
    // Example: Ease out effect
    let easedProgress = 1 - Math.pow(1 - progress, 2);

    let hexagonVertices = getHexagonVertices(centerX, canvas.height / 2, 250);

    // Start from the center and interpolate towards the hexagon vertices
    for (let i = 2; i < hexagonVertices.length + 2; i++) {
      if (atoms[i]) {
        let targetX = hexagonVertices[i - 2].x;
        let targetY = hexagonVertices[i - 2].y;

        atoms[i].x = centerX + (targetX - centerX) * easedProgress;
        atoms[i].y = canvas.height / 2 + (targetY - canvas.height / 2) * easedProgress;
      }
    }

    drawSpecificAtoms(atoms);
  }

  function phase3Animation(scrollPos) {
    console.log("Phase 3", scrollPos);
  }

  function updateAnimation(scrollPos) {
    const scrollPercent = (scrollPos / MAX_SCROLL_POSITION) * 100;
    if (scrollPercent <= 33) {
      phase1Animation(scrollPos);
    } else if (scrollPercent <= 66) {
      phase2Animation(scrollPos);
    } else {
      phase3Animation(scrollPos);
    }
  }

  function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function () {
      const context = this;
      const args = arguments;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function () {
          if (Date.now() - lastRan >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }

  function getHexagonVertices(centerX, centerY, radius, sides = 6) {
    let vertices = [];
    for (let i = 0; i < sides; i++) {
      let angle = (Math.PI / 3) * i; // 60 degrees for hexagon
      let x = centerX + radius * Math.cos(angle);
      let y = centerY + radius * Math.sin(angle);
      vertices.push({ x, y });
    }
    return vertices;
  }

  // Define throttledUpdate inside the DOMContentLoaded
  const throttledUpdate = throttle((e) => {
    e.preventDefault();
    scrollPosition += e.deltaY;
    scrollPosition = Math.max(0, Math.min(scrollPosition, MAX_SCROLL_POSITION));
    updateAnimation(scrollPosition);
  }, THROTTLE_WHEEL_MS);

  // Attach the wheel event listener inside the DOMContentLoaded
  window.addEventListener("wheel", throttledUpdate, { passive: false });
});
