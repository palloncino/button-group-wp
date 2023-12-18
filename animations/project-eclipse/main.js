document.addEventListener("DOMContentLoaded", () => {
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

  drawAtom(atom1InitialX, canvas.height / 2); // Left atom
  drawAtom(atom2InitialX, canvas.height / 2); // Right atom

  window.addEventListener("wheel", (e) => {
    e.preventDefault();
    scrollPosition += e.deltaY;
    scrollPosition = Math.max(0, Math.min(scrollPosition, MAX_SCROLL_POSITION));
    updateAnimation(scrollPosition);
  }, { passive: false });

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

  function drawAtom(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI); // Draw a circle for the atom
    ctx.fillStyle = "blue";
    ctx.fill();
  }

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

  updateAnimation(0); // Initial draw
});
