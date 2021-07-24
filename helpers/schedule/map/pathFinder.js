const FIRST_FLOOR_MAP = require('../../../assets/maps/array/highSchoolFirstFloor').MAP;
const FIRST_FLOOR_ROOMS = require('../../../assets/maps/array/highSchoolFirstFloor').ROOMS;

const SECOND_FLOOR_MAP = require('../../../assets/maps/array/highSchoolSecondFloor').MAP;
const SECOND_FLOOR_ROOMS = require('../../../assets/maps/array/highSchoolSecondFloor').ROOMS;

class Node {
    constructor (room, id, neighbors) {
        this.room = room;
        this.id = id;
        this.neighbors = neighbors
        this.level = 1;
        this.visited = false;
        this.parent = null;
    }
}

module.exports.findPath = (STARTING_LOCATION, FINAL_LOCATION, map) => {
    const nodes = [];

    for (const node of map) {
        nodes.push(new Node(node.classList[0] ? node.classList[0] : node.id, node.id, node.neighbors));
    }
    return traverseNodes(nodes, STARTING_LOCATION, FINAL_LOCATION);
}

const getUnvisitedNeighbors = (node, nodes, queue) => {
    const unvisitedNeighbors = node.neighbors.filter(neighborId => {
        const neighbor = nodes.find(nodeInNodes => nodeInNodes.id === neighborId);
        if (!neighbor.visited && !queue.includes(neighbor)) {
            neighbor.level = node.level + 1;
            neighbor.parent = node;
            return true;
        }
    }).map(neighborNodeId => nodes.find(nodeInNodes => neighborNodeId === nodeInNodes.id));
    return unvisitedNeighbors;
}

const findPathBack = (node, STAIR_NODE) => {
    console.log('Total length to the spot', node.level);
    const path = [node];
    while (node.parent) {
        path.unshift(node.parent);
        node = node.parent;
    }
    return { path, STAIR_NODE };
}

const traverseNodes = (nodes, STARTING_LOCATION, FINAL_LOCATION) => {
    const startingNode = STARTING_LOCATION.room ? STARTING_LOCATION : nodes.find(node => node.id === STARTING_LOCATION);
    const queue = [startingNode];
    while (queue.length > 0) {
        const node = queue.shift();
        if (node.room === FINAL_LOCATION) {
            const STAIR_NODE = node;
            return findPathBack(node, STAIR_NODE);
        }

        if (!node.visited) {
            node.visited = true;
            queue.push(...getUnvisitedNeighbors(node, nodes, queue));
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

module.exports.getFloorOfStartingAndFinalLocations = (STARTING_LOCATION, FINAL_LOCATION) => {
    const startingFloor = FIRST_FLOOR_ROOMS.includes(STARTING_LOCATION) ? 'FIRST_FLOOR' : 'SECOND_FLOOR';
    const finalFloor = FIRST_FLOOR_ROOMS.includes(FINAL_LOCATION) ? 'FIRST_FLOOR' : 'SECOND_FLOOR';
    return { startingFloor, finalFloor };
}