const redis = require('redis');
const client = redis.createClient({
    host: '127.0.0.1',
    port: 6379,
    
})

client.on('error', (error) => {
    console.error("error redis",error)
})
client.on('connect', () => {
    console.log('Redis connection');
})
// client.set('95USDT.TRC20',"asd")
module.exports = client;