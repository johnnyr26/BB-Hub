module.exports = (schedule1, schedule2) => {
    const sharedCourses = [];
    schedule1.forEach(course1 => {
        schedule2.forEach(course2 => {
            const sameCourseTitle = course1.name === course2.name;
            const samePeriods = course1.period === course2.period;
            const sameTeacher = course1.teacher === course2.teacher; 
            const sameLetterDays = course1.letterDays.every(letterDay => course2.letterDays.includes(letterDay));
            if (sameCourseTitle && samePeriods && sameTeacher && sameLetterDays) {
                sharedCourses.push(course1);
            }
        });
    });
    return sharedCourses;
}

