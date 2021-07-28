const Users = require('../models/Users');
const clubs = require('../assets/clubs/clubs');
const sports = require('../assets/sports/sports');
const privacy = require('../assets/privacy/privacy');

const getSharedCourses = require('../helpers/schedule/findSharedCourses');

module.exports.renderUser = async (req, res) => {
    if (req.params.user) {
        const id = req.params.user;

        const user = await Users.findById(req.user._id);
        const friendUser = await Users.findById(id);

        friendUser.schedule.sort((a, b) => {
            return a.period - b.period;
        });
        
        const sharedCourses = user.id !== friendUser.id ? getSharedCourses(user.schedule, friendUser.schedule).map(course => course.courseTitle) : [];

        const { 
            name: userName, 
            email: userEmail, 
            friends: userFriends, 
            picture: userPicture, 
            schedule: userSchedule, 
            gradYear: userGradYear, 
            clubs: userClubs, 
            sports: userSports, 
            privacy: userPrivacy 
        } = friendUser;

        res.render('pages/users', {
            userName,
            userEmail,
            userGradYear,
            userClubs: userClubs ? userClubs : [],
            userSports: userSports ? userSports : [],
            userPrivacy,
            userFriends,
            userPicture,
            userSchedule,
            sharedCourses,
            privacy,
            userId: id,
            clubs,
            sports,
            picture: req.user.picture,
            id: req.user._id
        });
    }
}

module.exports.editProfile = async (req, res) => {
    try {
        const { gradYear, clubs, sports, privacy } = req.body;
        const user = await Users.findById(req.user._id);

        user.gradYear = gradYear;
        user.clubs = clubs;
        user.sports = sports;
        user.privacy = privacy;

        await user.save();

        res.send({ gradYear, clubs, sports });
    } catch (e) {
        res.send({ success: false });
    }    
}