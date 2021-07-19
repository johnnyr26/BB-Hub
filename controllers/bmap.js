const FIRST_FLOOR_MAP = require('../assets/maps/array/highSchoolFirstFloor').MAP;
const SECOND_FLOOR_MAP = require('../assets/maps/array/highSchoolSecondFloor').MAP;

const FIRST_FLOOR = require('../assets/maps/FIRST_FLOOR');
const SECOND_FLOOR = require('../assets/maps/SECOND_FLOOR');

const { findPath, getFloorOfStartingAndFinalLocations, printMapWithRoute } = require('../helpers/scheduler/map/pathFinder');

module.exports = (req, res) => {
    if (req.query.startingLocation && req.query.finalLocation) {
        let { startingLocation: STARTING_LOCATION, finalLocation: FINAL_LOCATION } = req.query;
        const { startingFloor, finalFloor } = getFloorOfStartingAndFinalLocations(STARTING_LOCATION, FINAL_LOCATION);

        if (startingFloor === finalFloor) {
            const map = startingFloor === 'FIRST_FLOOR' ? FIRST_FLOOR : SECOND_FLOOR;
            const { path } = findPath(STARTING_LOCATION, FINAL_LOCATION, map);
            if (path) {
                return res.send({ title: startingFloor, path });
            }
        } else {
            const endLocation = FINAL_LOCATION;
            
            const startingMap = startingFloor === 'FIRST_FLOOR' ? FIRST_FLOOR : SECOND_FLOOR;
            const finalMap = finalFloor === 'FIRST_FLOOR' ? FIRST_FLOOR : SECOND_FLOOR;

            FINAL_LOCATION = `Stairs${startingMap === FIRST_FLOOR ? 1 : 2}`;
            let { path, STAIR_NODE } = findPath(STARTING_LOCATION, FINAL_LOCATION, startingMap);

            const firstPath = path;
        
            STARTING_LOCATION = STAIR_NODE.id.substring(0, 6) + (finalFloor === 'FIRST_FLOOR' ? 'L' : 'U');
            FINAL_LOCATION = endLocation;
        
            const secondPath = findPath(STARTING_LOCATION, FINAL_LOCATION, finalMap).path;
            const map1 = {
                title: startingFloor,
                path: firstPath
            };
            const map2 = {
                title: finalFloor,
                path: secondPath
            };
            return res.send({ map1, map2 });
        }
    }
    return res.render('bmap');
}