var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    uid: {type: String, required: true},
    channel_pub: {type: String},
    channel_groups: [{type: String}],
    auth_key: {type: String},
    channels: [{
        name: {type: String},

        last_access: { type: Date, default: Date.now },
        status: {type: String, default: false },
        new_messages: {type: Number},
        user_channel_group: {type: String}
    }]
}, {
    toJSON: {
        virtuals: true
    }
});

userSchema.pre('save', function (next) {
    var self = this;
    user.find({uid : self.uid}, function (err, user) {
        if(err) {
            next(err);
        } else if(user) {
            var error = new Error("uid exists in database");
            next(error);
        } else {
            next();
        }
    });
});

userSchema.virtual('channelInfo', {
    ref: 'channel',
    localField: 'channels.name',
    foreignField: 'name'
});

var user = mongoose.model('user', userSchema, 'user');

module.exports = user;
