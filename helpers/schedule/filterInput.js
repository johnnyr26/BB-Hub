module.exports = scheduleObject => {
    const addedCourses = [];
    return scheduleObject.filter(schedule => {
        const notValidPeriod = isNaN(schedule.period);
        const alreadyAddedCourse = addedCourses.find(course =>{
            const sameCourseTitle = course.courseTitle === schedule.courseTitle;
            const samePeriod = course.period === schedule.period;
            const sameLetterDays = course.letterDays.every(letterDay => {
                return schedule.letterDays.includes(letterDay);
            });
            const sameTeacher = course.teacher === schedule.teacher;
            const sameClassRoom = course.classRoom === schedule.classRoom;
            return sameCourseTitle && samePeriod && sameLetterDays && sameTeacher && sameClassRoom;
        });
        if (!alreadyAddedCourse) {
            addedCourses.push(schedule);
        }
        const missingInput = !Object.values(schedule).every(value => {
            if (value.courseTitle === 'FREE') {
                return true;
            }
            if (typeof(value) === 'string') {
                return value.trim();
            }
            return value;
        });
        return !notValidPeriod && !alreadyAddedCourse && !missingInput;
    });
}