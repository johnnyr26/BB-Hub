const Users = require('../../models/Users');
const SchoolDays = require('../../models/SchoolDays');
const getLetterDays = require('./getSchoolDays').getLetterDays;
const formatSchedule = require('./formatSchedule');

const getWeekDay = (day) => {
    switch(day) {
        case 0: return 'Sunday';
        case 1: return 'Monday';
        case 2: return 'Tuesday';
        case 3: return 'Wednesday';
        case 4: return 'Thursday';
        case 5: return 'Friday';
        case 6: return 'Saturday';
        default: break;
    }
}

const getMonth = (month) => {
    switch(month) {
        case 0: return 'January';
        case 1: return 'February';
        case 2: return 'March';
        case 3: return 'April';
        case 4: return 'May';
        case 5: return 'June';
        case 6: return 'July'
        case 7: return 'August';
        case 8: return 'September';
        case 9: return 'October';
        case 10: return 'November';
        case 11: return 'December'
    }
}

module.exports = async userId => {
    const user = await Users.findById(userId);
   
    let unparsedDate = new Date();
    let date = unparsedDate.getDate();
    let month = getMonth(unparsedDate.getMonth());
    let weekday = getWeekDay(unparsedDate.getDay());

    const schoolDays = await SchoolDays.find({});
    let schoolDay = schoolDays.find(schoolDay => schoolDay.day.substring(8) === `${weekday}, ${month} ${date}`);
    while (!schoolDay) {
        unparsedDate.setDate(unparsedDate.getDate() + 1);
        date = unparsedDate.getDate();
        month = getMonth(unparsedDate.getMonth());
        weekday = getWeekDay(unparsedDate.getDay());
        schoolDay = schoolDays.find(schoolDay => schoolDay.day.substring(8) === `${weekday}, ${month} ${date}`);
    }



    const letterDay = await getLetterDays(unparsedDate);

    const schedule = formatSchedule(user.schedule);
    const order = schedule[letterDay.day[0]];
    return {
        letterDay,
        schedule: order
    };
};