const coords = [
    333,
    372,
    410,
    414,
    462,
    494,
    500,
    508,
    580,
    592,
    638,
    650,
    670
];

coords.forEach((coord1, index1) => {
    coords.forEach((coord2, index2) => {
        if (coord1 === coord2) {
            return;
        }
        console.log(`<line stroke-width="5" stroke="#000" fill="none" x1="${coord1}" y1="203" x2="${coord2}" y2="203" id="svg_${(index1 + 1) * 1000 + index2}" style="fill: none; stroke: rgb(0, 0, 0);"></line>`);
    })
});