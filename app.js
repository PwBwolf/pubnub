/**
 * Load module dependencies
 */
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
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
 */
app.use('/pubnubUser', pnUser);
app.use('/pubnubChannel', pnChannel)

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


module.exports = app;
