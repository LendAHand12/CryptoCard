const client = require("../database/redis")

const getRedis = async (key) => {
    return new Promise((resolve, reject) => {
        client.get(key)    .then(exists => {
            resolve(exists)
        }).catch(err => {
            console.log(err);
            reject(err.message)
        });
    })
}
const delRedis = async (key) => {
    return new Promise((resolve, reject) => {
        client.del(key)    .then(exists => {
            resolve(exists)
        }).catch(err => {
            console.log(err);
            reject(err.message)
        });
    })
}
const delRedisAll = async () => {
    return new Promise((resolve, reject) => {
        client.FLUSHALL().then(exists => {
            resolve(exists)
        }).catch(err => {
            console.log(err);
            reject(err.message)
        });
    })
}
const setRedis = async (key, count) => {

    return new Promise((resolve, reject) => {
        client.set(key, count)    .then(exists => {
            resolve(exists)
        }).catch(err => {
            console.log(err);
            reject(err.message)
        });
    })
}

const incrbyRedis = async (key, count) => {
    return new Promise((resolve, reject) => {
        client.incr(key, count).then(exists => {
            resolve(exists)
        }).catch(err => {
            console.log(err);
            reject(err.message)
        });
    })
}

const decrbyRedis = async (key, count) => {
    return new Promise((resolve, reject) => {
        client.decrby(key, count).then(exists => {
            resolve(exists)
        }).catch(err => {
            console.log(err);
            reject(err.message)
        });
    })
}

const existsRedis = async (key) => {
    return new Promise((resolve, reject) => {
        // client.exists(key, (err, result) => {

        //     if (err) {
        //         console.log(err);
        //         return reject(err)
        //     }
        //     resolve(result)
        // })
        client.exists(key)
            .then(exists => {
                resolve(exists)
            }).catch(err => {
                console.log(err);
                reject(err.message)
            });
    })
}

const setnxRedis = async (key, count) => {
    return new Promise((resolve, reject) => {
        client.set(key, count)  .then(exists => {
            resolve(exists)
        }).catch(err => {
            console.log(err);
            reject(err.message)
        });
    })
}


module.exports = {
    getRedis,
    setRedis,
    incrbyRedis,
    existsRedis,
    setnxRedis,
    decrbyRedis,
    delRedis,
    delRedisAll
}