export function setSectionSelection(sections) {
  const select = document.querySelector("#sectionNumber");
  select.innerHTML = `<option value="">--</option>`;

  sections.forEach((section) => {
    const option = document.createElement("option");
    option.value = section.sectionNumber;
    option.textContent = `Section ${section.sectionNumber}`;
    select.appendChild(option);
  });
}
