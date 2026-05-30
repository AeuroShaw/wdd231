/* ============================================================
   Ibadan Chamber – thankyou.js
   Reads GET params from the form submission and renders
   required fields in the summary list on thankyou.html.
   ============================================================ */
'use strict';

const MEMBERSHIP_LABELS = {
  np:     'NP Membership (Non-Profit, Free)',
  bronze: 'Bronze Membership',
  silver: 'Silver Membership',
  gold:   'Gold Membership',
};

function formatTimestamp(raw) {
  if (!raw) return '—';
  // The timestamp was stored as a locale string; return as-is
  return decodeURIComponent(raw);
}

function toTitleCase(str) {
  if (!str) return '—';
  return decodeURIComponent(str)
    .replace(/\+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function displaySummary() {
  const list = document.getElementById('summary-list');
  if (!list) return;

  const params = new URLSearchParams(window.location.search);

  // Required fields to display
  const fields = [
    { dt: 'First Name',       value: toTitleCase(params.get('fname')) },
    { dt: 'Last Name',        value: toTitleCase(params.get('lname')) },
    { dt: 'Email',            value: decodeURIComponent(params.get('email') || '—').replace(/\+/g,' ') },
    { dt: 'Mobile Phone',     value: decodeURIComponent(params.get('phone') || '—').replace(/\+/g,' ') },
    { dt: 'Organisation',     value: toTitleCase(params.get('org-name')) },
    { dt: 'Membership Level', value: MEMBERSHIP_LABELS[params.get('membership')] || params.get('membership') || '—' },
    { dt: 'Application Date', value: formatTimestamp(params.get('timestamp')) },
  ];

  // If no params at all, show a fallback message
  if (!params.has('fname')) {
    list.innerHTML = '<dd style="grid-column:1/-1;color:var(--ink-muted);">No application data found. Please fill in the form first.</dd>';
    return;
  }

  list.innerHTML = fields.map(f => `
    <dt>${f.dt}</dt>
    <dd>${f.value || '—'}</dd>
  `).join('');
}

displaySummary();
