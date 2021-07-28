document.querySelector('.edit-profile').addEventListener('click', () => {
    document.querySelector('.shadow-background').classList.remove('invisible');
});
document.querySelector('.x').addEventListener('click', () => {
    document.querySelector('.shadow-background').classList.add('invisible');
});
document.querySelector('.submit-profile-info').addEventListener('click', () => {
    const graduationYear = parseInt(document.querySelector('.grad-year-button.year-selected').name);
    const clubs = Object.values(document.querySelectorAll('.select-club-div.div-selected')).map(div => div.name);
    const sports = Object.values(document.querySelectorAll('.select-sport-div.div-selected')).map(div => div.name);

    fetch(`/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            gradYear: graduationYear,
            clubs,
            sports
        })
    })
    .then(response => response.json())
    .then(response => {
        const { gradYear, clubs, sports } = response;
        document.querySelector('.user-profile-info').textContent = `Class of ${gradYear}`;

        document.querySelector('.club-section-body.section-body').innerHTML = '';
        clubs.forEach(club => {
            document.querySelector('.club-section-body.section-body').innerHTML += `
                <div class="club-div">
                    <div class="club-icon">${club[0]}</div>
                    <p class="club-name">${club}</p>
                </div>
            `;
        });

        document.querySelector('.sport-section-body.section-body').innerHTML = '';
        sports.forEach(sport => {
            document.querySelector('.sport-section-body.section-body').innerHTML += `
                <div class="sport-div">
                    <div class="sport-icon">${sport[0]}</div>
                    <p class="sport-name">${sport}</p>
                </div>
            `;
        });

        document.querySelector('.shadow-background').classList.add('invisible');
    });
});
Object.values(document.querySelectorAll('.select-club-div')).forEach(button => {
    button.addEventListener('click', () => {
        if (!button.classList.contains('div-selected')) {
            button.classList.add('div-selected');
        } else {
            button.classList.remove('div-selected');
        }
    });
});
Object.values(document.querySelectorAll('.select-sport-div')).forEach(button => {
    button.addEventListener('click', () => {
        if (!button.classList.contains('div-selected')) {
            button.classList.add('div-selected');
        } else {
            button.classList.remove('div-selected');
        }
    });
});
Object.values(document.querySelectorAll('.grad-year-button')).forEach(button => {
    button.addEventListener('click', () => {
        Object.values(document.querySelectorAll('.grad-year-button')).forEach(gradYear => {
            gradYear.classList.remove('year-selected');
        });
        button.classList.add('year-selected');
    });
});