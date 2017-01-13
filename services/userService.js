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



exports.inactiveChat= function (chatChannel, callback, errback) {
    pnUserModel.update(
        {
            'user_id': chatChannel.user_id,
            'channels.channel': {"$in":chatChannel.channel}
        },
        {
            '$set': {
                'channels.$.new_messages': 0
            }
        },
        function (err, channel) {
        if (err) {
            errback(err);
            return;
        }
        callback(channel)
    })
};

exports.addChannel= function (chatChannel, callback, errback) {
    console.log(chatChannel.members);
    users = chatChannel.members;
    console.log(users)
    pnUserModel.find({"user_id": {"$in":users}}).exec(function (err, users) {
        console.log('here are the users ',users.channel)
    });
    // for ( var i = 0; i < members.length; i++) {
    //     pnUserModel.findOneAndUpdate({user_id: members[i]}, {$push: {"channel": chatChannel.channel}}, function(err, user) {
    //         if (err) {
    //             errback(err);
    //             return;
    //         }
    //
    //         if (!user) {
    //             errback({message: 'that users does not exist'});
    //             return;
    //         }
    //     });
    // }
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