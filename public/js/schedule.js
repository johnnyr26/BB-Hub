Object.values(document.querySelectorAll('.users')).forEach(userButton => {
    userButton.addEventListener('click', () => {
        fetch(`/schedule/${userButton.id}`)
        .then(response => response.json())
        .then(response => printSchedule(response, 'schedule'));
    });
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

document.querySelector('.free-periods-checkbox').addEventListener('change', () => {
    if (document.querySelector('.free-periods-checkbox').checked) {
        Object.values(document.querySelectorAll('.block.free')).forEach(freeBlock => {
            freeBlock.textContent = 'Free';
        });
    } else {
        Object.values(document.querySelectorAll('.block.free')).forEach(freeBlock => {
            freeBlock.textContent = '';
        });
    }
});

document.querySelector('.room-number-checkbox').addEventListener('change', () => {
    if (document.querySelector('.room-number-checkbox').checked) {
        Object.values(document.querySelectorAll('.class-room')).forEach(freeBlock => {
            freeBlock.style.display = 'block'
        });
    } else {
        Object.values(document.querySelectorAll('.class-room')).forEach(freeBlock => {
            freeBlock.style.display = 'none';
        });
    }
});

document.querySelector('.show-teacher-checkbox').addEventListener('change', () => {
    if (document.querySelector('.show-teacher-checkbox').checked) {
        Object.values(document.querySelectorAll('.class-teacher')).forEach(freeBlock => {
            freeBlock.style.display = 'block'
        });
    } else {
        Object.values(document.querySelectorAll('.class-teacher')).forEach(freeBlock => {
            freeBlock.style.display = 'none';
        });
    }
});

document.querySelector('.show-teacher-checkbox').addEventListener('change', () => {
    if (document.querySelector('.show-teacher-checkbox').checked) {
        Object.values(document.querySelectorAll('.class-teacher')).forEach(freeBlock => {
            freeBlock.style.display = 'block'
        });
    } else {
        Object.values(document.querySelectorAll('.class-teacher')).forEach(freeBlock => {
            freeBlock.style.display = 'none';
        });
    }
});

//show-colors-checkbox

document.querySelector('.show-colors-checkbox').addEventListener('change', () => {
    if (document.querySelector('.show-colors-checkbox').checked) {
        Object.values(document.querySelectorAll('.block.class')).forEach(freeBlock => {
            freeBlock.style.backgroundColor = freeBlock.backgroundColor;
        });
        document.querySelector('.block.long').style.backgroundColor = document.querySelector('.block.long').backgroundColor;
        document.querySelector('.block.long').style.color = '#ffffff';
    } else {
        Object.values(document.querySelectorAll('.block.class')).forEach(freeBlock => {
            freeBlock.backgroundColor = freeBlock.style.backgroundColor;
            freeBlock.style.backgroundColor = 'transparent';
        });
        document.querySelector('.block.long').backgroundColor = document.querySelector('.block.long').style.backgroundColor;
        document.querySelector('.block.long').style.backgroundColor = 'transparent';
        document.querySelector('.block.long').style.color = '#000000';
    }
});

document.querySelector('.import-class').addEventListener('click', () => {
    document.querySelector('.shadow-background').classList.remove('invisible');
    document.querySelector('.modal.import-class-modal').classList.remove('invisible');
});

document.querySelector('.edit-class').addEventListener('click', () => {
    document.querySelector('.shadow-background').classList.remove('invisible');
    document.querySelector('.modal.edit-class-modal').classList.remove('invisible');
});

document.querySelector('.add-class').addEventListener('click', () => {
    document.querySelector('.shadow-background').classList.remove('invisible');
    document.querySelector('.modal.add-class-modal').classList.remove('invisible');
});



document.querySelector('.submit-schedule').addEventListener('click', () => {
    const scheduleInput = document.querySelector('textarea').value;

    if (!scheduleInput.trim()) {
        return;
    }

    fetch(`/schedule`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ schedule: scheduleInput })
    })
    .then(response => response.json())
    .then(response => {
        location.reload();
    });
});

document.querySelector('.add-class-button').addEventListener('click', () => {
    const letterDayRegex = /([A-H],?)*[A-H]$/;
    const periodRegex = /([1-9])$/;

    document.querySelector('.error-message').classList.add('invisible');

    const courseTitle = document.querySelector('.name-textfield').value.trim();
    const period = document.querySelector('.period-textfield').value.trim();
    const letterDays = document.querySelector('.letterDay-textfield').value.trim();
    const classRoom = document.querySelector('.room-textfield').value.trim();
    const teacher = document.querySelector('.teacher-textfield').value.trim();

    const allFilled = courseTitle && period && letterDays && classRoom && teacher;
    const regexMatch = letterDays.match(letterDayRegex) &&  period.match(periodRegex);

    if (!allFilled) {
        document.querySelector('.error-message').classList.remove('invisible');
        document.querySelector('.error-message').textContent = 'Not all required textfields were filled. Please fill in all required information';
        return;
    }
    if (!regexMatch) {
        document.querySelector('.error-message').classList.remove('invisible');
        if (!letterDays.match(letterDayRegex)) {
            document.querySelector('.error-message').textContent = 'The letter days were not entered in the right format. The format should be A,C,D,F';
            return;
        } else {
            document.querySelector('.error-message').textContent = 'The period can only be between 1 and 8';
            return;
        }
    }

    const newCourse = {
        courseTitle, 
        period,
        letterDays: letterDays.split(','),
        classRoom,
        teacher
    }

    fetch(`/schedule`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newCourse })
    })
    .then(response => response.json())
    .then(response => {
        location.reload();
    });
});

document.querySelector('.cancel-add-class-button').addEventListener('click', () => {
    Object.values(document.querySelectorAll('input[type="text')).forEach(textfield => {
        textfield.value = '';
    });
    document.querySelector('.shadow-background').classList.add('invisible');
    document.querySelector('.modal.import-class-modal').classList.add('invisible');
    document.querySelector('.modal.edit-class-modal').classList.add('invisible');
    document.querySelector('.modal.add-class-modal').classList.add('invisible');
})


document.querySelector('.shadow-background').addEventListener('click', e => {
    if (e.target !== document.querySelector('.shadow-background')) {
        e.stopPropagation();
        return;
    }
    document.querySelector('.shadow-background').classList.add('invisible');
    document.querySelector('.modal.import-class-modal').classList.add('invisible');
    document.querySelector('.modal.edit-class-modal').classList.add('invisible');
    document.querySelector('.modal.add-class-modal').classList.add('invisible');
});

Object.values(document.querySelectorAll('.remove')).forEach(removeButton => {
    removeButton.addEventListener('click', () => {
        fetch(`/schedule`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ removeCourse: removeButton.name })
        })
        .then(response => response.json())
        .then(response => {
            
            removeButton.parentElement.remove();
        });
    });
});
document.querySelector('body').addEventListener('click', e => {
    if (e.target === document.querySelector('.profile-menu-selection') || e.target === document.querySelector('#nav')) {
        e.stopPropagation();
        return;
    }
    if (!document.querySelector('.profile-menu-selection').classList.contains('invisible')) {
        document.querySelector('.profile-menu-selection').classList.add('invisible');
    }
    if (document.querySelector('#header').classList.contains('clicked')) {
        document.querySelector('#header').classList.remove('clicked');
    }
});