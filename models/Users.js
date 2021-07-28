const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); 

const Schema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 200,
    },
    email: {
        type: String,
        required: true
    },
    picture: {
        type: String
    },
    gradYear: {
        type: Number
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    schedule: [{
        courseTitle: {
            type: String,
        },
        period: {
            type: Number,
        },
        classRoom: {
            type: String
        },
        letterDays: [{
            type: String
        }],
        teacher: {
            type: String
        }
    }],
    friends: [{
        type: mongoose.ObjectId,
    }],
    friendRequests: [{
        type: mongoose.ObjectId,
    }],
    requestedFriends: [{
        type: mongoose.ObjectId,
    }],
    clubs: [{
        type: String
    }],
    sports: [{
        type: String
    }],
    privacy: [{
        type: String
    }],
    googleRefreshToken: {
        type: String
    }
});

Schema.virtual('Posts', {
    ref: 'Posts',
    localField: '_id',
    foreignField: 'user'
})

Schema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.secret);
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
}

Schema.statics.findByCredentials = async (name, email, picture) => {
    const user = await Users.findOne({ email });
    // incase the user changed their profile picture
    if (user && user.picture !== picture) {
        user.picture = picture;
        await user.save();
    }
    if (!user) {
        const newUser = new Users({
            name,
            email,
            picture
        })
        await newUser.save();
        return newUser;
    }
    return user;
}

const Users = mongoose.model('Users', Schema);
module.exports = Users;