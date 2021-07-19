const Users = require('../../models/Users');
const getLetterDays = require('./getSchoolDays').getLetterDays;
const formatSchedule = require('./formatSchedule');

module.exports = async userId => {
    const user = await Users.findById(userId);
    const day = new Date(2020, 8, 9);
    const letterDay = await getLetterDays(day);
    const schedule = formatSchedule(user.schedule);
    const order = schedule[letterDay.day[0]];
    return {
        letterDay,
        schedule: order
    };
};