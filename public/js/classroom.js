window.onload = async () => {
    fetch('/classroom/getCourses')
    .then(response => response.json())
    .then(async response => {
        const { courses } = response;
        console.log('response', response);
        for (const course of courses) {
            try {
                const courseResponse = await fetch(`/classroom/${course.id}`);
                const { assignments } = await courseResponse.json();
                console.log(assignments);
                if (assignments.length) {
                    console.log(assignments);
                    const h1 = document.createElement('h1');
                    h1.textContent = course.name;
                    document.body.appendChild(h1);
                    assignments.forEach(assignment => {
                        const { title, dueDate, maxPoints } = assignment;
                        const a = document.createElement('a');
                        a.href = assignment.link;
                        a.textContent = `${title}: ${dueDate.month} ${dueDate.day} ${dueDate.year}. ${maxPoints} points`;
                        document.body.appendChild(a);
                        console.log(a);
                    })
                }
            } catch(e) {
                console.log('error', e);
            }
        }
    });
}