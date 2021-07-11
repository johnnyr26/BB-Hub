
module.exports = (req, res) => {
    return res.render('index', { title: 'BB Hub', picture: req.user.picture, id: req.user._id });
}