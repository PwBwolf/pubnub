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

exports.getUser = function (uid, callback, errback) {
    pnUserModel.find({uid: uid}).populate('channelInfo').exec(function(err, res) {
        if (err) {
            console.log(err);
            errback(err);
            return
        }
        console.log(res)
        callback(res)
    });
}

exports.findUser = function (uid, callback, errback) {
    console.log('find this uid: ', uid);
    pnUserModel.findOne({uid: uid}, function (err, user) {
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
            'uid': channel.uid,
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
            'uid': chatChannel.uid,
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
            "uid": {$in:users}
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
            "uid": {$in:users},
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

exports.getAuthIds = function (members, callback, errback) {
    pnUserModel.find({
        "uid": {$in:members}
    })
};