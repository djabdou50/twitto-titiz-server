const mongoose = require('mongoose');

var authData = new mongoose.Schema({
    token: String,
    service: String,
});

export default mongoose.model('authData', authData);
