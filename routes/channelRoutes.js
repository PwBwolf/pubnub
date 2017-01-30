var express = require('express');
var router = express.Router();
var jwtDecode = require('jwt-decode');
var userService = require('../services/userService');
var channelService = require('../services/channelService');
var pubnubService = require('../services/pubnubService')
var async = require('async');


router.get('/:id', function (req, res, next) {
///to be done
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
                res.status(401).send({
                    error: {status:401},
                    message: err
                })
            });
        },
        function (callback) {
            console.log('make a record in users document of this channel', newChannel);
            userService.addChannel(newChannel, function (results) {
                console.log(results)
                callback(null, results)
            }, function(err) {
                console.log('Channel not saved in users properly');
                res.status(401).send({
                    error: {status:401},
                    message: err
                })
            });
        },
        function (callback) {
            console.log('tell pub nub to grant these users write access to these channels', newChannel.members);
            pubnubService.grantChannel(newChannel, function (results) {
                callback(null, {succes: true, message: 'grants authorized on channel',auth_ids: results})
            }), function (err) {
                console.log('Pubnub grant failed')
                res.status(401).send({
                    error: {status:401},
                    message: err
                })
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

router.put('/newMessage', function (req, res, next) {
    channelService.getChannelMembers(req.body.name, function (channel) {
        userService.channelNotification(channel, function (status) {
            res.status(201).send({
                success: {status:201},
                message: 'new message switch updated'
            })
        }, function (err) {
            console.log('failed to update users with new message')
            res.status(401).send({
                error: {status:401},
                message: err
            })
        })
    }, function (err) {
        console.log('failed to find that record')
        res.status(404).send({
            error: {status:404},
            message: err
        })
    })
});

router.post('/unsubscribe', function (req, res, next) {
    //to be done
    channelService.leaveChannel(req.body.member, function (status) {
        res.status(201)
            .send(status)
    }, function (err) {
        res.status(401).send({
            error: {status:401},
            message: err
        })
    })
});

router.put('/addUser', function (req, res, next) {
    if (!req.body.uid && !req.body.name) {
        res.status(400).send({
            error: {status:400},
            message: 'bad request, req require members array and name of channel'
        })
    }
    var addUser = req.body
    async.series([
        function (callback) {
            console.log('make this new channel', addUser);
            channelService.addMembers(req.body, function (results) {
                console.log('addMebers successfully added members');
                callback(null, results)
            }, function(err) {
                console.log('Member not saved is channel properly');
                res.status(401).send({
                    error: {status:401},
                    message: err
                })
            })
        },
        function (callback) {
            console.log('make a record in users document of this channel', addUser);
            userService.addChannel(addUser, function (results) {
                console.log(results)
                callback(null, results)
            }, function(err) {
                console.log('Channel not saved in users properly');
                rres.status(401).send({
                    error: {status:401},
                    message: err
                })
            });
        }
    ], function(err, results) {
        if(err) {
            console.log( 'Members successfully added to the chat');
            res.status(401).send({
                error: {status:401},
                message: err
            })
        }
        res.status(201).send(results)
    })
});


router.put('/displayName', function (req, res, next) {
    if (!req.body.displayName && !req.body.name) {
        res.status(400).send({
            error: {status:400},
            message: err
        })
    }
    channelService.updateDisplayName(req.body, function (display) {
        res.status(201).send({success:{status:201}, message: 'updated display name'})
    }, function (err) {
            console.log(err)
            res.status(401).send({
                error: {status:401},
                message: 'display name not updated correctly'
            })
        }
    );
    res.send('update channel metadata with new display name');
});


module.exports = router;