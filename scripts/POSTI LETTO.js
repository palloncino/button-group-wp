// MODIFICA VALORE QUI
const POSTI_LETTO = 0;

document.addEventListener("DOMContentLoaded", function () {
  var element = document.getElementById("postit-vacancies-central-value");
  if (element) {
    // Fade out, change content, and fade in
    element.style.opacity = 0;
    setTimeout(function () {
      element.textContent = POSTI_LETTO;
      element.style.opacity = 1;
    }, 500); // Adjust timing as needed
  }
});
