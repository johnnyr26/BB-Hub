const cancelRequest = (button) => {
    fetch(`/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cancelledFriendRequest: button.name })
    })
    .then(response => response.json())
    .then(response => {
        button.textContent = 'Add Friend';
        button.classList.remove('cancel-request-button');
        button.classList.add('add-friend-button');
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        newButton.addEventListener('click', (e) => {
            e.preventDefault();
            addFriend(newButton)
        });
    });
}

const addFriend = (button) => {
    fetch(`/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ friendRequest: button.name })
    })
    .then(response => response.json())
    .then(response => {
        button.textContent = 'Cancel Request';
        button.classList.add('cancel-request-button');
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        newButton.addEventListener('click', (e) => {
            e.preventDefault();
            cancelRequest(newButton)
        });
    });
};

const acceptFriend = (button) => {
    fetch(`/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ acceptedFriendRequest: button.name })
    })
    .then(response => response.json())
    .then(() => {
        location.reload();
    });
};

const declineFriend = (button) => {
    fetch(`/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deniedFriendRequest: button.name })
    })
    .then(response => response.json())
    .then(response => {
        Object.values(document.querySelectorAll('.accept-friend-button')).find(acceptButton => acceptButton.name === button.name).remove();
        button.classList.remove('decline-friend-button');
        button.classList.add('profile-button');
        button.classList.add('add-friend-button');
        button.textContent = 'Add Friend';
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        newButton.addEventListener('click', (e) => {
            e.preventDefault();
            addFriend(newButton)
        });
    });
}
if (document.querySelector('.edit-profile')) {
    Object.values(document.querySelectorAll('.edit-profile')).forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('.shadow-background').classList.remove('invisible');
            document.querySelector('.new-user-modal').classList.add('invisible');
            document.querySelector('.edit-profile-modal').classList.remove('invisible');
        });
    });
}
document.querySelector('.x').addEventListener('click', () => {
    document.querySelector('.shadow-background').classList.add('invisible');
    document.querySelector('.edit-profile-modal').classList.add('invisible');
});
document.querySelector('.submit-profile-info').addEventListener('click', () => {
    const name = document.querySelector('.name').value;
    const graduationYear = parseInt(document.querySelector('.grad-year-button.year-selected').name);
    const clubs = Object.values(document.querySelectorAll('.select-club-div.div-selected')).map(div => div.name);
    const sports = Object.values(document.querySelectorAll('.select-sport-div.div-selected')).map(div => div.name);
    const privacy = Object.values(document.querySelectorAll('.privacy-button.privacy-selected')).map(div => div.name);

    fetch(`/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            name,
            gradYear: graduationYear,
            clubs,
            sports,
            privacy
        })
    })
    .then(response => response.json())
    .then(response => {
        if (window.location.href.includes('newuser')) {
            document.querySelector('.new-user-modal').classList.remove('invisible');
            document.querySelector('.edit-profile-modal').classList.add('invisible');

            document.querySelector('.new-user-modal-header').innerHTML = `
                <h1>Nice Job</h1>
                <h1>Let's add your schedule</h1>
            `;
            document.querySelector('.new-user-modal-body').innerHTML = `
                <a href="/schedule" class="profile-button edit-profile">Add Schedule</a>
            `;
        } else {
            if (response.error) {
                throw new Error(response.error);
            }
            location.reload();
        }
    }).catch(e => {
        console.log(e);
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
Object.values(document.querySelectorAll('.privacy-button')).forEach(button => {
    button.addEventListener('click', () => {
        if (!button.classList.contains('privacy-selected')) {
            button.classList.add('privacy-selected');
        } else {
            button.classList.remove('privacy-selected');
        }
    });
});
Object.values(document.querySelectorAll('.cancel-request-button')).forEach(button => {
    button.addEventListener('click', () => cancelRequest(button));
});

Object.values(document.querySelectorAll('.add-friend-button')).forEach(button => {
    button.addEventListener('click', () => addFriend(button));
});

Object.values(document.querySelectorAll('.accept-friend-button')).forEach(button => {
    button.addEventListener('click', () => acceptFriend(button));
});

Object.values(document.querySelectorAll('.decline-friend-button')).forEach(button => {
    button.addEventListener('click', () => declineFriend(button));
});
document.querySelector('.shadow-background').addEventListener('click', e => {
    if (e.target !== document.querySelector('.shadow-background')) {
        e.stopPropagation();
        return;
    }
    document.querySelector('.shadow-background').classList.add('invisible');
});
document.querySelector('body').addEventListener('click', e => {
    if (e.target === document.querySelector('.profile-menu-selection')) {
        e.stopPropagation();
        return;
    }
    if (!document.querySelector('.profile-menu-selection').classList.contains('invisible')) {
        document.querySelector('.profile-menu-selection').classList.add('invisible');
    }
});