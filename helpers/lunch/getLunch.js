const axios = require('axios');
const SchoolDays = require('../../models/SchoolDays');

module.exports = async () => {
    const schoolDays = await SchoolDays.find({});
    const schoolDayLunchOffering = schoolDays.find(schoolDay => schoolDay.day.substring(8) === 'Tuesday, September 29');
    if (schoolDayLunchOffering.lunch.length) {
        return schoolDayLunchOffering;
    }
    const response = await axios.get('https://api.getchoosi.com/KidsChooseApi/v1.0/menus?filter%5Bdate%5D=9-29-2020&filter%5Bschool%5D=a0f85ce7-e126-497b-9633-ebf677ea68ae');
    let meals = response.data.menu.grabNGoItems.map(item => {
        return { name: item.name, description: item.description };
    });
    const hotMeals = meals.filter(meal => meal.name.substring(0, 3) === 'Hot');
    meals = meals.filter(meal => meal.name.substring(0, 3) !== 'Hot');
    meals.unshift(...hotMeals);
    schoolDayLunchOffering.lunch = meals;
    await schoolDayLunchOffering.save();
    return schoolDayLunchOffering;
};