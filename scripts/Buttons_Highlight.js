window.addEventListener("DOMContentLoaded", function () {
  var buttonOuters = document.querySelectorAll(".side-button-outer");

  // Function to add 'selected-button' class based on URL
  function highlightButtonBasedOnURL() {
    var currentPath = window.location.pathname;
    buttonOuters.forEach(function (buttonOuter) {
      // Get the second class name of the button
      var buttonClass = buttonOuter.classList[1];
      if (currentPath.includes(buttonClass)) {
        buttonOuter.classList.add("selected-button");
      }
    });
  }

  buttonOuters.forEach(function (buttonOuter) {
    var cursorIcon = buttonOuter.querySelector(".animate-svg");

    buttonOuter.addEventListener("mouseenter", function () {
      cursorIcon.classList.remove("clickOut");
    });

    buttonOuter.addEventListener("mouseleave", function () {
      cursorIcon.classList.add("clickOut");
    });
  });

  // Call the function to highlight the button
  highlightButtonBasedOnURL();
});
