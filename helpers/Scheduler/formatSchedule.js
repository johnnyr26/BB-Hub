const { scheduleStructure, highSchoolSchedule } = require('../../configs/highSchoolSchedule');

module.exports = scheduleObject => {
    return [...Object.values(scheduleStructure)].map(periods => {
        return periods.map((period, block) =>  {
            const course = scheduleObject.find(courseObject => courseObject.period === period);
            const time = highSchoolSchedule.times.find(timeBlock => timeBlock.block === block + 1);
            return {
                course,
                time
            };
        });
    });
}

