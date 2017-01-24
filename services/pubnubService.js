var config = require("../config/config")

var PubNub = require('pubnub');

var pubnub = new PubNub({
    ssl: true,
    publish_key   : config.pubnub.publishKey,
    subscribe_key : config.pubnub.subscribeKey
})

exports.grantChannelGroup = function (user) {
  //lookup users in metadata, return there auth_id
    console.log(user)

};