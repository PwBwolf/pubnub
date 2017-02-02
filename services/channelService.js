var channelModel = require('../models/channelModel'),
    logger = require('../logger/logger')

exports.getChannel = function (channelId, callback, errback) {
    channelModel.find({'name':channelId}, function (err, channelDetails) {
        if (err) {
            errback(err);
            return
        }
        callback(channelDetails);
    })
};

exports.getChannelMembers = function (channelId, callback, errback) {
    channelModel.findOne({name:channelId}, function (err, result) {
        if (err) {
            errback(err);
            return
        }
        if (result.name = undefined) {
            errback("channel does not exist")
            return
        }
        callback(result);
    })
};

exports.createChannel = function (newChannel, callback, errback) {
    /*
        TODO Implemnet a search functionality for looking up existing channels
    */
    var members = newChannel.members;
    var hist = [];
    var type = 0;
    if(members.length > 2 ) {
        type = 1;
    }
    for ( var i = 0; i < members.length; i++) {
        hist.push({
            member: members[i],
            start_time: new Date()
        });
    }
    var channel = {
        name: newChannel.name,
        members: newChannel.members,
        history: hist,
        type: type
    };
    console.log(channel);
    channelModel.create(channel, function (err, user) {
        if (err) {
            errback(err);
            return
        }
        callback(user)
    })
};

exports.deleteChannel = function (channel, callback, errback) {
    channelModel.remove({name: channel.name}, function (err, results) {
        if(err) {
            errback(err);
            return
        }
        callback(results)
    })
};




exports.leaveChannel = function (channel, callback, errback) {
    // recordId.members must be an array
    channelModel.update({name: channel.name},{ $pullAll: {member: channel.member}}, function (err, result) {
        if(err) {
            errback(err);
            return
        }
        callback(result)
    });
};

exports.addMembers = function (channel, callback, errback) {
    var hist = [];
    for ( var i = 0; i < members.length; i++) {
        hist.push({
            member: members[i],
            start_time: new Date()
        });
    }
    channelModel.update({
        name: channel.name
    },{
        "$push": {
            "history": hist,
            "members": channel.members
        }
    }, function (err, result) {
        if (err) {
            errback(err)
            console.log('addMember service did not updated users successfully')
            return
        }
        callback(result)
    })
}

exports.updateDisplayName = function (channel, callback, errback) {
    channelModel.update({
        name: channel.name
    },{
        '$set': {
            displayName: channel.displayName
        }
    }, function (err, result) {
        if(err) {
            errback(err)
            return
        }
        callback(result)
    })
}




