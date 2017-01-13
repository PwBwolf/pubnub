var channelModel = require('../models/channelModel');

exports.updateDisplayName = function (recordId, callback, errback) {

};


exports.getChannel = function (channelId, callback, errback) {

};

exports.getChannelMembers = function (channelId, callback, errback) {
    console.log(channelId);
    channelModel.findOne(channelId, function (err, channelDetails) {
        if (err) {
            errback(err);
            return
        }
        callback(channelDetails);
    })
};

exports.createChannel = function (newChannel,  callback, errback) {
    /*
        TODO Implemnet a search functionality for looking up existing channels
    */
    members = newChannel.members;
    hist = [];
    for ( var i = 0; i < members.length; i++) {
        hist.push({
            member: members[i],
            start_time: new Date()
        });
    }
    var channel = {
        name: newChannel.name,
        members: newChannel.members,
        history: hist
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

exports.unsubscribeChannel = function (recordId, callback, errback) {

};





