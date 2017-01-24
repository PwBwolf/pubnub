var express = require('express');
var router = express.Router();
var jwtDecode = require('jwt-decode');
var userService = require('../services/userService');
var channelService = require('../services/channelService');
var pubnubService = require('../services/pubnubService')
var async = require('async');
router.get('/channel/:id', function (req, res, next) {

});

router.put('/newMessage', function (req, res, next) {
    var decodedToken = jwtDecode(req.headers.token);
    channelService.getChannelMembers(req.body.name, function (channel) {
        userService.channelNotification(channel, function (status) {
            res.status(201).send(status)
        }, function (err) {
            console.log('failed to update users with new message')
        })
    }, function (err) {
        console.log('failed to find that record')
        res.status(401).json(err)
    })
});

router.post('/create', function (req, res, next) {
    var decodedToken = jwtDecode(req.headers.token);
    var members = req.body.members;
    members.push(decodedToken.uid);
    var newChannel = {
        name: decodedToken.uid + Date.now(),
        members: members
    };
    console.log(newChannel);
    async.series([
        function (callback) {
            console.log('make this new channel', newChannel);
            //do some stuff
            channelService.createChannel(newChannel, function (channel) {
                console.log('channel created successfully', channel);
                callback(null, channel)
            }, function(err) {
                console.log('Channel was not created successfully');
                res.status(401).json(err);
            });
        },
        function (callback) {
            console.log('make a record in users document of this channel', newChannel);
            userService.addChannel(newChannel, function (results) {
                console.log(results)
                callback(null, results)
            }, function(err) {
                console.log('Channel not saved in users properly');
                res.status(401).json(err);
            });
        },
        function (callback) {
            console.log('tell pub nub to grant these users write access to these channels', newChannel.members);
            pubnubService.grantChannelGroup(newChannel, function (results) {
                callback(null, {succes: true, message: 'grants authorized on channel',auth_ids: results})
            }), function (err) {
                console.log('Pubnub grant failed')
                res.status(401).json(err);
            }
        }
    ], function(err, results) {
        if(err) {
            console.log('channels was not created')
            res.status(401).json(err)
        }
        res.status(201).send(results)
    })


});

router.post('/unsubscribe/:id', function (req, res, next) {
    channelService.leaveChannel(unsubscribe, function (status) {
        res.status(201)
            .send(status)
    }, function (err) {
        res.status(400).json(err);
    })
});

router.put('/displayName', function (req, res, next) {
    res.send('update channel metadata with new display name');
});

module.exports = router;