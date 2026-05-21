export function setTitle(course) {
  document.querySelector("#courseTitle").textContent =
    `${course.code}: ${course.name}`;
}

export function renderSections(sections) {
  const tbody = document.querySelector("#sectionList");
  tbody.innerHTML = "";

  sections.forEach((section) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${section.sectionNumber}</td>
      <td>${section.enrolled}</td>
      <td>${section.instructor}</td>
    `;
    tbody.appendChild(tr);
  });
}
