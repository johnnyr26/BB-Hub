const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    day: {
        type: String,
    },
    lunch: [{
        type: String,
    }]
});

const SchoolDays = mongoose.model('SchoolDay', Schema);

module.exports = SchoolDays;