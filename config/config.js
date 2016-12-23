var config = {
    environment: global.environment || process.env.NODE_ENV || 'development',
    jwtSecret: 'b0f45d9395b4551d70c0cfa28901bcc4e3b65beab543baafaa006d14ddb74b5add1e51033a4133c22ae14d0e17f6cce76511bc72d737cc106754d007708551b1',
    pubnub: {
        subscribeKey: '',
        publishKey: '',
        SecretKey: ''
    },
    database: {
        production: {
            url: 'mongodb://localhost/pubnub'
        },
        qa: {
            url: 'mongodb://localhost/pubnub'
        },
        development: {
            url: 'mongodb://localhost/pubnub'
        },
        uat: {
            url: 'mongodb://localhost/pubnub'
        }
    },
    port: process.env.PORT || 3000
};

module.exports = config;