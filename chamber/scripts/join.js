/* ============================================================
   Ibadan Chamber – join.js
   Handles: timestamp injection, modal open/close/keyboard,
            apply-from-modal pre-selection, reduced-motion check
   ============================================================ */
'use strict';

// ── TIMESTAMP ────────────────────────────────────────────────
// Inject current date+time into the hidden field when the page loads
const tsField = document.getElementById('timestamp');
if (tsField) {
  tsField.value = new Date().toLocaleString('en-NG', {
    dateStyle: 'full',
    timeStyle: 'short',
  });
}

// ── MEMBERSHIP SELECT ─────────────────────────────────────────
const membershipSelect = document.getElementById('membership');

// ── MODAL LOGIC ───────────────────────────────────────────────
const openBtns  = document.querySelectorAll('.mem-info-btn');
const closeBtns = document.querySelectorAll('.modal-close');
const applyBtns = document.querySelectorAll('.modal-apply-btn');

// Open: each "Learn More" button targets its data-modal id
openBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const modal = document.getElementById(btn.dataset.modal);
    if (modal) modal.showModal();
  });
});

// Close X button
closeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('dialog')?.close();
  });
});

// Close by clicking backdrop (outside the modal-inner)
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.addEventListener('click', e => {
    // If the click target is the <dialog> itself (the backdrop), close it
    if (e.target === dialog) dialog.close();
  });

  // ESC already handled natively by <dialog>
});

// "Apply for X Membership" button inside modal:
// pre-selects the level in the form's <select> and closes the modal
applyBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const level = btn.dataset.level;
    if (membershipSelect && level) {
      membershipSelect.value = level;
      // Smooth scroll to the form
      membershipSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
      membershipSelect.focus();
    }
    btn.closest('dialog')?.close();
  });
});

// ── REDUCED MOTION: disable card animations if user prefers ──
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.mem-card').forEach(card => {
    card.style.animation = 'none';
    card.style.opacity   = '1';
  });
}
