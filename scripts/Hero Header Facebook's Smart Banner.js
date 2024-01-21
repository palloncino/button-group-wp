document.addEventListener("DOMContentLoaded", function () {
  var heroHeaders = document.getElementsByClassName("hero-container");

  // Check if elements were found
  if (heroHeaders.length > 0) {
    var bannerHtml =
      '<div class="facebook-banner" onclick="window.open("http://example.com", "_blank");">' +
      '<div class="fb-icon"><img src="http://apsproncegno.chebellagiornata.it/wp-content/uploads/2024/01/thumb-up.png" alt="Facebook Like"></div>' +
      '<div class="fb-text">Seguici su<br>Facebook</div>' +
      "</div>";

    // Assuming you want to add the banner to the first found element
    heroHeaders[0].insertAdjacentHTML("beforeend", bannerHtml);
  } else {
    console.log("No elements with class 'hero-container' were found.");
  }
});