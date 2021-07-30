const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Schema = mongoose.Schema({
    user: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'Users'
    },
    title: {
        type: String,
        trim: true
    },
    message: {
        type: String,
        trim: true
    },
    img: { 
        data: Buffer, 
        content: String 
    },
    grades: [{
        type: Number
    }]
}, {
    timestamps: true
});

Schema.virtual('date').get(() => {
    const date = new Date(this.createdAt);
    return { 
        day: date.toLocaleDateString(),
        time: date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    };
});

Schema.post('find', async posts => {
    for(const post of posts) {
        await post.populate('user').execPopulate();
    }
});

Schema.post('findOne', async post => {
    await post.populate('user').execPopulate();
});

Schema.statics.createNewPost = async (user, title, message, image, grades)  => {
    try {
        const body = image ? {
            user,
            title,
            message,
            img: {
                data: fs.readFileSync(path.join(__dirname + '/../uploads/' + image.filename)),
                content: image.mimetype
            }, 
            grades
        } : { user, title, message, grades };
        const post = new Posts(body);
        await post.save();
    } catch (e) {
        throw new Error(e);
    }
} 

const Posts = mongoose.model('Posts', Schema);

module.exports = Posts;