var express = require('express');
var router = express.Router();
var jwtDecode = require('jwt-decode');
var userService = require('../services/userService');
var channelService = require('../services/pubnubService');

router.post('/create/channel', function (req, res, next) {
    var decodedToken = jwtDecode(req.headers.token);
    var channelId = decodedToken.uid + Date.now();
    res.send({
        madeBy: decodedToken.uid,
        channel: channelId
    })
});

router.put('/displayName', function (req, res, next) {
    res.send('update channel metadata with new display name');
});

module.exports = router;