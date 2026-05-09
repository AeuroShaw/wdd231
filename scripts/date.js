const yearSpan = document.getElementById('copyright-year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}
const lastModifiedEl = document.getElementById('lastModified');
if (lastModifiedEl) {
  lastModifiedEl.textContent = `Last Modified: ${document.lastModified}`;
}
