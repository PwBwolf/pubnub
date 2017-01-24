var express = require('express');
var router = express.Router();
var userService = require('../services/userService');
var channelService = require('../services/channelService')
var jwtDecode = require('jwt-decode');
var config = require('../config/config');



/* GET users listing. /user */

router.get('/info', function(req, res, next) {
  var decodedToken = jwtDecode(req.headers.token);
  var uid = decodedToken.uid
  console.log(uid);
  userService.findUser(decodedToken.uid, function (user) {
    res.status(201).send({
      user: user.toJSON(),
      message: 'User found'
    });
  }, function(err) {
    res.status(400).json(err);
  });

});

router.post('/enroll', function (req, res, next) {
  var decodedToken = jwtDecode(req.headers.token);
  var authKey = Date.now() + decodedToken.uid;
  var newUser = {
      uid: decodedToken.uid,
      channel_groups: [decodedToken.uid],
      auth_key: authKey,
      channels: [{
          name: config.glxChannels.ubc,
          status: false,
          new_messages: 1,
          user_channel_group: decodedToken.uid
      },{
          name: config.glxChannels.tbc,
          status: false,
          new_messages: 1,
          user_channel_group: decodedToken.uid
      }
      ]
  };
  console.log(newUser);
  userService.create(newUser, function (user) {

      console.log(user);
      res.status(201).send({
          user: user.toJSON(),
          message: 'record saved in metadata'
      });
  }, function(err) {
    res.status(400).json(err);
  });
});

router.put('/readMessage', function (req, res, next) {
    //when a user read message change history of new message to zero
    var decodedToken = jwtDecode(req.headers.token);
    var userViewed= {
        uid :decodedToken.uid,
        name: req.body.name
    };
    userService.messageRead(userViewed, function (status) {
        res.status(201).send({
            success: {status:201},
            message: 'message updated as read'
        });
    }, function (err) {
        console.log(err);
        res.status(401).json(err);
    })
});

//will accept an array of channels that will mark
router.put('/closedWindow', function (req,res,next) {
    if (!req.body.names || req.body.names.length < 1) {
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
    userService.inactiveChat(inactiveChats, function (status) {
        res.status(200).send({
            status: 'updated',
            message: 'channel is inactive'
        })
    }, function (err) {
        res.status(401).send({
            error: {
                status: 401
            },
            message: 'status of inactive chat not completerd'
        })
    })
});

router.post('/messageSent', function (req, res, next) {
    console.log('user sent a message', req.body.channel);
    var decodedToken = jwtDecode(req.headers.token);
    channelService.getChannelMembers(req.body.channel, function (channelDetails) {
        var sender = decodedToken.uid;
        console.log(channelDetails);
        res.status(201).send({
            notification: channelDetails,
            message: 'members notified of new message'
        });
        // userService.channelNotification(channelDetails, function (notification) {
        //     res.status(201).send({
        //         notification: notification,
        //         message: 'members notified of new message'
        //     });
        // })
    })

});


function validateReq(req, res, next){
    console.log('Validating req');
    if(!req.body.password){
        return res.send(500, 'Need a password');
    };
    next();
};




module.exports = router;
