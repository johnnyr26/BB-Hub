document.querySelector('button').addEventListener('click', () => {
    const schedule = document.querySelector('textarea').value;
    fetch(`/scheduler`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ schedule })
    })
    .then(response => response.json())
    .then(response => {
        const { letterDays } = response;
        letterDays.forEach(letterDay => {
            const letter = letterDay[0];
            const schedule = response.schedule[letter];
            const h1 = document.createElement('h1');
            h1.textContent = letterDay;
            document.body.appendChild(h1);
            if (!schedule) {
                return;
            }
            schedule.forEach(course => {
                const { period, courseTitle, classRoom, teacher } = course.course;
                const { block, from, to } = course.time;
                const p = document.createElement('p');
                p.textContent = `${period}: ${courseTitle}, ${teacher}, ${classRoom}`;
                document.body.appendChild(p);
            });
        });
        
    });
});