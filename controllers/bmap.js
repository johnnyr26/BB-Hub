const FIRST_FLOOR_MAP = require('../assets/maps/array/highSchoolFirstFloor').MAP;
const SECOND_FLOOR_MAP = require('../assets/maps/array/highSchoolSecondFloor').MAP;

const SECOND_FLOOR = require('../assets/maps/SECOND_FLOOR');

const { findPath, getFloorOfStartingAndFinalLocations, printMapWithRoute } = require('../helpers/scheduler/map/pathFinder');

module.exports = (req, res) => {
    if (req.query.startingLocation && req.query.finalLocation) {
        let { startingLocation: STARTING_LOCATION, finalLocation: FINAL_LOCATION } = req.query;
        const { startingFloor, finalFloor } = getFloorOfStartingAndFinalLocations(STARTING_LOCATION, FINAL_LOCATION);

        if (startingFloor === finalFloor) {
            const map = startingFloor === 'FIRST_FLOOR' ? FIRST_FLOOR_MAP : SECOND_FLOOR;
            const { path } = findPath(STARTING_LOCATION, FINAL_LOCATION);
            if (path) {
                return res.send({ title: startingFloor, path });
            }
        } else {
            const endLocation = FINAL_LOCATION;
            FINAL_LOCATION = 'STAI';
        
            const startingMap = startingFloor === 'FIRST_FLOOR' ? FIRST_FLOOR_MAP : SECOND_FLOOR_MAP;
            const finalMap = finalFloor === 'FIRST_FLOOR' ? FIRST_FLOOR_MAP : SECOND_FLOOR_MAP;
        
            let { path, STAIR_NODE } = findPath(startingMap, STARTING_LOCATION, FINAL_LOCATION);
            const firstMap = printMapWithRoute(path, startingMap);
        
            STARTING_LOCATION = STAIR_NODE;
            FINAL_LOCATION = endLocation;
        
            path = findPath(finalMap, STARTING_LOCATION, FINAL_LOCATION).path;
            const secondMap = printMapWithRoute(path, finalMap);

            const map1 = {
                title: startingFloor,
                map: firstMap
            };
            const map2 = {
                title: finalFloor,
                map: secondMap
            };
            return res.send({ map1, map2 });
        }
    }
    return res.render('bmap');
}