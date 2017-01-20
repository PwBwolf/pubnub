var pnUserModel = require('../models/userModel');

exports.create = function (user, callback, errback) {
    console.log('service running make record for this user,', user)
    pnUserModel.create(user, function (err, user) {
        if (err) {
            console.log(err);
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
            console.log(err);
            errback(err);
            return
        }
        if (!user) {
            console.log({message: 'no chat record found for this user'});
            errback({message: 'no chat record found for this user'});
            return;
        }
        console.log(user)
        callback(user)
    })
};

exports.messageRead = function (channel, callback, errback) {
    console.log(channel);
    pnUserModel.update(
        {
            'user_id': channel.user_id,
            'channels.name': channel.name
        }, {
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
        }
    )
}

exports.inactiveChat= function (chatChannel, callback, errback) {
    pnUserModel.update(
        {
            'user_id': chatChannel.user_id,
            'channels.name': { $in: chatChannel.names}
        },
        {
            '$set': {
                'channels.$.new_messages': 0,
                'channels.$.status': false,
                'channels.$.last_access': Date.now()
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
    console.log('updating these users with this chat', users)
    var newChannel = {
        name: chatChannel.name,
        new_messages: 1
    };
    pnUserModel.update(
        {
            "user_id": {$in:users}
        },
        {
            "$push": {
                "channels": newChannel
            }
        },
        {
            multi:true
        },
        function (err, channel) {
            if (err) {
                errback(err);
                return
            }
            callback(channel)
        }
    )
};

exports.channelNotification = function (channel, callback, errback) {
    channel = channel.name;
    users = channel.members;
    console.log('users service updaing members of new message');
    pnUserModel.update(
        {
            "user_id": {$in:users},
            "channels.name": channel.name
        },
        {
            new_messages: 1
        },
        {
            multi: true
        },
        function (err, status) {
            if (err) {
                errback(err);
                return;
        }
        callback(status)
    })
}