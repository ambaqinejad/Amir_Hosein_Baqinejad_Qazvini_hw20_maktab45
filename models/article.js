const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blogger'
    },
    title: {
        type: String,
        required: true
    },
    content: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Article', articleSchema);