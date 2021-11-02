const Users = require('../models/Users');

const parseLetterDays = require('../helpers/schedule/parseLetterDays');
const formatCourseTitle = require('../helpers/schedule/formatCourseTitle');
const formatSchedule = require('../helpers/schedule/formatSchedule');
const filterInput = require('../helpers/schedule/filterInput');
const getLetterDays = require('../helpers/schedule/getSchoolDays').getLetterDays;
const getSharedCourses = require('../helpers/schedule/findSharedCourses');
const findFreePeriods = require('../helpers/schedule/findFreePeriods');
const detectSchedule = require('../helpers/schedule/detectSchedule');

const createICal = require('../helpers/schedule/iCal');

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

    user.schedule.sort((a, b) => {
        return a.period - b.period;
    });

    const letterDays = await getLetterDays();
    const courseBackgroundColors = user.schedule.map((course, index) => {
        return {
            name:  course.courseTitle,
            color: presetColors[index]
        }
    });
    const formattedSchedule = formatSchedule(user.schedule);

    const calendar = user.schedule ? await createICal(user._id) : null;

    return res.render('pages/schedule', { 
        user, 
        letterDays,
        presetColors,
        userSchedule: user.schedule,
        schedule: formattedSchedule, 
        courseBackgroundColors,
        picture: req.user.picture, 
        id: req.user._id,
        calendar
    });
};

module.exports.uploadSchedule = async (req, res) => {

    const user = await Users.findById(req.user._id);

    if (req.body.removeCourse) {
        const courseId = req.body.removeCourse;
        const course = user.schedule.find(userCourse => userCourse._id.toString() === courseId);
        user.schedule = user.schedule.filter(userCourse => userCourse._id.toString() !== course._id.toString());
        user.schedule = user.schedule.filter(userCourse => userCourse.courseTitle.substring(0,4) !== 'FREE');
        findFreePeriods(user.schedule);
        await user.save();
        return res.send({ success: true });
    }

    if (req.body.newCourse) {
        const { newCourse } = req.body;
        user.schedule = user.schedule.filter(userCourse => userCourse.courseTitle.substring(0,4) !== 'FREE');
        user.schedule.push(newCourse);
        findFreePeriods(user.schedule);
        await user.save();
        return res.send({ success: true });
    }

    if (!req.body.schedule) {
        return res.send({ success: false });
    }

    
   
    const { schedule: uncleanedSchedule } = req.body;

    try {
        detectSchedule(uncleanedSchedule);
    } catch (e) {
        return res.send({ error: e.message });
    }


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
    }).filter(course => {
        if (course.courseTitle) {
            return !course.courseTitle.includes('Community Service');
        }
        return course;
    });

    const filteredScheduleObject = filterInput(scheduleObject);
    findFreePeriods(filteredScheduleObject);
    await Users.findByIdAndUpdate(req.user._id, { schedule: filteredScheduleObject});
    const formattedSchedule = formatSchedule(filteredScheduleObject);

    const schoolYearLetterDays = await getLetterDays();

    return res.status(201).send({ schedule: formattedSchedule, letterDays: schoolYearLetterDays });
};