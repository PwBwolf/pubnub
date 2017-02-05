var mongoose = require('mongoose');
var settings = require('../config/config.js');
// Connect to MongoDB database
mongoose.connect(settings.database[settings.environment].url, {
	server : {
		socketOptions : {
			socketTimeoutMS : 0,
			connectTimeoutMS : 0
		}
	}
});