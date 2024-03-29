const Users = require('../models/Users');
const Posts = require('../models/Posts');

const getScheduleForDay = require('../helpers/schedule/getScheduleForDay');
const getLunch = require('../helpers/lunch/getLunch');
const getAssignments = require('../helpers/classroom/getAssignments');
const getSportGames = require('../helpers/sports/getSportGames');
const getClubs = require('../helpers/clubs/getClubForDay');

module.exports.renderIndex = async (req, res) => {
    const user = await Users.findById(req.user._id);

    const scheduleObject = await getScheduleForDay(req.user._id);
    const { lunch } = await getLunch();
    const games = await getSportGames();
    const clubs = await getClubs();

    if (req.query.assignments) {
        try {
            const assignments = await getAssignments(req, res);
            return res.send({ assignments });
        } catch (e) {
            return res.send({
                authURL: await e
            });
        }
    }

    return res.render('pages/index', { 
        title: 'BB Hub',
        scheduleObject,
        lunch,
        games,
        clubs,
        picture: req.user.picture, 
        id: req.user._id 
    });
}