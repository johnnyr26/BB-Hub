const Users = require('../models/Users');

module.exports.renderFriends = async (req, res) => {
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
    }).map(userInfo => {
        return {
            name: userInfo.name,
            picture: userInfo.picture
        }
    });

    const friends = await Promise.all(user.friends.map(async id => {
        const friend = await Users.findById(id);
        return {
            name: friend.name,
            picture: friend.picture,
            id
        };
    }));
    const friendRequests = await Promise.all(user.friendRequests.map(async id => {
        const friend = await Users.findById(id);
        return {
            name: friend.name,
            picture: friend.picture
        };
    }));
    const requestedFriends = await Promise.all(user.requestedFriends.map(async id => {
        const friend = await Users.findById(id);
        return {
            name: friend.name,
            picture: friend.picture
        };
    }));
    return res.render('pages/friends', {
        id: req.user._id,
        picture: req.user.picture,
        availableFriends,
        friends,
        friendRequests,
        requestedFriends
    });
};

module.exports.updateFriends = async (req, res) => {
    try {
        const user = await Users.findById(req.user._id);
        const allUsers = await Users.find({});

        if (req.body.friendRequest) {
            const name = req.body.friendRequest;
            const friendRequestUser = allUsers.find(member => member.name === name);
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
            const name = req.body.acceptedFriendRequest;
            const acceptedFriend = allUsers.find(member => member.name === name);
            if (user.friends.includes(acceptedFriend)) {
                return res.send({ success: false });
            }
            user.friends.push(acceptedFriend);
            user.friendRequests = user.friendRequests.filter(friendId => friendId.toString() !== acceptedFriend.id);
            acceptedFriend.friends.push(user);
            acceptedFriend.requestedFriends = acceptedFriend.requestedFriends.filter(friendId => friendId.toString() !== user.id);
            await user.save();
            await acceptedFriend.save();
            return res.send({ success: true });
        }
        if (req.body.deniedFriendRequest) {
            const name = req.body.deniedFriendRequest;
            const deniedFriend = allUsers.find(member => member.name === name);
            if (user.friends.includes(deniedFriend)) {
                return res.send({ success: false });
            }
            user.friendRequests = user.friendRequests.filter(friendId => friendId.toString() !== deniedFriend.id);
            deniedFriend.requestedFriends = deniedFriend.requestedFriends.filter(friendId => friendId.toString() !== user.id);
            await user.save();
            await deniedFriend.save();
            return res.send({ success: true });
        }
        return res.send({ success: true });
    } catch (e) {
        console.log(e);
        console.log(e.message);
        
    }
};