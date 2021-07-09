const { scheduleStructure, highSchoolSchedule } = require('../../configs/highSchoolSchedule');

module.exports = scheduleObject => {
    const formatttedSchedule = {};
    Object.entries(scheduleStructure).forEach(object => {
        const letter = object[0];
        const periods = object[1];
        const courses = periods.map((period, block) =>  {
            const course = scheduleObject.find(courseObject => courseObject.period === period);
            const time = highSchoolSchedule.times.find(timeBlock => timeBlock.block === block + 1);
            return {
                course,
                time
            };
        });
        formatttedSchedule[letter] = courses;
    });
    return formatttedSchedule;
}