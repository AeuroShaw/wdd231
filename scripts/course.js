const courses = [
  { subject: 'CSE', number: 110, title: 'Introduction to Programming', credits: 2, certificate: 'Web and Computer Programming', description: 'This course will introduce students to programming.', completed: true },
  { subject: 'WDD', number: 130, title: 'Web Fundamentals', credits: 2, certificate: 'Web and Computer Programming', description: 'This course introduces students to the World Wide Web.', completed: true },
  { subject: 'CSE', number: 111, title: 'Programming with Functions', credits: 2, certificate: 'Web and Computer Programming', description: 'Emphasizes writing functions to solve problems.', completed: true },
  { subject: 'CSE', number: 210, title: 'Programming with Classes', credits: 2, certificate: 'Web and Computer Programming', description: 'Introduces object-oriented programming.', completed: false },
  { subject: 'WDD', number: 131, title: 'Dynamic Web Fundamentals', credits: 2, certificate: 'Web and Computer Programming', description: 'Build interactive web pages with JavaScript.', completed: true },
  { subject: 'WDD', number: 231, title: 'Frontend Web Development I', credits: 2, certificate: 'Web and Computer Programming', description: 'Advanced HTML, CSS, JavaScript for the web.', completed: false },
];
const grid = document.getElementById('course-grid');
const creditsEl = document.getElementById('credits-summary');
const filterBtns = document.querySelectorAll('.filter-btns button');
function renderCourses(filter = 'all') {
  const filtered = filter === 'all'
    ? courses
    : courses.filter(c => c.subject.toLowerCase() === filter.toLowerCase());
  grid.innerHTML = filtered.map(c => `
    <div class="course-card ${c.completed ? 'completed' : 'incomplete'}" title="${c.title}">
      <div class="check">${c.completed ? '✔' : ''}</div>
      <div>${c.subject} ${c.number}</div>
    </div>
  `).join('');
  const totalCredits = filtered.reduce((sum, c) => sum + c.credits, 0);
  creditsEl.textContent = `Total Credits: ${totalCredits}`;
}
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderCourses(btn.dataset.filter);
  });
});
renderCourses('all');
