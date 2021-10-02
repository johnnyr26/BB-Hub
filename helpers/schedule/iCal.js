const { SCHEDULE_STRUCTURE, HIGH_SCHOOL_SCHEDULE } = require('../../assets/highSchoolSchedule');
const ical = require('ical-generator');


const Users = require('../../models/Users');
const SchoolDays = require('../../models/SchoolDays');

const formatSchedule = require('./formatSchedule');


const MONTHS = ["January","February","March","April","May","June","July",
            "August","September","October","November","December"];

module.exports = async id => {

    const user = await Users.findById(id);

    if (!user.schedule.length) {
        return;
    }

    user.schedule.sort((a, b) => {
        return a.period - b.period;
    });

    const formattedSchedule = formatSchedule(user.schedule);

    let schoolDays = await SchoolDays.find({});

    schoolDays = schoolDays.filter(schoolDay => {
        const validSchoolDay = schoolDay.day.substring(1, 8) === ' Day - ';
        return validSchoolDay;
    });

    const calendar = ical({name: 'Blind Brook Course Schedule'});

    schoolDays.map(schoolDay => {

        const letterDay = schoolDay.day[0];
        const letterDaySchedule = formattedSchedule[letterDay];

        const letterDayArray = schoolDay.day.split(' ');

        const month = letterDayArray[letterDayArray.length - 2];
        const monthIndex = MONTHS.indexOf(month);

        const day = letterDayArray[letterDayArray.length - 1];

        let year;

        const date = new Date();

        if ((date.getFullYear() > 7 && monthIndex > 7)) {
            year = date.getFullYear();
        } else if (date.getFullYear() < 7 && monthIndex > 7) {
            year = date.getFullYear() - 1;
        } else {
            year = date.getFullYear() + 1;
        }

        letterDaySchedule.forEach(course => {
            if (course.course.courseTitle.substring(0, 4) === 'FREE') {
                return;
            }
            const hourStart = parseInt(course.time.from.substring(0, course.time.from.indexOf(':')));
            const minuteStart = parseInt(course.time.from.substring(course.time.from.indexOf(':') + 1));

            const hourEnd = parseInt(course.time.to.substring(0, course.time.to.indexOf(':')));
            const minuteEnd = parseInt(course.time.to.substring(course.time.to.indexOf(':') + 1));

            const courseTimeStart = new Date(year, monthIndex, day, hourStart < 5 ? hourStart + 16 : hourStart + 4, minuteStart);
            const courseTimeEnd = new Date(year, monthIndex, day, hourEnd < 5 ? hourEnd + 16 : hourEnd + 4, minuteEnd);

            const title = course.course.courseTitle.substring(0, 5) === 'Lunch' ? 'Lunch' : `${course.course.courseTitle} (Period ${course.course.period})`

            calendar.createEvent({
                start: courseTimeStart,
                end: courseTimeEnd,
                summary: title,
                description: '',
                location: course.course.classRoom
            });
        });
    });

    return calendar;
}