const axios = require('axios');

const Users = require('../../models/Users');
const SchoolDays = require('../../models/SchoolDays');
const getLetterDays = require('./getSchoolDays').getLetterDays;
const formatSchedule = require('./formatSchedule');
const getDates = require('./getDates');

const getWeekDay = (day) => {
    switch(day) {
        case 0: return 'Sunday';
        case 1: return 'Monday';
        case 2: return 'Tuesday';
        case 3: return 'Wednesday';
        case 4: return 'Thursday';
        case 5: return 'Friday';
        case 6: return 'Saturday';
        default: break;
    }
}

const getMonth = (month) => {
    switch(month) {
        case 0: return 'January';
        case 1: return 'February';
        case 2: return 'March';
        case 3: return 'April';
        case 4: return 'May';
        case 5: return 'June';
        case 6: return 'July'
        case 7: return 'August';
        case 8: return 'September';
        case 9: return 'October';
        case 10: return 'November';
        case 11: return 'December'
    }
}

module.exports = async userId => {
    const user = await Users.findById(userId);
   
    let unparsedDate = new Date();
    unparsedDate.setHours(unparsedDate.getHours() + 4);
    
    let date = unparsedDate.getDate();
    let month = getMonth(unparsedDate.getMonth());
    let weekday = getWeekDay(unparsedDate.getDay());

    let schoolDays = await SchoolDays.find({});
    if (!schoolDays.length) {
        const { startYear, endYear } = getDates();
        const tokenResponse = await axios.get('https://www.blindbrook.org/Generator/TokenGenerator.ashx/ProcessRequest');
        const response = await axios.get(
            `https://awsapieast1-prod2.schoolwires.com/REST/api/v4/CalendarEvents/GetEvents/1009?StartDate=${startYear}-09-01&EndDate=${endYear}-06-30&ModuleInstanceFilter=&CategoryFilter=&IsDBStreamAndShowAll=true`,
            {
                headers: { Authorization: `Bearer ${tokenResponse.data.Token}` } 
            }       
        );
        letterDays = response.data.map(day => day.Title);
        for (const day of letterDays) {
            const newSchoolDay = new SchoolDays({ day });
            await newSchoolDay.save();
        }
        schoolDays = await SchoolDays.find({});
    }
    let schoolDay = schoolDays.find(schoolDay => schoolDay.day.substring(8) === `${weekday}, ${month} ${date}`);
    while (!schoolDay) {
        unparsedDate.setDate(unparsedDate.getDate() + 1);
        date = unparsedDate.getDate();
        month = getMonth(unparsedDate.getMonth());
        weekday = getWeekDay(unparsedDate.getDay());
        schoolDay = schoolDays.find(schoolDay => schoolDay.day.substring(8) === `${weekday}, ${month} ${date}`);
    }



    const letterDay = await getLetterDays(unparsedDate);

    const schedule = formatSchedule(user.schedule);
    const order = schedule[letterDay.day[0]];
    return {
        letterDay,
        schedule: order
    };
};