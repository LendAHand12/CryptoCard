// const rateLimit = require("express-rate-limit");
// const redis = require('redis');
// const {
//     RateLimiterRedis
// } = require('rate-limiter-flexible');
// const redisClient = redis.createClient({
//     enable_offline_queue: false,
// });
// const maxWrongAttemptsByIPperMinute = 5;
// const maxWrongAttemptsByIPperDay = 100;
function getIPAddress() {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];

        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
                return alias.address;
        }
    }
    return '0.0.0.0';
}
const apiLimiter = (req, res, next) => {
    var ip = getIPAddress()

    console.log(ip);
    console.log(req.ip,"xx",ip);
    req.ip = ip
    console.log(req.ip);
    const a = rateLimit({
        windowMs: 2000,
        max: 1,
    })
    next()
};
module.exports = {
    apiLimiter,
}