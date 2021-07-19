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