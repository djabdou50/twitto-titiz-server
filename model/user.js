const mongoose = require('mongoose');

var User = new mongoose.Schema({
    id: String,
    username: String,
    screen_name: String
});

export default mongoose.model('User', User);
