// scripts/join.js
// Join/Contact page

import { initNav } from './shared.js';

initNav();

// Basic client-side validation feedback
const form = document.getElementById('join-form');
if (form) {
  form.addEventListener('submit', e => {
    const name    = form.querySelector('#name').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      e.preventDefault();
      alert('Please fill in all required fields before submitting.');
    }
  });
}
