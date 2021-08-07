let timeOuts = [];

document.querySelector('.submit').addEventListener('click', () => {
    const startingLocation = document.querySelector('#startingLocation').value;
    const finalLocation = document.querySelector('#finalLocation').value;

    const allLines = [];

    if (timeOuts) {
        timeOuts.forEach(timeOut => clearTimeout(timeOut));
    }

    Object.values(document.querySelectorAll('line')).forEach(line => {
        const { id, coordinates, neighbors, classList } = line;
        allLines.push({ id, coordinates, neighbors, classList });
        line.style = '';
        line.classList.remove('route');
    });

    

    fetch(`/map?startingLocation=${startingLocation}&finalLocation=${finalLocation}`)
    .then(response => response.json())
    .then(response => {
        if (response.map1 && response.map2) {
            const { map1, map2 } = response
            const maps = [ map1, map2 ];
            const paths = [];
            maps.forEach((map, mapIndex) => {
                map.path.forEach(line => {
                    paths.push({
                        line,
                        title: map.title,
                        mapIndex
                    })
                })
            });
            let firstFloorMap = document.querySelector('#svg1').innerHTML;
            let secondFloorMap = document.querySelector('#svg2').innerHTML;

            // if (map1.title === 'SECOND_FLOOR') {
            //     const tempMap = firstFloorMap;
            //     const { x: x1, y: y1, width: w1, height: h1 } = document.querySelector('#svg1').viewBox.baseVal;
            //     const { x: x2, y: y2, width: w2, height: h2} = document.querySelector('#svg2').viewBox.baseVal;
                
            //     document.querySelector('#svg1').innerHTML = secondFloorMap;
            //     document.querySelector('#svg2').innerHTML = tempMap;

            //     document.querySelector('#svg1').setAttribute('viewBox', `${x2} ${y2} ${w2} ${h2}`);
            //     document.querySelector('#svg2').setAttribute('viewBox', `${x1} ${y1} ${w1} ${h1}`);
            // }

            paths.forEach((path, index) => {
                const { title, line, mapIndex } = path;
                const g = document.querySelector(`#${title}`);
                timeOuts.push(setTimeout(() => {
                    const lineDiv = document.querySelector(`#${line.id}`);
                    lineDiv.classList.add('route');
                    // prevents other lines from hovering over the selected line
                    g.appendChild(lineDiv);
                }, 200 * (index + 1)));
            });
        }
        if (response.title && response.path) {
            const { title, path } = response;
            const g = document.querySelector(`#${title}`);
            path.forEach((line, index) => {
                timeOuts.push(setTimeout(() => {
                    const lineDiv = document.querySelector(`#${line.id}`);
                    lineDiv.classList.add('route');
                    // prevents other lines from hovering over the selected line
                    g.appendChild(lineDiv);
                }, 200 * (index + 1)));
            });
        }
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

const setLines = new Set();
const lines = Object.values(document.querySelectorAll('line'));
lines.forEach((line1, index) => {
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
    setLines.add(line1.id);
});
document.querySelector('body').addEventListener('click', e => {
    if (e.target === document.querySelector('.profile-menu-selection') || e.target === document.querySelector('#nav')) {
        e.stopPropagation();
        return;
    }
    if (!document.querySelector('.profile-menu-selection').classList.contains('invisible')) {
        document.querySelector('.profile-menu-selection').classList.add('invisible');
    }
    if (document.querySelector('#header').classList.contains('clicked')) {
        document.querySelector('#header').classList.remove('clicked');
    }
});