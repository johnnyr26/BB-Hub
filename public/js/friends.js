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
            console.log(response);
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
            document.querySelector('.accept-friend-button + .decline-friend-button').classList.add('accepted-friend-request');
            document.querySelector('.accept-friend-button + .decline-friend-button').disabled = true;
            button.remove();
            
        });
    });
});