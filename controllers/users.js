const Users = require('../models/Users');
const Posts = require('../models/Posts');

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
            requestedFriends: userRequestedFriends,
            friendRequests: userFriendRequests,
            picture: userPicture, 
            schedule: userSchedule, 
            gradYear: userGradYear, 
            clubs: userClubs, 
            sports: userSports, 
            privacy: userPrivacy 
        } = friendUser;

        const userPosts = (await Posts.find({ 'user': id })).filter(post => post.grades.includes(req.user.gradYear)).reverse();

        const responseInfo =  {
            userName,
            userEmail,
            userGradYear,
            userClubs,
            userSports,
            userPrivacy,
            userFriends,
            userPicture,
            userSchedule,
            userRequestedFriends,
            userFriendRequests,
            userId: id,
            userPosts,
            sharedCourses,
            privacy,
            clubs,
            sports,
            picture: req.user.picture,
            id: req.user._id
        };

        if (req.query.newuser) {
            responseInfo['newUser'] = true;
        }
        
        res.render('pages/users', responseInfo);
    }
}

module.exports.editProfile = async (req, res) => {
    try {
        const user = await Users.findById(req.user._id);
        const allUsers = await Users.find({});

        if (req.body.friendRequest) {
            const id = req.body.friendRequest;
            const friendRequestUser = allUsers.find(member => member._id.toString() === id);
            if (user.requestedFriends.includes(friendRequestUser.id) || friendRequestUser.friendRequests.includes(user.id) || user.friendRequests.includes(friendRequestUser.id) || friendRequestUser.requestedFriends.includes(user.id)) {
                return res.send({ success: false });
            }
            user.requestedFriends.push(friendRequestUser.id);
            friendRequestUser.friendRequests.push(user.id);
            await user.save();
            await friendRequestUser.save();
            return res.send({ success: true });
        }

        if (req.body.acceptedFriendRequest) {
            const id = req.body.acceptedFriendRequest;
            const acceptedFriend = allUsers.find(member => member._id.toString() === id);

            if (user.friends.includes(acceptedFriend)) {
                return res.send({ success: false });
            }

            user.friends.push(acceptedFriend);
            user.friendRequests = user.friendRequests.filter(friendId => friendId.toString() !== acceptedFriend.id);
            acceptedFriend.friends.push(user);
            acceptedFriend.requestedFriends = acceptedFriend.requestedFriends.filter(friendId => friendId.toString() !== user.id);

            await user.save();
            await acceptedFriend.save();

            return res.send({ userId: acceptedFriend._id });
        }

        if (req.body.deniedFriendRequest) {
            const id = req.body.deniedFriendRequest;
            const deniedFriend = allUsers.find(member => member._id.toString() === id);
            if (user.friends.includes(deniedFriend)) {
                return res.send({ success: false });
            }
            user.friendRequests = user.friendRequests.filter(friendId => friendId.toString() !== deniedFriend.id);
            deniedFriend.requestedFriends = deniedFriend.requestedFriends.filter(friendId => friendId.toString() !== user.id);
            await user.save();
            await deniedFriend.save();
            return res.send({ success: true });
        }

        if (req.body.cancelledFriendRequest) {
            const id = req.body.cancelledFriendRequest;
            const cancelledFriend = allUsers.find(member => member._id.toString() === id);
            if (!user.requestedFriends.includes(cancelledFriend.id) && !cancelledFriend.friendRequests.includes(user.id)) {
                return res.send({ success: false });
            }
            user.requestedFriends = user.requestedFriends.filter(friendId => friendId.toString() !== cancelledFriend.id);
            cancelledFriend.friendRequests = cancelledFriend.friendRequests.filter(friendId => friendId.toString() !== user.id);
            await user.save();
            await cancelledFriend.save();
            return res.send({ success: true });
        }

        const { gradYear, clubs, sports, privacy } = req.body;

        user.gradYear = gradYear;
        user.clubs = clubs;
        user.sports = sports;
        user.privacy = privacy;

        await user.save();

        res.send({ gradYear, clubs, sports });
    } catch (e) {
        console.log(e);
        res.send({ success: false });
    }    
}