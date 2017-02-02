var pnUserModel = require('../models/userModel'),
    logger = require('../logger/logger');

exports.create = function (user, callback, errback) {
    logger.log('info','userService - create - service running make record for this user', user)
    pnUserModel.create(user, function (err, user) {
        if (err) {
            console.log(err);
            errback(err);
            return
        }
        logger.logInfo('userService - create - service successful');
        callback(user)
    })
};

exports.getUser = function (uid, callback, errback) {
    logger.log('info','userService - getUser - service returning user info with channels', uid)
    pnUserModel.find({uid: uid}).populate('channelInfo').exec(function(err, res) {
        if (err) {
            logger.logError('userService - getUser - service had a problem saving user data');
            errback(err);
            return
        }
        if (!res) {
            logger.logError('userService - getUser - no chat record found for this user');
            errback(err);
            return
        }
        logger.logInfo('userService - create - service successful');
        callback(res)
    });
}

exports.findUser = function (uid, callback, errback) {
    logger.log('info','userService - findUser - service retrieving', uid)
    pnUserModel.find({uid: uid}, function (err, user) {
        if (err) {
            logger.logError('userService - findUser - error retrieving user');
            errback(err);
            return
        }
        if (!user) {
            logger.logError('userService - findUser - no chat record found for this user');
            errback(err);
            return
        }
        logger.logInfo('userService - findUser - service successful');
        callback(user)
    })
};

exports.messageRead = function (channel, callback, errback) {
    logger.log('info','userService - messageRead - service marking channel read', channel);
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
                logger.logError('userService - messageRead - err marking chat as read');
                errback(err);
                return;
            }
            logger.logInfo('userService - messageRead - marked chat as read');
            callback(channel)
        }
    )
}

exports.inactiveChat = function (chatChannel, callback, errback) {
    logger.log('info','userService - inactiveChat - service marking channel read', channel);
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
                logger.logError('userService - inactiveChat - err marking chat as read');
                errback(err);
                return;
            }
            logger.logInfo('userService - inactiveChat - updated as inactive')
            callback(channel)
        })
};

exports.addChannel = function (chatChannel, callback, errback) {
    users = chatChannel.members;
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

exports.channelNotification = function (channelDetails, callback, errback) {
    logger.logInfo('userService - channelNotification - updating members of new message');
    pnUserModel.update(
        {
            "uid": {$in:channelDetails.members},
            "channels.name": channelDetails.name
        },
        {
            '$set': {
                'channels.$.new_messages': 1
            }
        },
        {
            multi: true
        },
        function (err, status) {
            if (err) {
                logger.logError('userService - channelNotification - err marking chat as read');
                errback(err);
                return;
            }
            logger.logInfo('userService - channelNotification - updated channel with notification')
            callback(status)
        }
    )
}

exports.removeChannel = function (channel, callback, errback) {
    pnUserModel.remove({
        "uid": {$in:channel.members},
        "channels.name" : channel.name
    }, function (err, result) {
        if (err) {
            errback(err);
            return
        }
        callback(result)
    })
};

exports.countUsers = function (members, callback, errback) {
    pnUserModel.count({
        "uid": {$in: members}}, function(err, results) {
            if (err) {
                errback(err)
            } else if (results<members.length){
                console.log(results)
                var error = new Error('One of the users does not exist in database')
                errback(error.toString())
                return;
            }
            callback(results)

        }
    )
}