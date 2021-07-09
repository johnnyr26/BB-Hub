const parseLetterDays = require('../helpers/Scheduler/parseLetterDays');
const formatCourseTitle = require('../helpers/Scheduler/formatCourseTitle');
const formatSchedule = require('../helpers/Scheduler/formatSchedule');

module.exports.renderScheduler = (req, res) => {
    return res.render('scheduler');
}

module.exports.uploadSchedule = (req, res) => {
    if (!req.body.schedule) {
        return res.status(500).error('No schedule');
    }
    const uncleanedSchedule = req.body.schedule;
    
    const schedule = uncleanedSchedule.split(' \n').filter(str => str);
    
    const scheduleObject = schedule.map(courseStringInfo => {
        const courseInfo = courseStringInfo.split('\t');
        const letterDays = parseLetterDays(courseInfo[0]);
        const period = parseInt(courseInfo[1]);
        const classRoom = courseInfo[2];
        const courseTile = formatCourseTitle(courseInfo[4]);
        const teacher = courseInfo[6];

        return {
            letterDays,
            period,
            classRoom,
            courseTile,
            teacher
        };
    });
    const formattedSchedule = formatSchedule(scheduleObject);

    return res.status(201).send({ formattedSchedule });
}
