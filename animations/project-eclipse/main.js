document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  let scrollPosition = 0;

  // Set the canvas size to match CSS dimensions
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  // Handle custom scroll
  window.addEventListener('wheel', (e) => {
    e.preventDefault(); // Prevent the default scroll behavior
    scrollPosition += e.deltaY;
    updateAnimation(scrollPosition);
    console.log(scrollPosition)
  });

  function updateAnimation(scrollPos) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Draw atoms based on the scroll position
    drawAtom(canvas.width * 0.1, canvas.height / 2); // Left atom
    drawAtom(canvas.width * 0.9, canvas.height / 2); // Right atom
  }

  function drawAtom(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI); // Draw a circle for the atom
    ctx.fillStyle = 'blue';
    ctx.fill();
  }

  updateAnimation(0); // Initial draw
});
