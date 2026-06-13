// scripts/thankyou.js
// Reads query-string params from the form and displays them

import { initNav } from './shared.js';

initNav();

const params = new URLSearchParams(window.location.search);
const tbody  = document.getElementById('form-data');

const labels = {
  name:     'Full Name',
  email:    'Email Address',
  subject:  'Subject',
  referral: 'How You Found Us',
  message:  'Message'
};

if (tbody) {
  const rows = Object.entries(labels)
    .filter(([k]) => params.has(k))
    .map(([k, label]) => `
      <tr>
        <td><strong>${label}</strong></td>
        <td>${params.get(k) || '—'}</td>
      </tr>`)
    .join('');

  tbody.innerHTML = rows || '<tr><td colspan="2">No submission data found.</td></tr>';
}
