var express = require('express');
var router = express.Router();
var userService = require('../services/userService');
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
      message: 'record saved in metadata'
    });
  })
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

router.delete('/channel/fromChannelGroup', function (req, res, next) {

  res.send('deleting channel from group channel')
});

router.post('/update/lastAccessed', function (req, res, next) {
  res.send('updated last accessed time for channel in channelGroup')
});

router.post('/logout/presence', function (req, res, next) {
  res.send('updated pubnub wuith the presence of the GroupChannel')
});

router.post('/login/presence', function (req, res, next) {
  res.send('updated pubnub wuith the presence of the GroupChannel')
});



module.exports = router;
