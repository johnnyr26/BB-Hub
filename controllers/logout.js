const User = require('../models/Users');

module.exports = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.tokens = user.tokens.filter(token => token.token !== req.token);
        await user.save();
        return res.render('pages/logout');
    } catch (error) {
        return res.render('pages/logout');
    }
}