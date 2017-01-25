var config = require("../config/config")
var userModel = require('../models/userModel')
var PubNub = require('pubnub');

var pubnub = new PubNub({
    ssl: true,
    publishKey   : config.pubnub.publishKey,
    subscribeKey : config.pubnub.subscribeKey,
    secretKey  : config.pubnub.secretKey,
    error: function (error) {
        console.log('Error:', error);
    }
});

exports.grantChannel = function (newChannel, callback, errback) {
  //lookup users auth_ key in metadata, return there auth_id
    console.log(newChannel)
    var auth_ids = [];
    userModel.find({
        uid: {$in: newChannel.members}
    }).select('auth_key').exec(function (err, data) {
        for (i = 0; i < data.length ; i++) {
            auth_ids.push(data[i].auth_key)
        }
        console.log('here are the auth keys that are being updated', auth_ids)
        pubnub.grant({
            channel : newChannel.name,
            auth_key : auth_ids,
            read : true,
            write : false
        },
            function (status) {
                console.log(status  )
            });
        callback(auth_ids)
    })

};