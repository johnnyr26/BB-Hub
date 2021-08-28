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
    let date = unparsedDate.getDate();
    let month = getMonth(unparsedDate.getMonth());
    let year = unparsedDate.getFullYear();
    let weekday = getWeekDay(unparsedDate.getDay());

    
    const schoolDays = await SchoolDays.find({});
    let schoolDayLunchOffering = schoolDays.find(schoolDay => schoolDay.day.substring(8) === `${weekday}, ${month} ${date}`);
    if (schoolDayLunchOffering && schoolDayLunchOffering.lunch.length) {
        return schoolDayLunchOffering;
    }
    month = unparsedDate.getMonth() + 1;

    let response = await axios.get(`https://api.getchoosi.com/KidsChooseApi/v1.0/menus?filter%5Bdate%5D=${month}-${date}-${year}&filter%5Bschool%5D=a0f85ce7-e126-497b-9633-ebf677ea68ae`);
    while (!response.data.menu) {
        unparsedDate.setDate(unparsedDate.getDate() + 1);
        date = unparsedDate.getDate();
        month = unparsedDate.getMonth() + 1;
        year = unparsedDate.getFullYear();
        weekday = getWeekDay(unparsedDate.getDay());
        response = await axios.get(`https://api.getchoosi.com/KidsChooseApi/v1.0/menus?filter%5Bdate%5D=${month}-${date}-${year}&filter%5Bschool%5D=a0f85ce7-e126-497b-9633-ebf677ea68ae`);
    }
    let meals = response.data.menu.grabNGoItems.map(item => {
        return { name: item.name, description: item.description };
    });

    const hotMeals = meals.filter(meal => meal.name.substring(0, 3) === 'Hot');
    meals = meals.filter(meal => meal.name.substring(0, 3) !== 'Hot');
    meals.unshift(...hotMeals);
    if (!schoolDayLunchOffering) {
        month = getMonth(unparsedDate.getMonth());
        schoolDayLunchOffering = schoolDays.find(schoolDay => schoolDay.day.substring(8) === `${weekday}, ${month} ${date}`);
    }

    schoolDayLunchOffering.lunch = meals;
    await schoolDayLunchOffering.save();
    return schoolDayLunchOffering;
};