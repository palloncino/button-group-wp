document.addEventListener("DOMContentLoaded", () => {
  const THROTTLE_WHEEL_MS = 50;
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  let scrollPosition = 1;

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  let centerX = canvas.width / 2; // Center X position
  let atom1InitialX = canvas.width * 0.1; // Starting X for atom1 aligned with the initial drawing position
  let atom2InitialX = canvas.width * 0.9; // Starting X for atom2 aligned with the initial drawing position
  const MAX_SCROLL_POSITION = 1000; // Define the maximum scroll value
  const maxScrollPhase1 = 300;

  // Define drawAtom function here to ensure it has access to ctx
  function drawAtom(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI); // Draw a circle for the atom
    ctx.fillStyle = "blue";
    ctx.fill();
  }

  // Initial draw
  drawAtom(atom1InitialX, canvas.height / 2); // Left atom
  drawAtom(atom2InitialX, canvas.height / 2); // Right atom

  // Define your phase functions here
  function phase1Animation(scrollPos) {
    console.log("phase1Animation", { scrollPos });
    let progress = scrollPos / maxScrollPhase1;
    progress = Math.min(progress, 1); // Cap progress to 1

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate new positions based on scroll progress
    // Atom 1 moves from left to center
    let atom1NewX = atom1InitialX + (centerX - atom1InitialX) * progress;
    // Atom 2 moves from right to center
    let atom2NewX = atom2InitialX - (atom2InitialX - centerX) * progress;

    // Redraw the atoms at the new positions
    drawAtom(atom1NewX, canvas.height / 2);
    drawAtom(atom2NewX, canvas.height / 2);
  }

  function phase2Animation(scrollPos) {
    console.log("phase2Animation", { scrollPos });
  }

  function phase3Animation(scrollPos) {
    console.log("phase3Animation", { scrollPos });
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
