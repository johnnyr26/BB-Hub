const FIRST_FLOOR_MAP = require('../../../assets/maps/highSchoolFirstFloor').MAP;
const FIRST_FLOOR_ROOMS = require('../../../assets/maps/highSchoolFirstFloor').ROOMS;

const SECOND_FLOOR_MAP = require('../../../assets/maps/highSchoolSecondFloor').MAP;
const SECOND_FLOOR_ROOMS = require('../../../assets/maps/highSchoolSecondFloor').ROOMS;

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

module.exports.findPath = (map, STARTING_LOCATION, FINAL_LOCATION) => {
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
    return traverseNodes(nodes, visited, map, STARTING_LOCATION, FINAL_LOCATION);
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

const findPathBack = (node, STAIR_NODE) => {
    console.log('Total length to the spot', node.level);
    const path = [[node.row, node.col]];
    while (node.parent) {
        path.unshift([node.parent.row, node.parent.col]);
        node = node.parent;
    }
    return { path, STAIR_NODE };
}

const traverseNodes = (nodes, visited, map, STARTING_LOCATION, FINAL_LOCATION) => {
    const startingNode = STARTING_LOCATION.room ? STARTING_LOCATION : getNodeOfPlace(STARTING_LOCATION, nodes);
    const queue = [startingNode];
    const originalStartingPoint = map[startingNode.row][startingNode.col];
    if (startingNode.room === 'WALL') {
        console.log('You chose to start at a wall');
        return;
    }
    while (queue.length > 0) {
        const node = queue.shift();
        
        if (map[node.row][node.col] === FINAL_LOCATION) {
            const STAIR_NODE = node;
            return findPathBack(node, STAIR_NODE);
        }
        if (!node.visited && (map[node.row][node.col] === 'PATH' || map[node.row][node.col] === originalStartingPoint)) {
            node.visited = true;
            visited[node.row][node.col] = true;
            getUnvisitedNeighbors(node.row, node.col, originalStartingPoint, FINAL_LOCATION, nodes, visited, queue, map);
        }
    }
    console.log('There was no possible routes to the exit');
}

module.exports.printMapWithRoute = (route, map) => {
    let index = 1;
    const mapArray = [];
    for (let row = 0; row < map.length; row ++) {
        const rowArray = [];
        for (let col = 0; col < map[row].length; col ++) {
            let thereIsAOne = false;          
            for (const row2 of route) {
                if (row === row2[0]  && col === row2[1]) {
                    let ender = '  ';
                    if (index >= 10) {
                        ender = ' ';
                    }
                    rowArray.push(index + ender);
                    thereIsAOne = true;
                    break;
                }
                index ++;
            }
            index = 1;
            if (!thereIsAOne) {
                rowArray.push(`${map[row][col][0]}  `);
            }
        }
        mapArray.push(rowArray);
    }
    return mapArray;
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

module.exports.getFloorOfStartingAndFinalLocations = (STARTING_LOCATION, FINAL_LOCATION) => {
    const startingFloor = FIRST_FLOOR_ROOMS.includes(STARTING_LOCATION) ? 'FIRST_FLOOR' : 'SECOND_FLOOR';
    const finalFloor = FIRST_FLOOR_ROOMS.includes(FINAL_LOCATION) ? 'FIRST_FLOOR' : 'SECOND_FLOOR';
    return { startingFloor, finalFloor };
}
