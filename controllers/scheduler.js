const Users = require('../models/Users');

const parseLetterDays = require('../helpers/scheduler/parseLetterDays');
const formatCourseTitle = require('../helpers/scheduler/formatCourseTitle');
const formatSchedule = require('../helpers/scheduler/formatSchedule');
const filterInput = require('../helpers/scheduler/filterInput');
const getLetterDays = require('../helpers/scheduler/getSchoolDays').getLetterDays;
const getSharedCourses = require('../helpers/scheduler/findSharedCourses');


module.exports.renderScheduler = async (req, res) => {
    const user = await Users.findById(req.user._id);

    if (req.params.user) {
        const searchedUser = await Users.findOne({ name: req.params.user });
        if (!searchedUser) {
            return res.render('scheduler', { users, picture: req.user.picture, id: req.user._id });
        }
        const sharedCourses = getSharedCourses(user.schedule, searchedUser.schedule).map(course => course.name);
        const letterDays = await getLetterDays();
        const formattedSchedule = formatSchedule(searchedUser.schedule);
        return res.send({ 
            schedule: formattedSchedule, 
            letterDays
        });
    }
    const friends = (await Users.find({ friends: user.id })).map(member => member.name);

    const letterDays = await getLetterDays();
    const formattedSchedule = formatSchedule(user.schedule);

    return res.render('scheduler', { 
        user, 
        letterDays,
        schedule: formattedSchedule, 
        users: friends, 
        picture: req.user.picture, 
        id: req.user._id 
    });
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

    const schoolYearLetterDays = await getLetterDays();

    return res.status(201).send({ schedule: formattedSchedule, letterDays: schoolYearLetterDays });
};