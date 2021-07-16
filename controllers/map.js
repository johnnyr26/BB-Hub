const FIRST_FLOOR_MAP = require('../assets/maps/highSchoolFirstFloor').MAP;
const SECOND_FLOOR_MAP = require('../assets/maps/highSchoolSecondFloor').MAP;

const { findPath, getFloorOfStartingAndFinalLocations, printMapWithRoute } = require('../helpers/scheduler/map/pathFinder');

module.exports = (req, res) => {
    if (req.query.startingLocation && req.query.finalLocation) {
        let { startingLocation: STARTING_LOCATION, finalLocation: FINAL_LOCATION } = req.query;
        const { startingFloor, finalFloor } = getFloorOfStartingAndFinalLocations(STARTING_LOCATION, FINAL_LOCATION);

        if (startingFloor === finalFloor) {
            const map = startingFloor === 'FIRST_FLOOR' ? FIRST_FLOOR_MAP : SECOND_FLOOR_MAP;
            const { path } = findPath(map, STARTING_LOCATION, FINAL_LOCATION);
            if (path) {
                return res.send({ map: printMapWithRoute(path, map) });
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

            return res.send({ maps: [firstMap, secondMap] });
        }
    }
    return res.render('map');
}