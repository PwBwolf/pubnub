var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    user_id: {type: String, required: true},
    channel_pub: {type: String},
    channel_groups: [{type: String}],
    auth_key: {type: String},
    channels: [{
        name: {type: String},
        last_access: { type: Date, default: Date.now },
        status: {type: String},
        new_messages: {type: Number},
        user_channel_group: {type: String}
    }]
});

var user = mongoose.model('user', userSchema, 'user');

module.exports = user;