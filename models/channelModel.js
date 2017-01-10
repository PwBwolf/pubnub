var mongoose = require('mongoose');

channelSchema = new mongoose.Schema({
    name: {type: String, required: true},
    members: [{ type: String, required: true }],
    history: [{
        members:[{ type: String, required: true }],
        start_time: {type:Date},
        end_time: {type:Date}
    }],
    displayName: {type: String},
    type: {type: Number},
    create_at: {type: Date}
});