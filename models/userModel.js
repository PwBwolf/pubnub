var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    user_id: {type: String, required: true},
    channel_pub: {type: String},
    channel_group: {type: String, required: true},
    auth_key: {type: String},
    channels: [{
        name: {type: String},
        last_access: {type: Date},
        status: {type: String},
        access_history: [{start_time: Date, end_time: Date}],
        new_messages: {type: Number}
    }]
});

var user = mongoose.model('user', userSchema, 'user');

module.exports = user;