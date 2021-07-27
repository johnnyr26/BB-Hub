const Users = require('../models/Users');
const Posts = require('../models/Posts');

const getScheduleForDay = require('../helpers/schedule/getScheduleForDay');
const getLunch = require('../helpers/lunch/getLunch');
const getAssignments = require('../helpers/classroom/getAssignments');

module.exports.renderIndex = async (req, res) => {
    const user = await Users.findById(req.user._id);
    if (!user) {
        return res.render('pages/index', { title: 'BB Hub', picture: req.user.picture, id: req.user._id }); 
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
        picture: req.user.picture, 
        id: req.user._id 
    });
}