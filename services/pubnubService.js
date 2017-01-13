var config = require("../config/config")
// var pubnub = require("pubnub")({
//     ssl           : true,
//     publish_key   : config.pubnub.publishKey,
//     subscribe_key : config.pubnub.subscribeKey
// });

exports.pubnubSubscribeChannel = function (channel, callback, errback) {
    pubnub.subscribe({
        channels: channel,
        withPresence: true,
        message : function(m){
            console.log(m)
        },
        error : function (error) {
            // Handle error here
            console.log(JSON.stringify(error));
        }
    })
};

exports.unsubscribe = function (channel, callback, errback) {
    pubnub.unsubscribe({
        channel : channel,
    });
}

exports.newUserPubnub = function (userId, callback, errback) {
    pubnub.set_uuid(userId)
}

exports.subscribeChannelGroup = function () {
    pubnub.subscribe({
        channel_group: "family",
        error : function (error) {
            // Handle error here
            console.log(JSON.stringify(error));
        },
    });
}

exports.unsubscribeChannelGroup  = function(channelInfo, callback, errback) {
    pubnub.channel_group_remove_channel({
        channel: channelInfo.channel,
        channel_group: channelInfo.channelGroup,
        callback : function(m,e,c,d,f){
            console.log(JSON.stringify(m, null, 4));
        },
        error : function (error) {
            // Handle error here
            console.log(JSON.stringify(error));
        },
    });
}

exports.grantChannelGroup = function (user) {
    if(err) {

    } else {

    }

    return res.status(200).send(user);
};