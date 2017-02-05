'use strict';

var config = require("../config/config")
var userModel = require('../models/userModel')
var PubNub = require('pubnub');

var pubnub = new PubNub({
    ssl: true,
    publishKey   : config.pubnub.publishKey,
    subscribeKey : config.pubnub.subscribeKey,
    secretKey  : config.pubnub.secretKey,
    error: function (error) {
        //console.log('Error:', error);
        logger.logError(error);
    }
});

exports.addChannelToGroup = function (newChannel, callback, errback) {
    self = this;
    var pubnubResults = [];
    for(i = 0; i < newChannel.members.length; i++) {
        pubnub.channelGroups.addChannels(
            {
                channels: [newChannel.name],
                channelGroup: newChannel.members[i]
            },
            function(status) {
                if (status.error) {
                    logger.logError("PUBNUB error");
                    logger.logError(status.error);
                    errback(status.error);
                } else {
                    pubnubResults.push(status)
                }
            }
        );
    }
    callback(pubnubResults)
};

exports.grantGroup = function (newUser, callback, errback) {
    pubnub.grant({
            channelGroups : newUser.channel_groups,
            auth_key : [newUser.auth_key],
            read : true,
            write : true,
            ttl: 0
        },
        function (status) {
            callback(status)
        });
};

exports.grantChannel = function (newChannel, callback, errback) {
  //lookup users auth_ key in metadata, return there auth_id
    logger.logInfo(newChannel)
    var auth_ids = [];
    userModel.find({
        uid: {$in: newChannel.members}
    }).select('auth_key').exec(function (err, data) {
        for (i = 0; i < data.length ; i++) {
            auth_ids.push(data[i].auth_key)
        }

        pubnub.grant({
            channel : newChannel.name,
            auth_key : auth_ids,
            read : true,
            write : true
        },
            function (status) {
                callback(status)
            });

    })

};