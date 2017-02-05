'use strict';

var mongoose = require('mongoose');
var settings = require('../config/config.js');
var logger = require('../logger/logger');
// Connect to MongoDB database

var db = mongoose.connection;
db.on('connecting', function() {
    logger.logInfo('mongodb connecting');
});

db.on('error', function(error) {
    logger.logError('Error in MongoDb connection: ');
    logger.logError(error);
    mongoose.disconnect();
});
db.on('connected', function() {
	logger.logInfo('mongodb connected');
});
db.once('open', function() {
	logger.logInfo('mongodb connection open');
});
db.on('reconnected', function () {
	logger.logInfo('mongodb reconnected');
});
db.on('disconnected', function() {
	logger.logInfo('mongodb disconnected');
    mongoose.connect(settings.database[settings.environment].url, {server:{auto_reconnect:true, socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 }}, replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } }});
});

mongoose.connect(settings.database[settings.environment].url, {server:{auto_reconnect:true}});

//mongoose.connect(settings.database[settings.environment].url, {
//	server : {
//		socketOptions : {
//			socketTimeoutMS : 0,
//			connectTimeoutMS : 0
//		}
//	}
//});