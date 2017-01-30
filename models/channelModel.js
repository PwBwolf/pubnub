var mongoose = require('mongoose');

    var channelSchema = new mongoose.Schema({
        name: {type: String, required: true},
        members: [{ type: String, required: true }],
        history: [{
            member:{ type: String, required: true },
            start_time: {type:Date, default:Date.now},
            end_time: {type:Date}
        }],
        displayName: {type: String},
        type: {type: Number},
        create_at: {type: Date, default: Date.now}
    });

    var channel = mongoose.model('channel', channelSchema, 'channel');

module.exports = channel;
