var mongoose = require('mongoose');qwq  ovar channelSchema = new mongoose.Schema({
    cuid: { type: String, required: true },
    members:[{ type: String, required: true }],
    displayName: {type: String}
})