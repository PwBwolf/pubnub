var express = require('express');
var router = express.Router();
var userService = require('../services/userService');
var channelService = require('../services/channelService')
var jwtDecode = require('jwt-decode');
var config = require('../config/config');
var logger = require('../logger/logger');


/* GET users listing. /user */
router.get('/userChannels', function (req, res, next) {
    var decodedToken = jwtDecode(req.headers.token);
    var uid = decodedToken.uid;
    logger.log('info', 'userRoutes - userChannels req user info with channels', uid);
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
  logger.log('info', 'userRoutes - userChannels req user info', uid);
  userService.findUser(decodedToken.uid, function (user) {
    res.status(201).send({
        success: {
              status:201
        },
        user: user,
        message: 'User found'
    });
  }, function(err) {
      logger.log('error','userRoutes - userChannels - error retrieving data from database', err);
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
  logger.log('info', 'userRoutes - enroll - enrolling new user', newUser);
  userService.create(newUser, function (user) {
      logger.logInfo('userRoutes - enroll - user created successfully')
      res.status(201).send({
          success: {
              status:201
          },
          message: 'record saved in metadata'
      });
  }, function(err) {
      logger.log('error','userRoutes - enroll - error creating user', err);
      res.status(400).send({
          error: {
              status: 400
          },
          message: err.toString()
    });
  });
});

router.put('/readMessage', function (req, res, next) {
    //when a user read message change history of new message to zero
    var decodedToken = jwtDecode(req.headers.token);
    var userViewed= {
        uid :decodedToken.uid,
        name: req.body.name
    };
    logger.log('info', 'userRoutes - readMessage - user read a message', userViewed);
    userService.messageRead(userViewed, function (status) {
        logger.logInfo('userRoutes - readMessage - message updated as read')
        res.status(201).send({
            success: {
                status:201
            },
            message: 'message updated as read'
        });
    }, function (err) {
        logger.log('error','userRoutes - readMessage - error updating message as read', err);
        res.status(401).send({
            error: {
                status: 400
            },
            message: err
        });
    })
});

//will accept an array of channels that will mark
router.put('/closedWindow', function (req,res,next) {
    if (!req.body.names || req.body.names.length < 1) {
        logger.log('error','userRoutes - closedWindow - no channels are set in the req body', err);
        res.status(400).send({
            error: {
                status: 400
            },
            message: 'Specify at least one channel that user is no longer active in'
        })
    }
    var tokenPay = jwtDecode(req.headers.token);
    var inactiveChats = {
        uid: tokenPay.uid,
        names: req.body.names
    };
    logger.log('info', 'userRoutes - closedWindow - updating these chats as inactive', inactiveChats);
    userService.inactiveChat(inactiveChats, function (status) {
        logger.log('info', 'userRoutes - closedWindow - channe  ls marked as read', status);
        res.status(200).send({
            success: {
                status:200
            },
            message: 'channel is marked as inactive'
        })
    }, function (err) {
        logger.log('error','userRoutes - closedWindow - error updating the windows as closed', err);
        res.status(401).send({
            error: {
                status: 401
            },
            message: err
        })
    })
});


module.exports = router;
