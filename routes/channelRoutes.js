var express = require('express');
var router = express.Router();
var jwtDecode = require('jwt-decode');
var userService = require('../services/userService');
var channelService = require('../services/channelService');

router.post('/create', function (req, res, next) {
    var decodedToken = jwtDecode(req.headers.token);
    var members = req.body.members;
    var newChannel = {
        name: decodedToken.uid + Date.now(),
        members: members
    };
    console.log(newChannel);
    channelService.createChannel(newChannel, function (channel) {
        userService.addChannel(newChannel, function (status) {
            res.status(201)
                .send(status)
        }, function(err) {
            res.status(400).json(err);
        })
    }, function(err) {
        res.status(400).json(err);
    });
});

router.get('/channel/:id', function (req, res, next) {
});

router.delete('/channel/fromChannelGroup', function (req, res, next) {
    var decodedToken = jwtDecode(req.headers.token);
});

router.put('/displayName', function (req, res, next) {
    res.send('update channel metadata with new display name');
});

module.exports = router;