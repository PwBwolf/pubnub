var express = require('express');
var router = express.Router();
var userService = require('../services/userService');
var channelService = require('../services/channelService')
var jwtDecode = require('jwt-decode');
var config = require('../config/config');



/* GET users listing. */

router.get('/userInfo', function(req, res, next) {
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
  var newUser = {
    user_id: decodedToken.uid,
    channel_group: decodedToken.uid
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


router.post('/messageSent', function (req, res, next) {
  console.log('user sent a message', req.body.channel);
  var decodedToken = jwtDecode(req.headers.token);
  channelService.getChannelMembers(req.body.channel, function (channelDetails) {
    var sender = decodedToken.uid;
    userService.channelNotification(channelDetails, function (notification) {
      res.status(201).send({
        notification: notification,
        message: 'members notified of new message'
      });
    })
  })

});


//will accept an array of channels.
router.post('/closedWindow', function (req,res,next) {
    var tokenPay = jwtDecode(req.headers.token);
    var inactiveCh = {
        user_id: tokenPay.uid,
        channel: req.body.channel
    }
    userService.inactiveChat(inactiveCh, function (status) {
        res.status(201).send({
            status: status,
            message: 'channel is inactive'
        })
    })
})



module.exports = router;
