const courses = [
  { code: "WDD130", name: "Web Fundamentals", credits: 3, completed: true },
  { code: "WDD230", name: "Web Frontend Development I", credits: 3, completed: true },
  { code: "WDD231", name: "Web Frontend Development II", credits: 3, completed: false },
  { code: "CSE121b", name: "JavaScript Language", credits: 3, completed: false }
];

const container = document.querySelector('#courses');
const creditSpan = document.querySelector('#credits');
const buttons = document.querySelectorAll('.filters button');

function displayCourses(list) {
  container.innerHTML = '';
  const totalCredits = list.reduce((sum, c) => sum + c.credits, 0);
  creditSpan.textContent = totalCredits;

  list.forEach(course => {
    const div = document.createElement('div');
    div.className = `course ${course.completed ? 'completed' : ''}`;
    div.textContent = `${course.code} – ${course.name} (${course.credits})`;
    container.appendChild(div);
  });
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    if (filter === 'all') {
      displayCourses(courses);
    } else {
      displayCourses(courses.filter(c => c.code.startsWith(filter.toUpperCase())));
    }
  });
});

displayCourses(courses);
