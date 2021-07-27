const Users = require('../models/Users');

const parseLetterDays = require('../helpers/schedule/parseLetterDays');
const formatCourseTitle = require('../helpers/schedule/formatCourseTitle');
const formatSchedule = require('../helpers/schedule/formatSchedule');
const filterInput = require('../helpers/schedule/filterInput');
const getLetterDays = require('../helpers/schedule/getSchoolDays').getLetterDays;
const getSharedCourses = require('../helpers/schedule/findSharedCourses');
const findFreePeriods = require('../helpers/schedule/findFreePeriods');

const presetColors = [
    "#ff6347",
    "#1e90ff",
    "#ffff00",
    "#ffa500",
    "#3cb371",
    "#add8e6",
    "#ffc0cb",
    "#d6ff99",
    "#dcdcdc",
    "#fae7b5",
    "#a89de1",
    "#deb887"
];

module.exports.renderSchedule = async (req, res) => {
    const user = await Users.findById(req.user._id);

    if (req.params.user && req.params.user !== 'table-schedule') {
        const searchedUser = await Users.findOne({ name: req.params.user });
        if (!searchedUser) {
            return res.render('pages/schedule', { users, picture: req.user.picture, id: req.user._id });
        }
        const sharedCourses = getSharedCourses(user.schedule, searchedUser.schedule).map(course => course.courseTitle);
        const letterDays = await getLetterDays();
        const formattedSchedule = formatSchedule(searchedUser.schedule);
        return res.send({ 
            schedule: formattedSchedule, 
            letterDays,
            sharedCourses
        });
    }
    const friends = (await Users.find({ friends: user.id })).filter(user => user.schedule.length > 0).map(member => member.name);
    const letterDays = await getLetterDays();
    const courseBackgroundColors = user.schedule.map((course, index) => {
        return {
            name:  course.courseTitle,
            color: presetColors[index]
        }
    });
    const formattedSchedule = formatSchedule(user.schedule);

    if (req.params.user === 'table-schedule') {
        return res.render('pages/table-schedule', {
            user, 
            letterDays,
            presetColors,
            schedule: formattedSchedule, 
            courseBackgroundColors,
            users: friends, 
            picture: req.user.picture, 
            id: req.user._id 
        });
    }
    return res.render('pages/schedule', { 
        user, 
        letterDays,
        presetColors,
        userSchedule: user.schedule,
        schedule: formattedSchedule, 
        courseBackgroundColors,
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
    }).filter(course => !course.includes('Community Service'));

    const filteredScheduleObject = filterInput(scheduleObject);
    findFreePeriods(filteredScheduleObject);
    await Users.findByIdAndUpdate(req.user._id, { schedule: filteredScheduleObject});
    const formattedSchedule = formatSchedule(filteredScheduleObject);

    const schoolYearLetterDays = await getLetterDays();

    return res.status(201).send({ schedule: formattedSchedule, letterDays: schoolYearLetterDays });
};