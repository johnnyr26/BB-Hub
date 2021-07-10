const mongoose = require('mongoose');
const Users = require('./Users');

const Schema = mongoose.Schema({
    userId: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'Users'
    },
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


Schema.statics.attachSchedule = async (userId, scheduleObject) => {
    for (const courseObject of scheduleObject) {
        const { courseTitle, classRoom, teacher, period, letterDays } = courseObject;
        await mongoose.model('Users').updateOne({ _id: userId }, {
            $push: {
                schedule: {
                  courseTitle,
                  period,
                  letterDays,
                  classRoom,
                  teacher
                }
            }
        });
    }
}

const Courses = mongoose.model('Courses', Schema);

module.exports = Courses;