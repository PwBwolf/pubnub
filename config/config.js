var config = {
    environment: global.environment || process.env.NODE_ENV || 'development',
    jwtSecret: 'b0f45d9395b4551d70c0cfa28901bcc4e3b65beab543baafaa006d14ddb74b5add1e51033a4133c22ae14d0e17f6cce76511bc72d737cc106754d007708551b1',
    pubnub: {
        publishKey: 'pub-c-3e24f455-c767-49fc-bdea-a5eb8139db66',
        subscribeKey: 'sub-c-b3f41a24-bb20-11e6-a856-0619f8945a4f',
        secretKey: 'sec-c-YTI0YWY1YzMtOWMxOC00ODAyLThhNDItMGU1NzE3ZTRjMmU5'
    },
    glxChannels: {
        ubc: 'glxuserbrodcastchannel',
        tbc: 'glxtrendingbrodcastchannel'
    },
    database: {
        production: {
            url: 'mongodb://10.0.0.141:27017/glx_chat'
        },
        qa: {
            url: 'mongodb://10.0.0.141:27017/glx_chat'
        },
        development: {
            url: 'mongodb://10.0.0.141:27017/glx_chat'
        },
        uat: {
            url: 'mongodb://10.0.0.141:27017/glx_chat'
        }
    },
    port: process.env.PORT || '3000'
};

module.exports = config;