const map = require('./configs/Map/highSchoolFirstFloor');

class Node {
    constructor (row, col) {
        this.row = row
        this.col = col
        this.level = 1
        this.visited = false
        this.parent = null;
    }
}

const findPath = map => {
    const nodes = [];
    const visited = [];
    let rowIndex = 0;
    
    for (const row of map) {
        const rowArray = [];
        const visitedRow = [];
        let colIndex = 0;
        for (const col of row) {
            rowArray.push(new Node(rowIndex, colIndex));
            visitedRow.push(false);
            colIndex ++;
        }
        nodes.push(rowArray);
        visited.push(visitedRow);
        rowIndex ++;
    }
    return traverseNodes(nodes, visited, map);
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

const traverseNodes = (nodes, visited, map) => {
    const sizes = [];
    const startingNode = nodes[1][6];
    const queue = [startingNode];
    const originalStartingPoint = map[startingNode.row][startingNode.col];
    console.log(originalStartingPoint);
    while (queue.length > 0) {
        const node = queue.shift();
        const finalDestination = 'LIBR';
        if (map[node.row][node.col] === finalDestination) {
            return findPathBack(node);
        }
        if (!node.visited && (map[node.row][node.col] === 'PATH' || map[node.row][node.col] === originalStartingPoint)) {
            node.visited = true;
            visited[node.row][node.col] = true;
            sizes.push([node.row, node.col]);
            getUnvisitedNeighbors(node.row, node.col, originalStartingPoint, finalDestination, nodes, visited, queue, map);
        }
    }
    console.log('There was no possible routes to the exit');
    return;
}

const printRoute = route => {
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
                string += '0   ';
            }
        }
        console.log(string);
    }
}

const route = findPath(map);
if (route) {
    printRoute(route);
}

