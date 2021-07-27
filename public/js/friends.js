Object.values(document.querySelectorAll('.add-friend-button')).forEach(button => {
    button.addEventListener('click', () => {
        fetch(`/friends`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ friendRequest: button.name })
        })
        .then(response => response.json())
        .then(response => {
            button.textContent = 'Requested';
            button.classList.add('changed-friend-request');
            button.disabled = true;
        });
    });
});
Object.values(document.querySelectorAll('.accept-friend-button')).forEach(button => {
    button.addEventListener('click', () => {
        fetch(`/friends`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ acceptedFriendRequest: button.name })
        })
        .then(response => response.json())
        .then(response => {
            document.querySelector('.accept-friend-button + .decline-friend-button').textContent = 'Accepted';
            document.querySelector('.accept-friend-button + .decline-friend-button').classList.add('changed-friend-request');
            document.querySelector('.accept-friend-button + .decline-friend-button').disabled = true;
            button.remove();
        });
    });
});

Object.values(document.querySelectorAll('.decline-friend-button')).forEach(button => {
    button.addEventListener('click', () => {
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
            button.textContent = 'Declined';
            button.classList.add('changed-friend-request');
            button.disabled = true;
        });
    });
});