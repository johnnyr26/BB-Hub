document.querySelector('#submit').addEventListener('click', () => {
    const startingLocation = document.querySelector('#startingLocation').value;
    const finalLocation = document.querySelector('#finalLocation').value;

    const allLines = [];
    document.querySelector('#title').textContent = '';
    Object.values(document.querySelectorAll('line')).forEach(line => {
        const { id, coordinates, neighbors } = line;
        allLines.push({ id, coordinates, neighbors });
        line.style = '';
        line.classList.remove('route');
    });

    fetch(`/bmap?startingLocation=${startingLocation}&finalLocation=${finalLocation}`)
    .then(response => response.json())
    .then(response => {
        const { title, path } = response;
        document.querySelector('#title').textContent = title;
        const g = document.querySelector('g');
        path.forEach((line, index) => {
            setTimeout(() => {
                const lineDiv = document.querySelector(`#${line.room}`);
                lineDiv.classList.add('route');
                // prevents other lines from hovering over the selected line
                g.appendChild(lineDiv);
            }, 300 * (index + 1));
        });
    });
});

const getCoordinates = ({ x1: xS, x2: xE, y1: yS, y2: yE }) => {
    const { x1, x2, y1, y2 } = getCordValues(xS, xE, yS, yE);
    return { x1, x2, y1, y2 };
}

const getCordValues = (x1, x2, y1, y2) => {
    const xStart = x1.baseVal.value;
    const xEnd = x2.baseVal.value;
    const yStart = y1.baseVal.value;
    const yEnd = y2.baseVal.value;
    return {
        x1: xStart,
        x2: xEnd,
        y1: yStart,
        y2: yEnd
    };
}

const xMatch = (line1, line2) => {
    return (line1.coordinates.x1 === line2.coordinates.x1 || line1.coordinates.x1 === line2.coordinates.x2) || line1.coordinates.x2 === line2.coordinates.x1 || line1.coordinates.x2 === line2.coordinates.x2;
}
const yMatch = (line1, line2) => {
    return line1.coordinates.y1 === line2.coordinates.y1 || line1.coordinates.y1 === line2.coordinates.y2 || line1.coordinates.y2 === line2.coordinates.y1 || line1.coordinates.y2 === line2.coordinates.y2;
}

const lines = Object.values(document.querySelectorAll('line'));
lines.forEach(line1 => {
    line1.coordinates = getCoordinates(line1);
    const neighbors = [];
    lines.forEach(line2 => {
        if (!line2.coordinates) {
            line2.coordinates = getCoordinates(line2);
        }
        if (line1.coordinates.x1 === line2.coordinates.x1 && line1.coordinates.x2 === line2.coordinates.x2 && line1.coordinates.y1 === line2.coordinates.y1 && line1.coordinates.y2 === line2.coordinates.y2) {
            return;
        }
        const connectedLine = yMatch(line1, line2) && xMatch(line1, line2);
        if (connectedLine) {
            neighbors.push(line2.id);
        }  
    });
    line1.neighbors = neighbors;
    // line1.addEventListener('mouseover', () => {
    //     line1.neighbors.forEach(neighbor => {
    //         neighbor.style.stroke = 'blue';
    //         neighbor.style.fill = 'blue';
    //     });
    // });
    // line1.addEventListener('mouseleave', () => {
    //     line1.neighbors.forEach(neighbor => {
    //         neighbor.style.stroke = '#000';
    //         neighbor.style.fill = 'none';
    //     })
    // });
});