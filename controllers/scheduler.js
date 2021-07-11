const axios = require('axios');

const parseLetterDays = require('../helpers/scheduler/parseLetterDays');
const formatCourseTitle = require('../helpers/scheduler/formatCourseTitle');
const formatSchedule = require('../helpers/scheduler/formatSchedule');
const filterInput = require('../helpers/scheduler/filterInput');
const getDates = require('../helpers/scheduler/getDates');

const Users = require('../models/Users');

module.exports.renderScheduler = async (req, res) => {
    const { startYear, endYear } = getDates();
    const tokenResponse = await axios.get('https://www.blindbrook.org/Generator/TokenGenerator.ashx/ProcessRequest');
    const response = await axios.get(
        `https://awsapieast1-prod2.schoolwires.com/REST/api/v4/CalendarEvents/GetEvents/1009?StartDate=${startYear - 1}-09-01&EndDate=${endYear - 1}-06-30&ModuleInstanceFilter=&CategoryFilter=&IsDBStreamAndShowAll=true`,
        {
            headers: { Authorization: `Bearer ${tokenResponse.data.Token}` } 
        }       
    );
    const letterDays = response.data.map(day => day.Title);

    const user = await Users.findById(req.user._id);
    if (user.schedule.length > 0) {
        const formattedSchedule = formatSchedule(user.schedule);
        return res.render('scheduler', { 
            schedule: formattedSchedule, 
            letterDays,
            picture: req.user.picture, 
            id: req.user._id 
        });
    }
    return res.render('scheduler', { picture: req.user.picture, id: req.user._id });
};

module.exports.uploadSchedule = async (req, res) => {
    if (!req.body.schedule) {
        return res.status(500).error('No schedule');
    }
   
    const { schedule: uncleanedSchedule } = req.body;
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

    await Users.findByIdAndUpdate(req.user._id, { schedule: filteredScheduleObject});

    const formattedSchedule = formatSchedule(filteredScheduleObject);

    const { startYear, endYear } = getDates();

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