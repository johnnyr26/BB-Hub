const Users = require('../models/Users');
const Posts = require('../models/Posts');

const getScheduleForDay = require('../helpers/schedule/getScheduleForDay');
const getLunch = require('../helpers/lunch/getLunch');
const getAssignments = require('../helpers/classroom/getAssignments');
const getSportGames = require('../helpers/sports/getSportGames');

module.exports.renderIndex = async (req, res) => {
    const user = await Users.findById(req.user._id);
    
    if (req.query.newuser) {
        return res.redirect(`/users/${req.user._id}?newuser=true`);
    }

    const allUsers = await Users.find({});
    const availableFriends = allUsers.filter(member => {
        const notSelf = member.id !== user.id;
        const notAlreadyFriends = !user.friends.includes(member.id);
        const notFriendRequested = !user.friendRequests.includes(member.id);
        const notRequestedFriends = !user.requestedFriends.includes(member.id);
        return notSelf && notAlreadyFriends && notFriendRequested && notRequestedFriends;
    }).map(userInfo => userInfo.name);

    const friendRequests = await Promise.all(user.friendRequests.map(async id => (await Users.findById(id)).name));
    const requestedFriends = await Promise.all(user.requestedFriends.map(async id => (await Users.findById(id)).name));

    const scheduleObject = await getScheduleForDay(req.user._id);
    const { lunch } = await getLunch();
    const posts = await Posts.find({});
    const games = await getSportGames();

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
        availableFriends, 
        friendRequests,
        requestedFriends,
        scheduleObject,
        posts,
        lunch,
        games,
        picture: req.user.picture, 
        id: req.user._id 
    });
}