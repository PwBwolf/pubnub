var express = require('express');
var router = express.Router();
var pnUserService = require('../services/userService');

/* GET users listing. */

router.get('/userInfo', function(req, res, next) {
  res.send('return all of the users pubnub metadata');
});

router.post('/create/pubnub-user', function (req, res, next) {
  res.send('send uuid and private channel to pubnub');
  res.send('save user mongo');
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
