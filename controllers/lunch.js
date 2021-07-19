const axios = require('axios');

module.exports = async (req, res) => {
    const response = await axios.get('https://api.getchoosi.com/KidsChooseApi/v1.0/menus?filter%5Bdate%5D=5-12-2021&filter%5Bschool%5D=a0f85ce7-e126-497b-9633-ebf677ea68ae');
    const meals = response.data.menu.grabNGoItems.map(item => {
        return { name: item.name, description: item.description };
    });
    return res.render('pages/lunch', { meals, picture: req.user.picture, id: req.user._id  });
};