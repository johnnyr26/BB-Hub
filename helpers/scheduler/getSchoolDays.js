const axios = require('axios');

const SchoolDays = require('../../models/SchoolDays');
const getDates = require('./getDates');

const getSchoolDays = async () => {
    const schoolDays = await SchoolDays.find({});
    if (schoolDays.length > 0) {
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

module.exports.getLetterDays = async () => {
    const schoolDays = await getSchoolDays();
    const letterDays = schoolDays.map(schoolDay => schoolDay.day);
    return letterDays;
}

