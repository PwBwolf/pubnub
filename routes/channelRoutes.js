'use strict';

var express = require('express'),
    router = express.Router(),
    jwtDecode = require('jwt-decode'),
    userService = require('../services/userService'),
    channelService = require('../services/channelService'),
    pubnubService = require('../services/pubnubService'),
    async = require('async'),
    logger = require('../logger/logger');


router.post('/create', function (req, res, next) {
    if (!req.body.members) {
        res.status(400).send({
            error: {
                status:400
            },
            message: 'bad request, route requires members'
        })
        return
    }
    var decodedToken = jwtDecode(req.headers.token);
    var members = req.body.members;
    members.push(decodedToken.uid);
    var newChannel = {
        name: decodedToken.uid + Date.now(),
        members: members
    };
    logger.logInfo('channelRoutes - create - creating a new channel');
    async.series([
        function (callback) {
            userService.countUsers(newChannel.members, function (results) {
                callback(null, 'All members exist')
            }, function (err) {
                logger.logError('One of the users does not exist');
                logger.logError(err);
                callback(err, 'null')
            })
        },
        function (callback) {
            channelService.createChannel(newChannel, function (results) {
                callback(null, results)
            }, function(err) {
                logger.logError('Error saving the channel');
                logger.logError(err);
                callback(err, 'null')
            });
        },
        function (callback) {
            logger.logInfo('channelRoutes - create - adding channel to user(s) records');
            userService.addChannel(newChannel, function (results) {
                callback(null, 'channel added to each member')
            }, function(err) {
                logger.logError('Channel not saved in users properly');
                callback(err, 'null')
            });
        },
        function (callback) {
            logger.logInfo('channelRoutes - create - requesting channels additions to pubnub');
            pubnubService.addChannelToGroup(newChannel, function (results) {
                callback(null, results)
            }, function (err) {
                logger.logError('Channel not saved in users properly');
                logger.logError(err);
                callback(err, 'null')
            })
        },
        function (callback) {
            pubnubService.grantChannel(newChannel, function (results) {
                logger.logInfo('channelRoutes - create - third service series completed')
                callback(null, results)
            }, function (err) {
                logger.logError('error with channel being added to pubnub')
                logger.logError(err);
                callback(err, 'null')
            })
        }
    ], function(err, results) {
        if(err) {
            logger.logError('channels was not created');
            logger.logError(err);
            res.status(401).send({
                error: {
                    status:401
                },
                message: err
                }
            )
            return
        }
        logger.logInfo('channelRoutes - create - created channel successfully');
        res.status(201).send({
            success: {
                status: 201
            },
            channel: results[1]
        })
    })
});

router.put('/newMessage', function (req, res, next) {
    channelService.getChannelMembers(req.body.name, function (channel) {
    	logger.logInfo('get channel members');
    	logger.logInfo(channel.members);
        var channelUpdate = {
            name:req.body.name,
            members: channel.members
        };
        userService.channelNotification(channelUpdate, function (status) {
            res.status(201).send({
                success: {
                    status:201
                },
                message: 'new message switch updated'
            })
        }, function (err) {
            logger.logError('channelRoutes - newMessage - failed to update users with new message');
            logger.logError(err);
            res.status(401).send({
                error: {
                    status:401
                },
                message: err
            })
        })
    }, function (err) {
        logger.logError('channelRoutes - newMessage - failed to find that record');
        logger.logError(err);
        res.status(404).send({
            error: {
                status:404
            },
            message: err
        })
    })
});

router.post('/unsubscribe', function (req, res, next) {
    //to be done
    logger.logInfo('channelRoutes - unsubscribe - retrieved all of the members from the chat');
    channelService.leaveChannel(req.body.member, function (status) {
        logger.logInfo('channelRoutes - unsubscribe - unsubscribed user');
        res.status(201)
            .send({
                success: {
                    status:201
                },
                message: 'new message switch updated'
            })
    }, function (err    ) {
        logger.logError('channelRoutes - unsubscribe - there was an error on unsubscribing the user')
        logger.logError(err);
        res.status(401).send({
            error: {
                status:401
            },
            message: err
        })
    })
});

router.put('/addUser', function (req, res, next) {
    if (!req.body.uid && !req.body.name) {
        res.status(400).send({
            error: {
                status:400
            },
            message: 'bad request, req require members array and name of channel'
        })
    }
    var addUser = req.body
    logger.logInfo('channelRoutes - addUser - add user to an existing channel');
    async.series([
        function (callback) {
            logger.logInfo('channelRoutes - addUser - making a new channel');
            channelService.addMembers(req.body, function (results) {
                logger.logError('channelRoutes - addUser - addMebers successfully added members');
                logger.logError(err);
                callback(null, results)
            }, function(err) {
                logger.logError('channelRoutes - addUser - Member not saved is channel properly');
                logger.logError(err);
                callback(err, 'null')
            })
        },
        function (callback) {
            logger.logInfo('channelRoutes - addUser - make a record in users document of this channel');
            userService.addChannel(addUser, function (results) {
                logger.logInfo('channelRoutes - addUser - added channel to users record')
                callback(null, results)
            }, function(err) {
                logger.logError('channelRoutes - addUser - Channel not saved in users properly');
                logger.logError(err);
                rcallback(err, 'null')
            });
        }
    ], function(err, results) {
        if(err) {
            logger.logError( 'Members successfully added to the chat');
            logger.logError(err);
            res.status(401).send({
                error: {status:401},
                message: err
            })
        }
        logger.logInfo('channelRoutes - addUser - successfully added a user');
        res.status(201).send(results)
    })
});


router.put('/displayName', function (req, res, next) {
    logger.logInfo('channelRoutes - displayName - successfully added a user');
    if (!req.body.displayName && !req.body.name) {
        logger.logError('Channel name and displayName required');
        logger.logError(err);
        res.status(400).send({
            error: {
                status:400
            },
            message: err
        })
    }
    channelService.updateDisplayName(req.body, function (display) {
        logger.logInfo('channelRoutes - displayName - successfully added a user');
        res.status(201).send({
            success:{
                status:201
            },
            message: display
        })
    }, function (err) {
            logger.logError('channelRoutes - displayName - displayname not updated');
            logger.logError(err);
            res.status(401).send({
                error: {
                    status:401
                },
                message: err
            })
        }
    );
});


module.exports = router;