var pnUserModel = require('../models/pubnubUserModel');
mongoose.Promise = Promise;

exports.create = function (user, callback, errback) {
    console.log('service running make record for this user,', user)
    pnUserModel.create(user, function (err, user) {
        if (err) {
            errback(err);
            return
        }
        callback(user)
    })
};

exports.findUser = function (uid, callback, errback) {
    console.log('find this uid: ', uid);
    pnUserModel.findOne({user_id: uid}, function (err, user) {
        if (err) {
            errback(err);
            return
        }
        callback(user)
    })
};

exports.deleteChannel = function (recordId, callback, errback) {

};

exports.inactiveChat= function (chatChannel, callback, errback) {

};

exports.activeChat= function (chatChannel, callback, errback) {

};