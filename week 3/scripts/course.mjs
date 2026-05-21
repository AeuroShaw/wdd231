const byuiCourse = {
  name: "Web Frontend Development II",
  code: "WDD 231",
  sections: [
    { sectionNumber: 1, enrolled: 22, maxEnrollment: 30, instructor: "Sister Hansen" },
    { sectionNumber: 2, enrolled: 28, maxEnrollment: 30, instructor: "Brother Smith" },
    { sectionNumber: 3, enrolled: 15, maxEnrollment: 30, instructor: "Sister Olsen" },
    { sectionNumber: 4, enrolled: 30, maxEnrollment: 30, instructor: "Brother Clark" },
    { sectionNumber: 5, enrolled: 10, maxEnrollment: 30, instructor: "Sister Young" },
  ],

  changeEnrollment(sectionNumber, enroll = true) {
    const section = this.sections.find(
      (s) => s.sectionNumber === sectionNumber
    );

    if (!section) {
      alert(`Section ${sectionNumber} not found.`);
      return;
    }

    if (enroll) {
      if (section.enrolled < section.maxEnrollment) {
        section.enrolled++;
      } else {
        alert(`Section ${sectionNumber} is already at max enrollment.`);
      }
    } else {
      if (section.enrolled > 0) {
        section.enrolled--;
      } else {
        alert(`Section ${sectionNumber} already has 0 students.`);
      }
    }
  },
};

export default byuiCourse;
