const FIRST_FLOOR_MAP = require('../../../assets/maps/highSchoolFirstFloor').MAP;
const FIRST_FLOOR_ROOMS = require('../../../assets/maps/highSchoolFirstFloor').ROOMS;

const SECOND_FLOOR_MAP = require('../../../assets/maps/highSchoolSecondFloor').MAP;
const SECOND_FLOOR_ROOMS = require('../../../assets/maps/highSchoolSecondFloor').ROOMS;

let STAIR_NODE;

class Node {
    constructor (row, col, room) {
        this.row = row
        this.col = col
        this.level = 1
        this.visited = false
        this.parent = null;
        this.room = room;
    }
}

const findPath = (map, stairNode) => {
    const nodes = [];
    const visited = [];
    let rowIndex = 0;
    
    for (const row of map) {
        const rowArray = [];
        const visitedRow = [];
        let colIndex = 0;
        for (const cell of row) {
            rowArray.push(new Node(rowIndex, colIndex, cell));
            visitedRow.push(false);
            colIndex ++;
        }
        nodes.push(rowArray);
        visited.push(visitedRow);
        rowIndex ++;
    }
    return traverseNodes(nodes, visited, map, stairNode);
}

const getUnvisitedNeighbors = (row, col, originalStartingPoint, finalDestination, nodes, visited, queue, map) => {
    if (row - 1 >= 0 &&  !visited[row - 1][col] && (map[row - 1][col] === 'PATH' || map[row - 1][col] === finalDestination || map[row - 1][col] === originalStartingPoint)) {
        nodes[row - 1][col].level = nodes[row][col].level + 1;
        nodes[row - 1][col].parent = nodes[row][col];
        queue.push(nodes[row - 1][col]);
    }
    if (col - 1 >= 0 && !visited[row][col - 1] && (map[row][col - 1] === 'PATH' || map[row][col - 1] === finalDestination || map[row][col - 1] === originalStartingPoint)) {
        nodes[row][col - 1].level = nodes[row][col].level + 1;
        nodes[row][col - 1].parent = nodes[row][col];
        queue.push(nodes[row][col - 1]);
    }
    if (row + 1 < map.length && !visited[row + 1][col] && (map[row + 1][col] === 'PATH' || map[row + 1][col] === finalDestination || map[row + 1][col] === originalStartingPoint)) {
        nodes[row + 1][col].level = nodes[row][col].level + 1;
        nodes[row + 1][col].parent = nodes[row][col];
        queue.push(nodes[row + 1][col]);
    }
    if (col + 1 < map[0].length && !visited[row][col + 1] && (map[row][col + 1] === 'PATH' || map[row][col + 1] === finalDestination || map[row][col + 1] === originalStartingPoint)) {
        nodes[row][col + 1].level = nodes[row][col].level + 1;
        nodes[row][col + 1].parent = nodes[row][col];
        queue.push(nodes[row][col + 1]);
    }
}

const findPathBack = node => {
    console.log('Total length to the spot', node.level);
    const path = [[node.row, node.col]];
    while (node.parent) {
        path.unshift([node.parent.row, node.parent.col]);
        node = node.parent;
    }
    return path;
}

const traverseNodes = (nodes, visited, map, stairNode) => {
    const startingNode = STAIR_NODE ? STAIR_NODE : getNodeOfPlace(STARTING_LOCATION, nodes);
    const queue = [startingNode];
    const originalStartingPoint = map[startingNode.row][startingNode.col];
    if (startingNode.room === 'WALL') {
        console.log('You chose to start at a wall');
        return;
    }
    while (queue.length > 0) {
        const node = queue.shift();
        
        if (map[node.row][node.col] === FINAL_LOCATION) {
            STAIR_NODE = node;
            return findPathBack(node);
        }
        if (!node.visited && (map[node.row][node.col] === 'PATH' || map[node.row][node.col] === originalStartingPoint)) {
            node.visited = true;
            visited[node.row][node.col] = true;
            getUnvisitedNeighbors(node.row, node.col, originalStartingPoint, FINAL_LOCATION, nodes, visited, queue, map);
        }
    }
    console.log('There was no possible routes to the exit');
}

const printMapWithRoute = (route, map) => {
    let index = 1;
    for (let row = 0; row < map.length; row ++) {
        let string = '';
        for (let col = 0; col < map[row].length; col ++) {
            let thereIsAOne = false;          
            for (const row2 of route) {
                if (row === row2[0]  && col === row2[1]) {
                    let ender = '   ';
                    if (index >= 10) {
                        ender = '  ';
                    }
                    string += index + ender;
                    thereIsAOne = true;
                    break;
                }
                index ++;
            }
            index = 1;
            if (!thereIsAOne) {
                string += `${map[row][col][0]}   `;
            }
        }
        console.log(string);
    }
}

const getNodeOfPlace = (place, map) => {
    for (const row of map) {
        for (const cell of row) {
            if (cell.room === place) {
                return cell;
            }
        }
    }
}

const getFloorOfStartingAndFinalLocations = () => {
    const startingFloor = FIRST_FLOOR_ROOMS.includes(STARTING_LOCATION) ? 'FIRST_FLOOR' : 'SECOND_FLOOR';
    const finalFloor = FIRST_FLOOR_ROOMS.includes(FINAL_LOCATION) ? 'FIRST_FLOOR' : 'SECOND_FLOOR';
    return { startingFloor, finalFloor };
}

let STARTING_LOCATION = 'H213'
let FINAL_LOCATION = 'GUID';

const { startingFloor, finalFloor } = getFloorOfStartingAndFinalLocations();

if (startingFloor === finalFloor) {
    const map = startingFloor === 'FIRST_FLOOR' ? FIRST_FLOOR_MAP : SECOND_FLOOR_MAP;
    const ROUTE = findPath(map);
    if (ROUTE) {
        printMapWithRoute(ROUTE, map);
    }
} else {
    const endLocation = FINAL_LOCATION;
    FINAL_LOCATION = 'STAI';

    const startingMap = startingFloor === 'FIRST_FLOOR' ? FIRST_FLOOR_MAP : SECOND_FLOOR_MAP;
    const finalMap = finalFloor === 'FIRST_FLOOR' ? FIRST_FLOOR_MAP : SECOND_FLOOR_MAP;

    let route = findPath(startingMap);
    if (route) {
        printMapWithRoute(route, startingMap);
    }

    STARTING_LOCATION = STAIR_NODE;
    FINAL_LOCATION = endLocation;

    route = findPath(finalMap);
    if (route) {
        printMapWithRoute(route, finalMap);
    }
}
