var express = require('express');
var router = express.Router();
var jwtDecode = require('jwt-decode');
var userService = require('../services/userService');
var channelService = require('../services/channelService');

router.post('/create', function (req, res, next) {
    var decodedToken = jwtDecode(req.headers.token);
    var members = req.body.members;
    members.push(decodedToken.uid);
    var newChannel = {
        name: decodedToken.uid + Date.now(),
        members: members
    };
    console.log(newChannel);

    channelService.createChannel(newChannel, function (channel) {
        console.log('channel created successfully')
        userService.addChannel(newChannel, function (status) {
            res.status(201)
                .send(status)
        }, function(err) {
            console.log('Channel not saved in users properly');
            res.status(401).json(err);
        })
    }, function(err) {
        console.log('Channel was not created successfully');
        res.status(401).json(err);
    });
});

router.get('/channel/:id', function (req, res, next) {

});

router.post('/unsubscribe/:id', function (req, res, next) {
    channelService.leaveChannel(unsubscribe, function (status) {
        res.status(201)
            .send(status)
    }, function (err) {
        res.status(400).json(err);
    })
});

router.put('/displayName', function (req, res, next) {
    res.send('update channel metadata with new display name');
});

module.exports = router;