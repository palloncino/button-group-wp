window.addEventListener("DOMContentLoaded", function () {
  var isDesktop = window.innerWidth >= 1024;

  function updateStickyContent() {
    window.requestAnimationFrame(function () {
      var headerHeight = document.querySelector(
        "#Hero_Header_HTML_Row"
      ).offsetHeight;

      var CentralSection = document.querySelector("#Central_Section_001");
      var ColumnLeft = document.querySelector("#Sticky_Content_001");
      var ColumnRight = document.querySelector("#Sticky_Postit_Container");

      var CentralSectionHeight = CentralSection.scrollHeight;
      var ColumnLeftHeight = ColumnLeft.offsetHeight;
      var ColumnRightHeight = ColumnRight.offsetHeight;

      var stickyStartPoint = headerHeight;

      var endScrollColumnLeft =
        headerHeight + CentralSectionHeight - ColumnLeftHeight - 20;
      var endScrollColumnRight =
        headerHeight + CentralSectionHeight - ColumnRightHeight - 20;

      if (window.scrollY > endScrollColumnLeft) {
        ColumnLeft.style.position = "relative";
        ColumnLeft.style.top = `${endScrollColumnLeft - stickyStartPoint}px`;
      } else if (window.scrollY > stickyStartPoint) {
        ColumnLeft.style.position = "relative";
        ColumnLeft.style.top = `${window.scrollY - stickyStartPoint}px`;
      } else {
        ColumnLeft.style.position = "sticky";
        ColumnLeft.style.top = `${headerHeight}px`;
      }

      if (window.scrollY > endScrollColumnRight) {
        ColumnRight.style.position = "relative";
        ColumnRight.style.top = `${endScrollColumnRight - stickyStartPoint}px`;
      } else if (window.scrollY > stickyStartPoint) {
        ColumnRight.style.position = "relative";
        ColumnRight.style.top = `${window.scrollY - stickyStartPoint}px`;
      } else {
        ColumnRight.style.position = "sticky";
        ColumnRight.style.top = `${headerHeight}px`;
      }
    });
  }

  if (isDesktop) {
    window.addEventListener("scroll", updateStickyContent);
  }

  var buttonOuters = document.querySelectorAll(".side-button-outer");

  buttonOuters.forEach(function (buttonOuter) {
    var cursorIcon = buttonOuter.querySelector(".animate-svg");

    buttonOuter.addEventListener("mouseenter", function () {
      cursorIcon.classList.add("clickIn");
      cursorIcon.classList.remove("clickOut");
    });

    buttonOuter.addEventListener("mouseleave", function () {
      cursorIcon.classList.remove("clickIn");
      cursorIcon.classList.add("clickOut");
    });
  });
});
