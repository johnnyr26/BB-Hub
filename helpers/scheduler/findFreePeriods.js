const { SCHEDULE_STRUCTURE } = require('../../assets/highSchoolSchedule');

module.exports = scheduleObject => {
    const freePeriods = [];

    Object.entries(SCHEDULE_STRUCTURE).forEach(object => {
        const letter = object[0];
        const periods = object[1];
        periods.forEach(period =>  {
            const course = scheduleObject.find(course => course.letterDays.includes(letter) && course.period === period);
            if (!course) {
                let freePeriod = freePeriods.find(fPeriod => fPeriod.period === period);
                if (!freePeriod) {
                    freePeriod = {
                        period,
                        letterDays: [letter],
                        courseTitle: `FREE (Period ${period})`,
                        teacher: '',
                        classRoom: ''
                    }
                    freePeriods.push(freePeriod);
                } else {
                    freePeriod.letterDays.push(letter);
                }
            }
        });
    });

    freePeriods.forEach(freePeriod => {
        scheduleObject.push(freePeriod);
    });
}