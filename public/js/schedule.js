Object.values(document.querySelectorAll('.users')).forEach(userButton => {
    userButton.addEventListener('click', () => {
        fetch(`/schedule/${userButton.id}`)
        .then(response => response.json())
        .then(response => printSchedule(response, 'schedule'));
    });
});

document.querySelector('#submit').addEventListener('click', () => {
    const scheduleInput = document.querySelector('textarea').value;

    fetch(`/schedule`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ schedule: scheduleInput })
    })
    .then(response => response.json())
    .then(response => printSchedule(response, 'main-schedule'));
});

const printSchedule = (response, body) => {
    const { letterDays } = response;
    if (response.schedule) {
        clearSchedule(body);
    }
    if (response.sharedCourses) {
        document.querySelector('#shared-courses').textContent = '';
        response.sharedCourses.forEach(course => {
            document.querySelector('#shared-courses').textContent += `${course} `;
        });
    }
    letterDays.forEach(letterDay => {
        const letter = letterDay[0];
        const schedule = response.schedule[letter];
        if (!schedule) {
            return;
        }
        const noSchool = !letterDay.substring(0, 5).match(/^[A-H] Day$/) || schedule.find(course => !course.course);;
        if (noSchool) {
            return;
        }
        const h1 = document.createElement('h1');
        h1.textContent = letterDay;
        document.getElementById(body).appendChild(h1);
        schedule.forEach(course => {
            const { period, courseTitle, classRoom, teacher } = course.course;
            const { block, from, to } = course.time;
            const p = document.createElement('p');
            p.textContent = `${period}: ${courseTitle}, ${teacher}, ${classRoom}`;
            document.getElementById(body).appendChild(p);
        });
    });
}

const clearSchedule = (body) => {
    const schedule = document.getElementById(body);
    while (schedule.hasChildNodes()) {
        schedule.removeChild(schedule.firstChild);
    }
}