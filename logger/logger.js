'use strict';

var winston = require('winston');


var logger = new (winston.Logger) ({
    transports: [
        new (winston.transports.File)({
            name: 'info-file',
            //this needs to be updated with the softlink when being deployed.
            filename: 'logs/filelog-info.log',
            level: 'info',
            json: true,
            maxsize: 5242880,
            maxFiles: 50,
            colorize: false,
            handleExceptions: true
        }),
        new (winston.transports.File)({
            name: 'error-file',
            //this needs to be updated with the softlink when being deployed.
            filename: 'logs/filelog-error.log',
            level: 'error',
            json: true,
            maxsize: 5242880,
            maxFiles: 50,
            colorize: false,
            handleExceptions: true
        }),
        new winston.transports.Console({
            name: 'console-all',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename:'logs/exception.log',
            json: true,
            maxsize: 5242880,
            maxFiles: 50,
            colorize: false
        }),
        new winston.transports.Console({
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

logger.logError = function (err) {
    logger.error(err);
};

logger.logDebug = function (msg) {
    logger.debug(msg);
};

logger.logInfo = function (info) {
    logger.info(info);
};

logger.reqLog = function (level, des, req) {
    logger.log(level, des, req)
}

module.exports = logger;

module.exports.stream = {
    write: function (message) {
        logger.info(message);
    }
};
