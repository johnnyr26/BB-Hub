const { SCHEDULE_STRUCTURE, HIGH_SCHOOL_SCHEDULE } = require('../../assets/highSchoolSchedule');

module.exports = scheduleObject => {
    const formatttedSchedule = {};
    Object.entries(SCHEDULE_STRUCTURE).forEach(object => {
        const letter = object[0];
        const periods = object[1];
        const courses = periods.map((period, block) =>  {
            const course = scheduleObject.find(courseObject => courseObject.period === period && courseObject.letterDays.includes(letter));
            const time = HIGH_SCHOOL_SCHEDULE.times.find(timeBlock => timeBlock.block === block + 1);
            return {
                course,
                time
            };
        });
        formatttedSchedule[letter] = courses;
    });
    return formatttedSchedule;
}