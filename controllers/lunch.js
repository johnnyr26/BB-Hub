const axios = require('axios');

module.exports = async (req, res) => {
    const response = await axios.get('https://apiservicelocators.fdmealplanner.com/api/v1/data-locator-webapi/3/meals?menuId=0&accountId=35&locationId=119&mealPeriodId=2&monthId=6&timeOffset=300&_=1625800627442');
    const meals = [];
    let valuesFor15th = [];
    let valuesFor16th = [];
    response.data.result.forEach((data, index) => {
        if (!data.menuRecipiesData) {
            return;
        }
        const foods = [];
        data.menuRecipiesData.forEach(meal => {
            const lunchIsServed = meal.isShowOnMenu === 1 || foods.length > 0;
            if (lunchIsServed) {
                foods.push(meal.componentEnglishName);
            }
        });
        if (foods.length > 0) {
            meals.push({
                meal: foods,
                date: data.strMenuForDate
            });
        }
    });
    return res.render('lunch', { meals });
};