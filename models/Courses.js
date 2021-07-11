const mongoose = require('mongoose');

const Schema = mongoose.Schema({
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
});

const Courses = mongoose.model('Courses', Schema);

module.exports = Courses;