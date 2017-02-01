var express = require('express');
var router = express.Router();
var userService = require('../services/userService');
var config = require('../config/config');
var logger = require('../logger/logger');


router.post('/enroll', function (req, res, next) {
    var authKey = Date.now() + req.body.uid;
    var newUser = {
        uid: req.body.uid,
        channel_groups: [req.body.uid],
        auth_key: authKey
    };
    userService.create(newUser, function (result) {
        res.status(201).send({
            status: 201,
            user: result
    })
    },function (err) {
        res.status(401).send({
            status: 'error',
            error: err.toString()
        })
    })

});

module.exports = router;