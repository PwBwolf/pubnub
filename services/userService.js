var pnUserModel = require('../models/userModel');

exports.create = function (user, callback, errback) {
    console.log('service running make record for this user,', user)
    pnUserModel.create(user, function (err, user) {
        if (err) {
            errback(err);
            return
        }
        callback(user)
    })
};

exports.findUser = function (uid, callback, errback) {
    console.log('find this uid: ', uid);
    pnUserModel.findOne({user_id: uid}, function (err, user) {
        if (err) {
            errback(err);
            return
        }
        callback(user)
    })
};

exports.deleteChannel = function (recordId, callback, errback) {

};

exports.inactiveChat= function (chatChannel, callback, errback) {

};

exports.addChannel= function (chatChannel, callback, errback) {
    console.log(chatChannel.members);
    memebers = chatChannel.members
    for ( var i = 0; i < members.length; i++) {
        pnUserModel.findOneAndUpdate({user_id: members[i]}, {$push: {"messages": {title: title, msg: msg}}}, function(err, user) {
            if (err) {
                errback(err);
                return;
            }

            if (!user) {
                errback({message: 'that users does not exist'});
                return;
            }
        });
    }
    callback({success:true})
};

exports.channelNotification = function (channel, callback, errback) {
    channel = channel.name;
    users =channel.members;
    console.log('users service updaing members of new message');
    pnUserModel.update({"user_id": {"$in":users}, "channels.name": channel}, {new_messages: 1}, {multi: true}, function (err, status) {
        if (err) {
            errback(err);
            return;
        }
        callback(status)
    })
}