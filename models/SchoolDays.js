const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    day: {
        type: String,
    },
    lunch: [{
        name: {
            type: String,
        },
        description: {
            type: String
        }
    }]
});

const SchoolDays = mongoose.model('SchoolDay', Schema);

module.exports = SchoolDays;