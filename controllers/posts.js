
const Posts = require('../models/Posts');
const Users = require('../models/Users');

const fs = require('fs');
const path = require('path');

module.exports.renderPosts = async (req, res) => {
    const posts = (await Posts.find({})).filter(post => post.grades.includes(req.user.gradYear)).reverse();

    return res.render('pages/posts', { 
        posts,
        year: req.user.gradYear,
        admin: req.user.admin,
        id: req.user._id,
        picture: req.user.picture
     });
}

module.exports.uploadPosts = async (req, res) => {
    try {
        const image = req.file;
        const { title, message } = req.body; 

        const grades = [req.user.gradYear];

        await Posts.createNewPost(req.user._id, title, message, image, grades);
        const user = await Users.findById(req.user._id, 'name');

        const postImage = (await Posts.findOne({ title, message }, 'img')).img;
        const buffer = postImage.data ? Buffer.from(postImage.data.buffer).toString('base64') : null;

        return res.send({ success: true });
    } catch (e) {
        console.log(e.message);
        return res.send({ error: e.message });
    }
}