const Users = require('../models/Users');

module.exports = async (req, res) => {
    const allUsers = await Users.find({});

    let roster = [];
    let title;

    const { course, period, club, sport } = req.query;

    if (course && period) {
        title = course;
        roster = allUsers.filter(user => user.schedule.find(userCourse => userCourse.courseTitle === course && userCourse.period === parseInt(period))).map(user => {
            return {
                name: user.name,
                picture: user.picture,
                id: user._id
            };
        });
    } else if (club) {
        title = club;
        roster = allUsers.filter(user => user.clubs.find(userClub => userClub === club)).map(user => {
            return {
                name: user.name,
                picture: user.picture,
                id: user._id
            };
        });
    } else if (sport) {
        title = sport;
        roster =  allUsers.filter(user => user.sports.find(userSport => userSport === sport)).map(user => {
            return {
                name: user.name,
                picture: user.picture,
                id: user._id
            };
        });
    }

    return res.render('pages/roster', { 
        title,
        period,
        roster,
        picture: req.user.picture,
        id: req.user._id
    });
};