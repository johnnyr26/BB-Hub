
const Posts = require('../models/Posts');
const Users = require('../models/Users');

module.exports.renderPosts = async (req, res) => {
    const posts = await Posts.find({});
    return res.render('posts', { posts });
}

module.exports.uploadPosts = async (req, res) => {
    try {
        const image = req.file;
        const { title, message } = req.body;
        console.log(title, message);
        await Posts.createNewPost(req.user._id, title, message, image);
        const user = await Users.findById(req.user._id, 'name');
        return res.send({ user: "Johnny Ramirez", title, message });
    } catch (e) {
        console.log(e);
        return res.send({ error: e.message });
    }
}