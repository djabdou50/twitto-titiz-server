const mongoose = require('mongoose');

var Tweet = new mongoose.Schema({
    id: {
        type: String,
        index: true,
        unique: true
    },
    created_at: String,
    text: String,
    media: {
        type: String,
        index: true,
        unique: true
    },
    userid: String,
    username: String,
    screen_name: String,
    gender: String,
});

export default mongoose.model('Tweet', Tweet);
