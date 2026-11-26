// NusaStat boot: render the first page once the document is ready,
// then let the hash router in views.js take over.
document.addEventListener("DOMContentLoaded", function () {
  render();
  const params = new URLSearchParams(window.location.search);
  if (params.get("shot") === "cover") {
    document.body.classList.add("shot-cover");
  }
});
