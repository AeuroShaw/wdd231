const menuBtn = document.getElementById('menu-btn');
const mainNav = document.getElementById('main-nav');
if (menuBtn && mainNav) {
  menuBtn.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', isOpen.toString());
    menuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Open menu');
    });
  });
}
