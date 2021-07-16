document.querySelector('#submit').addEventListener('click', () => {
    const startingLocation = document.querySelector('#startingLocation').value;
    const finalLocation = document.querySelector('#finalLocation').value;

    fetch(`/map?startingLocation=${startingLocation}&finalLocation=${finalLocation}`)
    .then(response => response.json())
    .then(response => {
        if (response.map) {
            const mapDiv = document.querySelector('#map1');
            response.map.forEach(row => {
                const combined = row.join('');
                const p = `
                    <p>${combined}</p>
                `;
                mapDiv.innerHTML += p;
            });
            document.querySelector('#map1-title').textContent = response.title;
        }
        if (response.map1 && response.map2) {
            const mapDiv1 = document.querySelector('#map1');
            response.map1.map.forEach(row => {
                let rowDiv = '';
                row.forEach(char => {
                    const num = parseInt(char);
                    if (isNaN(num)) {
                        rowDiv += `<span>${char}</span>`;
                    } else {
                        rowDiv += `<span style="color: blue">${char}</span>`;
                    }
                });
                const p = `<div>${rowDiv}</div>`;
                mapDiv1.innerHTML += p;
            });
            document.querySelector('#map1-title').textContent = response.map1.title;

            const mapDiv2 = document.querySelector('#map2');
            response.map2.map.forEach(row => {
                let rowDiv = '';
                row.forEach(char => {
                    const num = parseInt(char);
                    if (isNaN(num)) {
                        rowDiv += `<span>${char}</span>`;
                    } else {
                        rowDiv += `<span style="color: blue">${char}</span>`;
                    }
                });
                const p = `<div>${rowDiv}</div>`;
                mapDiv2.innerHTML += p;
            });
            document.querySelector('#map2-title').textContent = response.map2.title;
        }
    });
});