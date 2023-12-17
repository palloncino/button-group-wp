document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  let scrollPosition = 0;

  const MAX_SCROLL_POSITION = 1000; // Define the maximum scroll value

  // Set the canvas size to match CSS dimensions
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  drawAtom(canvas.width * 0.1, canvas.height / 2); // Left atom
  drawAtom(canvas.width * 0.9, canvas.height / 2); // Right atom

  // Handle custom scroll
  window.addEventListener("wheel", (e) => {
    e.preventDefault(); // Prevent the default scroll behavior
    scrollPosition += e.deltaY;
    scrollPosition = Math.min(Math.max(scrollPosition, 0), MAX_SCROLL_POSITION);
    updateAnimation(scrollPosition);
    console.log(scrollPosition);
  });

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
  }

  function phase2Animation(scrollPos) {
    console.log("phase2Animation", { scrollPos });
  }

  function phase3Animation(scrollPos) {
    console.log("phase3Animation", { scrollPos });
  }

  updateAnimation(0); // Initial draw
});
