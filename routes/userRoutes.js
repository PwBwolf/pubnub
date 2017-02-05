var express = require('express'),
    router = express.Router(),
    userService = require('../services/userService'),
    channelService = require('../services/channelService'),
    async = require('async')
    jwtDecode = require('jwt-decode'),
    config = require('../config/config'),
    logger = require('../logger/logger'),
    pubnubService = require('../services/pubnubService');

/* GET users listing. /user */
router.get('/userChannels', function (req, res, next) {
    var decodedToken = jwtDecode(req.headers.token);
    var uid = decodedToken.uid;
    logger.logInfo('userRoutes - userChannels req user info with channels');
    userService.getUser(uid, function(user) {
        logger.logInfo('User info successfully retrieved');
        res.status(201).send({
            success: {
                status:201
            },
            user: user,
            message: 'User found'
        });
    }, function(err) {

        res.status(400).send({
            error: {
                status: 400
            },
            message: err
        });
    })
});

router.get('/info', function(req, res, next) {
  var decodedToken = jwtDecode(req.headers.token);
  var uid = decodedToken.uid
  logger.logInfo('userRoutes - userChannels req user info');
  userService.findUser(decodedToken.uid, function (user) {
    res.status(201).send({
        success: {
              status:201
        },
        user: user,
        message: 'User found'
    });
  }, function(err) {
      logger.logError('userRoutes - userChannels - error retrieving data from database');
      logger.logError(err);
      res.status(400).send({
          error: {
              status: 400
          },
          message: err
      });
  });
});

router.post('/enroll', function (req, res, next) {
  var decodedToken = jwtDecode(req.headers.token);
  var authKey = Date.now() + decodedToken.uid;
  var newUser = {
      uid: decodedToken.uid,
      channel_groups: [decodedToken.uid],
      auth_key: authKey
  };
    async.series([
        function (callback) {
            userService.create(newUser, function (user) {
                logger.logInfo('userRoutes - enroll - user created successfully')
                callback(null, {user: user})
            }, function(err) {
                logger.logError('userRoutes - enroll - error creating user');
                logger.logError(err);
                callback(err, 'there was an error creating user')
            });
        },
        function (callback) {
            pubnubService.grantGroup(newUser, function (results) {
                callback(null, {pubnubResults: results})
            }, function (err) {
                logger.logError('userRoutes - enroll - pubnub error when creating user');
                logger.logError(err);
                callback(err, 'there was an error creating user')
            })
        }
    ], function(err, results) {
        if(err) {
            logger.logError('error while creating the user');
            logger.logError(err);
            res.status(400).send({
                message: err.toString()
            })
        }
        logger.logInfo('channelRoutes - create - created channel successfully');
        res.status(201).send({
            success: {
                status: 201
            },
            results: results[0]
        })
    })

});

router.put('/readMessage', function (req, res, next) {
    var decodedToken = jwtDecode(req.headers.token);
    if (!req.body.name) {
        logger.logError('userRoutes - readMessage - missing fields in req body');
        logger.logError(err);
        res.status(401).send({
            error: {
                status: 401
            },
            message: 'channel name bust be specified'
        });
    }
    var userViewed= {
        uid :decodedToken.uid,
        name: req.body.name
    };
    userService.messageRead(userViewed, function (status) {
        logger.logInfo('userRoutes - readMessage - message updated as read');
        res.status(201).send({
            success: {
                status:201
            },
            message: 'message updated as read'
        });
    }, function (err) {
        logger.logError('userRoutes - readMessage - error updating message as read');
        logger.logError(err);
        res.status(401).send({
            error: {
                status: 401
            },
            message: err
        });
    })
});

//will accept an array of channels that will mark
router.put('/closedWindow', function (req,res,next) {
    if (!req.body.name) {
        logger.logError('userRoutes - closedWindow - no channels are set in the req body');
        res.status(401).send({
            error: {
                status: 401
            },
            message: 'Specify at least one channel that user is no longer active in'
        })
    }
    var decodedToken = jwtDecode(req.headers.token);
    var inactiveChats = {
        uid: decodedToken.uid,
        name: req.body.name
    };
    logger.logInfo('userRoutes - closedWindow - updating these chats as inactive');
    userService.inactiveChat(inactiveChats, function (status) {

        res.status(201).send({
            success: {
                status: 201
            },
            message: 'channel is marked as inactive'
        })
    }, function (err) {
        logger.logError('userRoutes - closedWindow - error updating the windows as closed');
        logger.logError(err);
        res.status(401).send({
            error: {
                status: 401
            },
            message: err
        })
    })
});


module.exports = router;
