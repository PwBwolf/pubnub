/**
 * Load module dependencies
 */
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var config = require('./config/config')
var pnUser = require('./routes/userRoutes');
var pnChannel = require('./routes/channelRoutes')
/**
 * Create our Express application
 */
var app = express();
/**
 * Connect to MongDB database
 */
require('./db/connect');
/**
 * Middlewares
 */
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/**
 * Map routes with routers
 *
 */


app.use('/user', validateToken, pnUser);
app.use('/channel', validateToken, pnChannel);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
      .send({
        message: err.message,
        error: err
      });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
      .send({
        message: err.message,
        error: {}
      });
});

function validateToken(req, res, next) {
    var token = req.headers.token;
    console.log(token)
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.jwtSecret, function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
}

module.exports = app;
