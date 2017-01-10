var config = {
    environment: global.environment || process.env.NODE_ENV || 'development',
    jwtSecret: 'b0f45d9395b4551d70c0cfa28901bcc4e3b65beab543baafaa006d14ddb74b5add1e51033a4133c22ae14d0e17f6cce76511bc72d737cc106754d007708551b1',
    pubnub: {
        publishKey: 'pub-c-24946ab8-d523-4496-b1cd-99bbcaf6f3eb',
        subscribeKey: 'sub-c-e5416f74-c637-11e6-979a-02ee2ddab7fe',
        SecretKey: 'sec-c-MzFkZjhlZWMtMGI1NC00M2RlLTk2OGUtYjU3MDZmZjBlZTk1'
    },
    database: {
        production: {
            url: 'mongodb://localhost:27017/pubnub'
        },
        qa: {
            url: 'mongodb://localhost:27017/pubnub'
        },
        development: {
            url: 'mongodb://localhost:27017/pubnub'
        },
        uat: {
            url: 'mongodb://localhost:27017/pubnub'
        }
    },
    port: process.env.PORT || '3000'
};

module.exports = config;