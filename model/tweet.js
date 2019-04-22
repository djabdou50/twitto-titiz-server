const mongoose = require('mongoose');

var Tweet = new mongoose.Schema({
    id: String,
    created_at: String,
    text: String,
    media: String,
    userid: String,
    username: String,
    screen_name: String
});

export default mongoose.model('Tweet', Tweet);
