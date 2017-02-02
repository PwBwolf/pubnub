'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var http = require('http');
var https = require('https');
var config = require('./config/config');
var mongoose = require('mongoose');
var async = require('async');
var logger = require('./logger/logger');
var userService = require('./services/userService');
var pubnubService = require('.services/pubnubService');
var pnUserModel = require('./models/userModel');

require('./db/connect');

var userTotal = 0;
var userFoundFailed = 0;
var userCreating = 0;
var userCreatingFailed = 0;
var userCreatingSucceed = 0;
var userExisted = 0;

var options = {
		  host: 'devapp1.glx.com',
		  path: '/social/api/chat/users/all',
		  port : 443
		};

var req = https.get(options, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));

	  // Buffer the body entirely for processing as a whole.
	  var bodyChunks = [];
	  res.on('data', function(chunk) {
	    // You can process streamed parts here...
	    bodyChunks.push(chunk);
	  }).on('end', function() {
	    var body = Buffer.concat(bodyChunks);
	    console.log('BODY: ' + body);
	    // ...and/or process the entire body here.
	    var jsonObject = JSON.parse(body);
	    console.log(jsonObject);
	    var userIds = jsonObject.data.user_ids;
	    console.log('total users: ', userIds.length);
	    doMigration(userIds);
	  })
	});

	req.on('error', function(e) {
	  console.log('ERROR: ' + e.message);
	});

	function doMigration(userIds) {
		console.log('migration...');
		Async.each(
			userIds,
			function(userId, callback) {
				pnUserModel.find({uid: userId}, function (err, user) {
			        if (err) {
			            logger.logError('userService - findUser - error retrieving user');
			            userFoundFailed++;
			            callback(null, 'find error');
			        } else {
				        if (!user) {
				        	userCreating++;
				            logger.logInfo('chat user not exist, create a new one!');
				            createChatUser(userId, function(err, results) {
				            	if(err) {
				            		userCreatingFailed++;
				            		logger.logInfo('chat user creation failed!')
				            		callback(null, 'create error');
				            	} else {
				            		userCreatingSucceed++;
				            		logger.logInfo('chat user creation succeed!');
				            		callback(null, 'create success');
				            	}
							});
				        } else {
				        	userExisted++;
				        	logger.logInfo('chat user exist');
				        	callback(null, 'user exist');
				        }
			        }
			    })

			},
			function(err) {
				if(err) {
					console.log('error');
					console.log(err);
				} else {
					console.log('succeed');
				}
				console.log('user total: ', userTotal);
				console.log('userFoundFailed: ', userFoundFailed);
				console.log('userCreating: ', userCreating);
				console.log('user total: ', userCreatingFailed);
				console.log('userCreatingFailed: ', userCreatingSucceed);
				console.log('userExisted: ', userExisted);
			}
		)
	}

	function createChatUser(userId, cb) {
		var decodedToken = userId;
		var authKey = Date.now() + decodedToken
		var newUser = {
		    uid: decodedToken,
		    channel_groups: [decodedToken],
		    auth_key: authKey
		  };
	    async.series([
	        function (callback) {
	            userService.create(newUser, function (user) {
	                logger.logInfo('userRoutes - enroll - user created successfully')
	                callback(null, {user: user})
	            }, function(err) {
	                logger.log('error','userRoutes - enroll - error creating user', err);
	                callback(err, 'there was an error creating user')
	            });
	        },
	        function (callback) {
	            pubnubService.grantGroup(newUser, function (results) {
	                callback(null, {pubnubResults: results})
	            }, function (err) {
	                logger.log('error','userRoutes - enroll - pubnub error when creating user', err);
	                callback(err, 'there was an error creating user')
	            })
	        }
	    ], function(err, results) {
	    	cb(err, results);
	    })
	}