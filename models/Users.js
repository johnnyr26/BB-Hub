const mongoose = require('mongoose');
const Courses = require('./Courses');

const Schema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 200,
    },
    schedule: [{
        type: Courses.schema
    }]
});

Schema.statics.findByCredentials = async name => {
    const user = await Users.findOne({ name });
    if (!user) {
        const newUser = new Users({
            name
        })
        await newUser.save();
        return newUser;
    }
    return user;
}

const Users = mongoose.model('Users', Schema);
module.exports = Users;