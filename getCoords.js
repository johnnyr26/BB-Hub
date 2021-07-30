const firstFloor = require('./assets/maps/FIRST_FLOOR');
const secondFloor = require('./assets/maps/SECOND_FLOOR');

const fRooms = firstFloor.map(cell => cell.id).filter(id => id.substring(0, 3) !== 'svg' && id.substring(0, 5) !== 'Stair');
const sRooms = secondFloor.map(cell => cell.id).filter(id => id.substring(0, 3) !== 'svg' && id.substring(0, 5) !== 'Stair');

const firstFloorSelectOptions = fRooms.map(room => {
    return `<option value="${room}">${room}</option>`;
}).sort();

const secondFloorSelectOptions = sRooms.map(room => {
    return `<option value="${room}">${room}</option>`;
}).sort();

firstFloorSelectOptions.forEach(room => console.log(room));
console.log();
secondFloorSelectOptions.forEach(room => console.log(room));
