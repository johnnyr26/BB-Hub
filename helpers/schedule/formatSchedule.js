const { SCHEDULE_STRUCTURE, HIGH_SCHOOL_SCHEDULE } = require('../../assets/highSchoolSchedule');

const timeFormat = time => {
    let [hour, min] = time.split(":");
    const intHour = parseInt(hour);
    if (intHour > 12) {
        hour = (intHour - 12).toString();
    } else {
        hour = intHour.toString();
    }
    return `${hour}:${min}`;
}


module.exports = scheduleObject => {
    const formatttedSchedule = {};
    Object.entries(SCHEDULE_STRUCTURE).forEach(object => {
        const letter = object[0];
        const periods = object[1];
        const courses = periods.map((period, block) =>  {
            const course = scheduleObject.find(courseObject => courseObject.period === period && courseObject.letterDays.includes(letter));
            const time = HIGH_SCHOOL_SCHEDULE.times.find(timeBlock => timeBlock.block === block + 1);

            time.from = timeFormat(time.from);
            time.to = timeFormat(time.to);
            
            return {
                course,
                time
            };
        });
        const lunchPeriodIndex = HIGH_SCHOOL_SCHEDULE.times.findIndex(block => block.block === 'LUNCH');
        const lunchPeriod = HIGH_SCHOOL_SCHEDULE.times.find(block => block.block === 'LUNCH');
        courses.splice(lunchPeriodIndex, 0, {
            course: {
                period: 'LUNCH',
                letterDays: Object.keys(SCHEDULE_STRUCTURE),
                courseTitle: `Lunch`,
                teacher: '',
                classRoom: ''
            },
            time: lunchPeriod
        });
        formatttedSchedule[letter] = courses;
    });
    return formatttedSchedule;
}