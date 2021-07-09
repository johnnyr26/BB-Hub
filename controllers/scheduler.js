const axios = require('axios');

const parseLetterDays = require('../helpers/scheduler/parseLetterDays');
const formatCourseTitle = require('../helpers/scheduler/formatCourseTitle');
const formatSchedule = require('../helpers/scheduler/formatSchedule');

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
        const courseTitle = formatCourseTitle(courseInfo[4]);
        const teacher = courseInfo[6];

        return {
            letterDays,
            period,
            classRoom,
            courseTitle,
            teacher
        };
    });
    
    const formattedSchedule = formatSchedule(scheduleObject);

    const letterDays = [];

    axios.get('https://www.blindbrook.org/Generator/TokenGenerator.ashx/ProcessRequest')
    .then(tokenResponse => {
        axios.get(
            'https://awsapieast1-prod2.schoolwires.com/REST/api/v4/CalendarEvents/GetEvents/1009?StartDate=2020-09-01&EndDate=2021-06-30&ModuleInstanceFilter=&CategoryFilter=&IsDBStreamAndShowAll=true',
            {
                headers: { Authorization: `Bearer ${tokenResponse.data.Token}` } 
            }       
        )
        .then(response => {
            const data = response.data;
            data.forEach(day => {
                letterDays.push(day.Title);
            });
            return res.status(201).send({ schedule: formattedSchedule, letterDays });
        });
    });
    // return res.status(500).send({ error: 'was not able to load request' });
}