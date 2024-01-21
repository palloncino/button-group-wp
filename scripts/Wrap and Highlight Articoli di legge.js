document.addEventListener('DOMContentLoaded', (event) => {
  // Function to wrap an element in a div with a specific class
  function wrapInClassDiv(element, className) {
      const wrapperDiv = document.createElement('div');
      wrapperDiv.classList.add(className);
      element.parentNode.insertBefore(wrapperDiv, element);
      wrapperDiv.appendChild(element);
  }

  // Function to find and wrap elements with a specific class
  function highlightElements() {
      const elements = document.querySelectorAll('.articolo-di-legge');
      elements.forEach(element => {
          wrapInClassDiv(element, 'articolo-di-legge-container');
      });
  }

  // Run the highlight function
  highlightElements();
});
