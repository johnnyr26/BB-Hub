
const Posts = require('../models/Posts');
const Users = require('../models/Users');

const fs = require('fs');
const path = require('path');

module.exports.renderPosts = async (req, res) => {
    const posts = await Posts.find({});
    return res.render('posts', { posts });
}

module.exports.uploadPosts = async (req, res) => {
    try {
        const image = req.file;
        const { title, message } = req.body;

        await Posts.createNewPost(req.user._id, title, message, image);
        const user = await Users.findById(req.user._id, 'name');

        const postImage = (await Posts.findOne({ title, message})).img;
        const buffer = Buffer.from(postImage.data.buffer).toString('base64');
        
        return res.send({ user: user.name, title, message, image: buffer });
    } catch (e) {
        console.log(e);
        return res.send({ error: e.message });
    }
}