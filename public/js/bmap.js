document.querySelector('#submit').addEventListener('click', () => {
    const startingLocation = document.querySelector('#startingLocation').value;
    const finalLocation = document.querySelector('#finalLocation').value;

    document.querySelector('#title').textContent = '';
    Object.values(document.querySelectorAll('line')).forEach(line => {
        line.style.fill = 'none';
        line.style.stroke = '#000';
    });

    fetch(`/bmap?startingLocation=${startingLocation}&finalLocation=${finalLocation}`)
    .then(response => response.json())
    .then(response => {
        const { title, path } = response;
        response.path.forEach(line => {
            document.querySelector('#title').textContent = title;
            document.querySelector(`#${line.room}`).style.fill = 'blue';
            document.querySelector(`#${line.room}`).style.stroke = 'blue';
        });
    });
});