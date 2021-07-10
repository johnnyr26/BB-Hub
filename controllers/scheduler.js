const axios = require('axios');

const parseLetterDays = require('../helpers/scheduler/parseLetterDays');
const formatCourseTitle = require('../helpers/scheduler/formatCourseTitle');
const formatSchedule = require('../helpers/scheduler/formatSchedule');
const filterInput = require('../helpers/scheduler/filterInput');
const getDates = require('../helpers/scheduler/getDates');

const Users = require('../models/Users');
const Courses = require('../models/Courses');

module.exports.renderScheduler = (req, res) => {
    return res.render('scheduler');
};

module.exports.uploadSchedule = async (req, res) => {
    if (!req.body.schedule || !req.body.name) {
        return res.status(500).error('No schedule');
    }
   
    const { name, schedule: uncleanedSchedule } = req.body;
    const schedule = uncleanedSchedule.split('\n').filter(str => str);
    
    const scheduleObject = schedule.map(courseStringInfo => {
        const courseInfo = courseStringInfo.split('\t').filter(str => str);
        const letterDays = parseLetterDays(courseInfo[0]);
        const period = parseInt(courseInfo[1]);
        const classRoom = courseInfo[2];
        const courseTitle = (courseInfo[4]);
        const teacher = courseInfo[6];

        return {
            letterDays,
            period,
            classRoom,
            courseTitle,
            teacher
        };
    });

    const filteredScheduleObject = filterInput(scheduleObject);

    const user = await Users.findByCredentials(name);
    Courses.attachSchedule(user._id, filteredScheduleObject);

    const formattedSchedule = formatSchedule(filteredScheduleObject);

    const { startYear, endYear } = getDates();
    console.log(startYear, endYear);

    const tokenResponse = await axios.get('https://www.blindbrook.org/Generator/TokenGenerator.ashx/ProcessRequest');
    const response = await axios.get(
        `https://awsapieast1-prod2.schoolwires.com/REST/api/v4/CalendarEvents/GetEvents/1009?StartDate=${startYear - 1}-09-01&EndDate=${endYear - 1}-06-30&ModuleInstanceFilter=&CategoryFilter=&IsDBStreamAndShowAll=true`,
        {
            headers: { Authorization: `Bearer ${tokenResponse.data.Token}` } 
        }       
    );
    const schoolYearLetterDays = response.data.map(day => day.Title);
    return res.status(201).send({ schedule: formattedSchedule, letterDays: schoolYearLetterDays });
};