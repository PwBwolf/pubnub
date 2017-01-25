var channelModel = require('../models/channelModel');

exports.getChannel = function (channelId, callback, errback) {
    console.log(channelId);
    channelModel.findOne({"name":channelId}, function (err, channelDetails) {
        if (err) {
            errback(err);
            return
        }
        callback(channelDetails);
    })
};

exports.getChannelMembers = function (channelId, callback, errback) {
    console.log(channelId);
    channelModel.findOne({"name":channelId}, function (err, channelDetails) {
        if (err) {
            errback(err);
            return
        }
        callback(channelDetails);
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
        console.log('updating as group chat');
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



exports.leaveChannel = function (channel, callback, errback) {
    // recordId.members must be an array
    channelModel.update({name: channel.channel},{ $pullAll: {member: recordId.member}}, function (err, result) {
        if(err) {
            errback(err);
            return
        }
        callback(result)
    });
};

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




