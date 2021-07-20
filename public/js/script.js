const getMonth = (month) => {
    switch(month) {
        case 0: return 'January';
        case 1: return 'February';
        case 2: return 'March';
        case 3: return 'April';
        case 4: return 'May';
        case 5: return 'June';
        case 6: return 'July'
        case 7: return 'August';
        case 8: return 'September';
        case 9: return 'October';
        case 10: return 'November';
        case 11: return 'December'
    }
}

Object.values(document.querySelectorAll('.availableFriends')).forEach(userButton => {
    userButton.addEventListener('click', () => {
        fetch(`/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ friendRequest: userButton.textContent })
        })
        .then(response => response.json())
        .then(response => {

        });
    });
});

Object.values(document.querySelectorAll('.friendRequests')).forEach(userButton => {
    userButton.addEventListener('click', () => {
        fetch(`/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ acceptedFriendRequest: userButton.textContent })
        })
        .then(response => response.json())
        .then(response => {});
    });
});

window.onload = () => {
    fetch('/?assignments=true')
    .then(response => response.json())
    .then(response => {
        document.querySelector('#classroom-section-body').innerHTML = '';
        let { assignments, nextPageToken } = response.assignments;
        if (!assignments.length) {
            document.querySelector('#classroom-section-body').innerHTML = `<h1>You have no assignments due!</h1>`;
        }
        postAssignments(assignments);
        fetchNextClassRoomAssignments(nextPageToken)
    });
}

const fetchNextClassRoomAssignments = (nextPageToken) => {
    if (!nextPageToken) {
        return;
    }
    fetch(`/?assignments=true&nextPageToken=${nextPageToken}`)
    .then(response => response.json())
    .then(response => {
        ({ assignments, nextPageToken } = response.assignments);
        postAssignments(assignments);
        fetchNextClassRoomAssignments(nextPageToken);
    });
}

const postAssignments = assignments => {
    console.log(assignments);
    for (const assignment of assignments) {
        const { name, title, link, courseWorkDueDate, maxPoints } = assignment;
        let dueDate = new Date(courseWorkDueDate).toLocaleString('en-US');
        const { month, day, year, time } = getDateInfo(dueDate);

        const assignmentDiv = maxPoints ?  `
            <div class="detail-section animate-load">
                <a class="classroom-link" href=${link}>
                    <h1 class="detail-title">${name}</h1>
                    <h1 class="detail-title">${title}</h1>
                    <p class="detail-body">Due ${month} ${day}, ${year} · ${time}</p>  
                    <p class="detail-body">${maxPoints} points</p>  
                </a>
            </div>
        ` : `
            <div class="detail-section animate-load">
                <a class="classroom-link" href=${link}>
                    <h1 class="detail-title">${name}</h1>
                    <h1 class="detail-title">${title}</h1>
                    <p class="detail-body">Due ${month} ${day}, ${year} · ${time}</p>
                </a>
            </div>
        `;

        document.querySelector('#classroom-section-body').innerHTML += assignmentDiv;
        setTimeout(() => {
            Object.values(document.querySelectorAll('.animate-load')).forEach(div => div.classList.remove('animate-load'));
        }, 500);
    }
}

const getDateInfo = (date) => {
    let dueDate = date;
    const month = getMonth(parseInt(dueDate[0]) - 1);
    const secondsIndex = dueDate.lastIndexOf(':');
    dueDate = dueDate.slice(0, secondsIndex) + dueDate.slice(secondsIndex + 3);

    const firstSlash = dueDate.indexOf('/');
    const secondSlash = dueDate.lastIndexOf('/');
    const day = dueDate.slice(firstSlash + 1, secondSlash);
    const year = dueDate.slice(secondSlash + 1, secondSlash + 5);

    const time = dueDate.slice(dueDate.indexOf(' ') + 1);
    return {
        month,
        day,
        year,
        time
    }
}