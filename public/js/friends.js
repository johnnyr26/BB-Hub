const cancelRequest = (button) => {
    fetch(`/friends`, {
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
    fetch(`/friends`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ friendRequest: button.name })
    })
    .then(response => response.json())
    .then(response => {
        button.textContent = 'Cancel Request';
        button.classList.remove('add-friend-button');
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
    fetch(`/friends`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ acceptedFriendRequest: button.name })
    })
    .then(response => response.json())
    .then(() => {
        const declineButton = Object.values(document.querySelectorAll('.decline-friend-button')).find(declineButton => declineButton.name === button.name);
        declineButton.remove();
        button.remove();

        
    });
};

const declineFriend = (button) => {
    fetch(`/friends`, {
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

Object.values(document.querySelectorAll('.cancel-request-button')).forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        cancelRequest(button)
    });
});

Object.values(document.querySelectorAll('.add-friend-button')).forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        addFriend(button)
    });
});

Object.values(document.querySelectorAll('.accept-friend-button')).forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        acceptFriend(button)
    });
});

Object.values(document.querySelectorAll('.decline-friend-button')).forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        declineFriend(button)
    });
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