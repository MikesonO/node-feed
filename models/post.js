const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    creator: {
        type: Object,
        required: String
    }

},
    // Options
    { timeStamps: true }
);

module.exports = mongoose.model('Post', postSchema);