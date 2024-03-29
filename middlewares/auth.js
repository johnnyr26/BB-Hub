const jwt = require('jsonwebtoken');
const User = require('../models/Users');

const auth = async (req, res, next) => {
    try {
        let token;
        if (req.cookies['token']) {
            token = req.cookies['token'].replace('Bearer ', '');
        } else if (req.query.state) {
            token = req.query.state.replace('Bearer ', '');
        } else {
            token = '';
        }
        
        const decoded = jwt.verify(token, process.env.secret);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }).exec();
        if (!user) {
            throw new Error('User not found');
        }

        req.user = user;
        req.token = token;

        if (next) {
            next();
        }
    } catch (error) {
        console.log('error', error);
        res.clearCookie('token');
        return res.status(401).redirect('/login');
    }
}

module.exports = auth;