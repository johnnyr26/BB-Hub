const axios = require('axios');
const SchoolDays = require('../../models/SchoolDays');

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


module.exports = async () => {

    let unparsedDate = new Date();
    unparsedDate.setHours(unparsedDate.getHours() + 4);

    let date = unparsedDate.getDate();
    let month = getMonth(unparsedDate.getMonth());
    let year = unparsedDate.getFullYear();
    let weekday = getWeekDay(unparsedDate.getDay());

    const schoolDays = await SchoolDays.find({});
    let schoolDayLunchOffering = schoolDays.find(schoolDay => schoolDay.day.substring(8) === `${weekday}, ${month} ${date}`);
    while (!schoolDayLunchOffering) {
        unparsedDate.setDate(unparsedDate.getDate() + 1);
        date = unparsedDate.getDate();
        month = getMonth(unparsedDate.getMonth());
        year = unparsedDate.getFullYear();
        weekday = getWeekDay(unparsedDate.getDay());
        schoolDayLunchOffering = schoolDays.find(schoolDay => schoolDay.day.substring(8) === `${weekday}, ${month} ${date}`);
    }
    
    const response = await axios.get(`https://apiservicelocators.fdmealplanner.com/api/v1/data-locator-webapi/3/meals?menuId=0&accountId=35&locationId=119&mealPeriodId=2&monthId=${unparsedDate.getMonth() + 1}&timeOffset=300&_=1631241244273`);
    const mealData = response.data.result.find(data => {
        const date = data.strMenuForDate.split('-');
        return parseInt(date[0]) === year && parseInt(date[1]) === unparsedDate.getMonth() + 1 && parseInt(date[2]) === unparsedDate.getDate(); 
    });
    let lunchForDay = {};

    if (mealData.menuRecipiesData) {
        const foods = [];
        mealData.menuRecipiesData.forEach(meal => {
            const lunchIsServed = meal.isShowOnMenu === 1 || foods.length > 0;
            if (lunchIsServed) {
                foods.push({
                    "name": meal.componentEnglishName,
                    "description": meal.componentEnglishDescription
                });
            }
        });
        if (foods.length > 0) {
            lunchForDay = foods;
        }
    }

    if (!schoolDayLunchOffering) {
        month = getMonth(unparsedDate.getMonth());
        schoolDayLunchOffering = schoolDays.find(schoolDay => schoolDay.day.substring(8) === `${weekday}, ${month} ${date}`);
    }

    schoolDayLunchOffering.lunch = lunchForDay;
    await schoolDayLunchOffering.save();
    return schoolDayLunchOffering;
};