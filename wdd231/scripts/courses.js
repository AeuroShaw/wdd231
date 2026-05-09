const courses = [
    {
        subject: "WDD",
        number: 130,
        title: "Web Fundamentals",
        credits: 2,
        completed: true
    },
    {
        subject: "WDD",
        number: 131,
        title: "Dynamic Web Fundamentals",
        credits: 2,
        completed: true
    },
    {
        subject: "CSE",
        number: 110,
        title: "Programming Building Blocks",
        credits: 2,
        completed: true
    },
    {
        subject: "CSE",
        number: 111,
        title: "Programming with Functions",
        credits: 2,
        completed: true
    }
];

const container = document.querySelector('#courses');

function displayCourses(courseList) {

    container.innerHTML = "";

    courseList.forEach(course => {

        const div = document.createElement('div');

        div.classList.add('course-card');

        if (course.completed) {
            div.classList.add('completed');
        }

        div.innerHTML = `
            ${course.subject} ${course.number}
        `;

        container.appendChild(div);
    });

    const totalCredits = courseList.reduce(
        (sum, course) => sum + course.credits, 0
    );

    document.querySelector('#credits').textContent =
    totalCredits;
}

displayCourses(courses);

document.querySelector('#all').addEventListener('click', () => {
    displayCourses(courses);
});

document.querySelector('#wdd').addEventListener('click', () => {
    const filtered = courses.filter(course =>
        course.subject === "WDD"
    );

    displayCourses(filtered);
});

document.querySelector('#cse').addEventListener('click', () => {
    const filtered = courses.filter(course =>
        course.subject === "CSE"
    );

    displayCourses(filtered);
});