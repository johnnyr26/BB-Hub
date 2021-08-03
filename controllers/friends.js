const Users = require('../models/Users');

const getSharedCourses = require('../helpers/schedule/findSharedCourses');

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
            picture: userInfo.picture,
            id: userInfo.id,
            gradYear: userInfo.gradYear,
            clubs: userInfo.clubs,
            sports: userInfo.sports,
            schedule: userInfo.schedule,
            availableFriend: true
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
            picture: friend.picture,
            id,
            clubs: friend.clubs,
            sports: friend.sports,
            schedule: friend.schedule
        };
    }));
    const requestedFriends = await Promise.all(user.requestedFriends.map(async id => {
        const friend = await Users.findById(id);
        return {
            name: friend.name,
            picture: friend.picture,
            id,
            gradYear: friend.gradYear
        };
    }));

    const friendsInSameGrade = availableFriends.filter(friend => friend.gradYear === user.gradYear);
    const friendsInDiffGrade = availableFriends.filter(friend => friend.gradYear !== user.gradYear);

    sortFriends(user, requestedFriends);
    sortFriends(user, friendsInSameGrade);
    sortFriends(user, friendsInDiffGrade);

    const sortedFriends = [...requestedFriends, ...friendsInSameGrade, ...friendsInDiffGrade];

    const sortedFriendsByGrade = [];

    const date = new Date();
    const year = date.getMonth() < 6 ? date.getFullYear() : date.getFullYear() + 1;

    for (let grade = year; grade < year + 4; grade ++) {
        const yearStudents = sortedFriends.filter(friend => friend.gradYear === grade);
        sortedFriendsByGrade.push({
            grade: 12 - (grade - year),
            friends: yearStudents
        });
    }

    sortedFriendsByGrade.reverse();

    sortedFriendsByGrade.push({
        grade: 'Unknown',
        friends: sortedFriends.filter(friend => !friend.gradYear)
    });

    const sameYearIndex = sortedFriendsByGrade.findIndex(entry => entry.grade === 12 - (user.gradYear - year));

    const sameYearEntry = sortedFriendsByGrade[sameYearIndex];
    sortedFriendsByGrade.splice(sameYearIndex, 1);
    sortedFriendsByGrade.unshift(sameYearEntry);

    console.log(sortedFriendsByGrade);

    return res.render('pages/friends', {
        id: req.user._id,
        picture: req.user.picture,
        availableFriends: sortedFriendsByGrade,
        friends,
        friendRequests,
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
            return res.send({ userId: acceptedFriend._id });
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

        if (req.body.cancelledFriendRequest) {
            const name = req.body.cancelledFriendRequest;
            const cancelledFriend = allUsers.find(member => member.name === name);
            if (!user.requestedFriends.includes(cancelledFriend.id) && !cancelledFriend.friendRequests.includes(user.id)) {
                return res.send({ success: false });
            }
            user.requestedFriends = user.requestedFriends.filter(friendId => friendId.toString() !== cancelledFriend.id);
            cancelledFriend.friendRequests = cancelledFriend.friendRequests.filter(friendId => friendId.toString() !== user.id);
            await user.save();
            await cancelledFriend.save();
            return res.send({ success: true });
        }

        return res.send({ success: true });
    } catch (e) {
        console.log(e);
        console.log(e.message);
    }
};

const sortFriends = (user, friends) => {
    friends.sort((a, b) => {
        let aScore = 0;
        let bScore = 0;

        if (user.clubs) {
            user.clubs.forEach(club => {
                if (a.clubs && a.clubs.includes(club)) {
                    aScore ++;
                }
                if (b.clubs && b.clubs.includes(club)) {
                    bScore ++;
                }
            });
        }
        
        if (user.sports) {
            user.sports.forEach(sport => {
                if (a.sports && a.sports.includes(sport)) {
                    aScore ++;
                }
                if (b.sports && b.sports.includes(sport)) {
                    bScore ++;
                }
            });
        }
        

        if (a.schedule) {
            aScore += getSharedCourses(user.schedule, a.schedule).length;
        }
        if (b.schedule) {
            bScore += getSharedCourses(user.schedule, b.schedule).length;
        }

        return bScore - aScore;
    });
}