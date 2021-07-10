module.exports = scheduleObject => {
    const addedPeriods = [];
    return scheduleObject.filter(schedule => {
        const notValidPeriod = isNaN(schedule.period);
        const alreadyAddedCourse = addedPeriods.includes(schedule.period);
        const missingInput = !Object.values(schedule).every(value => {
            if (typeof(value) === 'string') {
                return value.trim();
            }
            return value;
        });

        if (notValidPeriod || alreadyAddedCourse || missingInput) {
            return false;
        }
        addedPeriods.push(schedule.period);
        return true;
    });
}