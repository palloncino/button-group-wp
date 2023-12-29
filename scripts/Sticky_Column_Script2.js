window.addEventListener("DOMContentLoaded", function () {
  var isDesktop = window.innerWidth >= 1024;
  if (!isDesktop) return;

  var header = document.querySelector("#Hero_Header_HTML_Row");
  var CentralSection = document.querySelector("#Central_Section_001");
  var ColumnLeft = document.querySelector("#Sticky_Content_001");
  var ColumnRight = document.querySelector("#Sticky_Postit_Container");

  var originalLeftWidth = ColumnLeft ? ColumnLeft.offsetWidth + 'px' : 'auto';
  var originalRightWidth = ColumnRight ? ColumnRight.offsetWidth + 'px' : 'auto';

  function updateStickyColumns() {
    window.requestAnimationFrame(function () {
      var headerHeight = header.offsetHeight;
      var stickyStartPoint = headerHeight + 20; // 20px before columns touch the top of the viewport

      var centralSectionRect = CentralSection.getBoundingClientRect();
      var centralSectionBottom = centralSectionRect.bottom + window.scrollY;

      var leftColumnStopPoint = centralSectionBottom - (ColumnLeft ? ColumnLeft.offsetHeight : 0);
      var rightColumnStopPoint = centralSectionBottom - (ColumnRight ? ColumnRight.offsetHeight : 0);

      // Update for ColumnLeft
      if (ColumnLeft) {
        if (window.scrollY > stickyStartPoint && window.scrollY < leftColumnStopPoint) {
          ColumnLeft.style.position = "fixed";
          ColumnLeft.style.top = "20px";
          ColumnLeft.style.width = originalLeftWidth; // Apply the original width
        } else if (window.scrollY >= leftColumnStopPoint) {
          ColumnLeft.style.position = "absolute";
          ColumnLeft.style.top = `${leftColumnStopPoint - headerHeight}px`;
          ColumnLeft.style.width = originalLeftWidth; // Apply the original width
        } else {
          ColumnLeft.style.position = "static";
          ColumnLeft.style.width = 'auto'; // Reset the width
        }
      }

      // Update for ColumnRight
      if (ColumnRight) {
        if (window.scrollY > stickyStartPoint && window.scrollY < rightColumnStopPoint) {
          ColumnRight.style.position = "fixed";
          ColumnRight.style.top = "20px";
          ColumnRight.style.width = originalRightWidth; // Apply the original width
        } else if (window.scrollY >= rightColumnStopPoint) {
          ColumnRight.style.position = "absolute";
          ColumnRight.style.top = `${rightColumnStopPoint - headerHeight}px`;
          ColumnRight.style.width = originalRightWidth; // Apply the original width
        } else {
          ColumnRight.style.position = "static";
          ColumnRight.style.width = 'auto'; // Reset the width
        }
      }
    });
  }

  window.addEventListener("scroll", updateStickyColumns);
});
