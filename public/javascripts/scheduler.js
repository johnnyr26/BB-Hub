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
        console.log(response);
    });
});