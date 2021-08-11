const axios = require('axios');

const SchoolDays = require('../../models/SchoolDays');
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


const getSchoolDays = async date => {
    const schoolDays = await SchoolDays.find({});
    if (schoolDays.length > 0) {
        if (date) {
            const weekDay = getWeekDay(date.getDay());
            const month = getMonth(date.getMonth());
            const day = date.getDate();
            const schoolDay = schoolDays.find(letterDay => letterDay.day.substring(8) === `${weekDay}, ${month} ${day}`);
            return schoolDay;
        }
        return schoolDays;
    }
    const { startYear, endYear } = getDates();
    const tokenResponse = await axios.get('https://www.blindbrook.org/Generator/TokenGenerator.ashx/ProcessRequest');
    const response = await axios.get(
        `https://awsapieast1-prod2.schoolwires.com/REST/api/v4/CalendarEvents/GetEvents/1009?StartDate=${startYear - 1}-09-01&EndDate=${endYear - 1}-06-30&ModuleInstanceFilter=&CategoryFilter=&IsDBStreamAndShowAll=true`,
        {
            headers: { Authorization: `Bearer ${tokenResponse.data.Token}` } 
        }       
    );
    letterDays = response.data.map(day => day.Title);
    for (const day of letterDays) {
        const newSchoolDay = new SchoolDays({ day });
        await newSchoolDay.save();
    }
    const newSchoolDays = await SchoolDays.find({});
    return newSchoolDays;
}


module.exports.getLetterDays = async date => {
    let nextAvailableDate = date;
    let schoolDays = await getSchoolDays(nextAvailableDate); 
    while (!await getSchoolDays(nextAvailableDate)) {
        nextAvailableDate.setDate(nextAvailableDate.getDate() + 1);
        schoolDays = await getSchoolDays(nextAvailableDate);
    }
    const letterDays = schoolDays.day ? schoolDays : schoolDays.map(schoolDay => schoolDay.day);
    return letterDays;
}

