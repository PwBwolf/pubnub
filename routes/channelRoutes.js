var express = require('express'),
    router = express.Router(),
    jwtDecode = require('jwt-decode'),
    userService = require('../services/userService'),
    channelService = require('../services/channelService'),
    pubnubService = require('../services/pubnubService'),
    async = require('async'),
    logger = require('../logger/logger')


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
    logger.log('info', 'channelRoutes - create - creating a new channel', newChannel)
    async.series([
        function (callback) {
            userService.countUsers(newChannel.members, function (results) {
                callback(null, 'All members exist')
            }, function (err) {
                logger.logError('One of the users does not exist');
                res.status(401).send({
                    error: {status:401},
                    message: err
                })
            })
        },
        function (callback) {
            channelService.createChannel(newChannel, function (results) {
                callback(null, results)
            }, function(err) {
                logger.logError('Error saving the channel');
                res.status(401).send({
                    error: {status:401},
                    message: err
                })
            });
        },
        function (callback) {
            logger.logInfo('channelRoutes - create - second service series completed');
            userService.addChannel(newChannel, function (results) {
                callback(null, results)
            }, function(err) {
                // logger.logError('Channel not saved in users properly');
                res.status(401).send({
                    error: {
                        status:401
                    },
                    message: err
                })
            });
        },
        function (callback) {
            pubnubService.grantChannel(newChannel, function (results) {
                logger.logInfo('channelRoutes - create - third service series completed')
                callback(null, {
                    succes: true,
                    message: 'grants authorized on channel',
                    auth_ids: results
                })
            }), function (err) {
                logger.logError('error with channel being added to pubnub')
                res.status(401).send({
                    error: {
                        status:401
                    },
                    message: err
                })
            }
        }
    ], function(err, results) {
        if(err) {
            logger.logError('channels was not created')
            res.status(401).send({
                error: {
                    status:401
                },
                message: err
            })
        }
        logger.log('info', 'channelRoutes - create - created channel successfully', results);
        res.status(201).send({
            success: {
                status: 201
            },
            message: results
        })
    })
});

router.put('/newMessage', function (req, res, next) {
    channelService.getChannelMembers(req.body.name, function (channel) {
        logger.logInfo('channelRoutes - newMessage - retrieved all of the members from the chat');
        userService.channelNotification(channel, function (status) {
            logger.logInfo('channelRoutes - newMessage - successfully notified users of new message');
            res.status(201).send({
                success: {
                    status:201
                },
                message: 'new message switch updated'
            })
        }, function (err) {
            logger.logError('channelRoutes - newMessage - failed to update users with new message')
            res.status(401).send({
                error: {
                    status:401
                },
                message: err
            })
        })
    }, function (err) {
        logger.logError('channelRoutes - newMessage - failed to find that record');
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
    logger.log('info', 'channelRoutes - unsubscribe - retrieved all of the members from the chat', req.body.member);
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
    logger.log('info', 'channelRoutes - addUser - add user to an existing channel', addUser);
    async.series([
        function (callback) {
            logger.logInfo('channelRoutes - addUser - making a new channel');
            channelService.addMembers(req.body, function (results) {
                logger.logError('channelRoutes - addUser - addMebers successfully added members');
                callback(null, results)
            }, function(err) {
                logger.logError('channelRoutes - addUser - Member not saved is channel properly');
                res.status(401).send({
                    error: {
                        status:401
                    },
                    message: err
                })
            })
        },
        function (callback) {
            logger.logInfo('channelRoutes - addUser - make a record in users document of this channel');
            userService.addChannel(addUser, function (results) {
                logger.logInfo('channelRoutes - addUser - added channel to users record')
                callback(null, results)
            }, function(err) {
                logger.logError('channelRoutes - addUser - Channel not saved in users properly');
                rres.status(401).send({
                    error: {
                        status:401
                    },
                    message: err
                })
            });
        }
    ], function(err, results) {
        if(err) {
            logger.logError( 'Members successfully added to the chat');
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
    logger.log('info','channelRoutes - displayName - successfully added a user', req.body);
    if (!req.body.displayName && !req.body.name) {
        logger.logError('Channel name and displayName required');
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