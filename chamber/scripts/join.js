/* ============================================================
   Ibadan Chamber – join.js
   Handles: timestamp injection, JS form validation,
            modal open/close, apply-from-modal pre-selection
   Nav/footer handled by shared.js
   ============================================================ */
'use strict';

// ── TIMESTAMP ────────────────────────────────────────────────
const tsField = document.getElementById('timestamp');
if (tsField) {
  tsField.value = new Date().toLocaleString('en-NG', {
    dateStyle: 'full',
    timeStyle: 'short',
  });
}

// ── FORM VALIDATION ──────────────────────────────────────────
// Native HTML5 `required` handles most browsers, but this JS layer
// catches edge cases (especially <select> on Safari/iOS) and gives
// clear visible error messages on each invalid field.
const form             = document.getElementById('join-form');
const membershipSelect = document.getElementById('membership');

function showError(input, message) {
  // Mark input invalid visually
  input.setAttribute('aria-invalid', 'true');
  let err = input.parentElement.querySelector('.field-error');
  if (!err) {
    err = document.createElement('span');
    err.className   = 'field-error';
    err.setAttribute('role', 'alert');
    // Insert after the input (or after the .field-hint if present)
    const hint = input.parentElement.querySelector('.field-hint');
    if (hint) hint.after(err);
    else       input.after(err);
  }
  err.textContent = message;
}

function clearError(input) {
  input.removeAttribute('aria-invalid');
  const err = input.parentElement.querySelector('.field-error');
  if (err) err.remove();
}

function validateForm(e) {
  let firstInvalid = null;

  // Check every required field
  form.querySelectorAll('[required]').forEach(field => {
    const val = field.value.trim();
    if (!val || (field.tagName === 'SELECT' && !val)) {
      e.preventDefault();
      const label = field.closest('label')?.firstChild?.textContent?.trim().replace('*','').trim() || 'This field';
      showError(field, `${label} is required.`);
      if (!firstInvalid) firstInvalid = field;
    } else {
      clearError(field);
    }
  });

  // Extra: validate org-title pattern if filled in
  const orgTitle = document.getElementById('org-title');
  if (orgTitle && orgTitle.value.trim()) {
    if (!/^[A-Za-z\- ]{7,}$/.test(orgTitle.value.trim())) {
      e.preventDefault();
      showError(orgTitle, 'Use letters, hyphens, and spaces only — minimum 7 characters.');
      if (!firstInvalid) firstInvalid = orgTitle;
    } else {
      clearError(orgTitle);
    }
  }

  // Validate email format
  const emailField = document.getElementById('email');
  if (emailField && emailField.value.trim()) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim())) {
      e.preventDefault();
      showError(emailField, 'Please enter a valid email address.');
      if (!firstInvalid) firstInvalid = emailField;
    }
  }

  // Focus first invalid field for accessibility
  if (firstInvalid) {
    firstInvalid.focus();
  }
}

form?.addEventListener('submit', validateForm);

// Clear error on input so feedback is immediate
form?.querySelectorAll('input, select, textarea').forEach(field => {
  field.addEventListener('input', () => clearError(field));
  field.addEventListener('change', () => clearError(field));
});

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
