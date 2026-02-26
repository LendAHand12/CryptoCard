// const Mutex = require('async-mutex').Mutex;
// const queueMutex = new Mutex;
// const getResultsMutex = new Mutex
let penddingRequests = []
const {
    error_400,
    success,
    error_403,
    error_503
} = require('../message')
module.exports = {
    blockRequest: async (req, res, next) => {
        try {
            let queueMutexRelease = await queueMutex.acquire();
            let earlyReturn = false
            if (getResultsMutex.isLocked()) {
                earlyReturn = true
                penddingRequests.push([req, res])
            }
            queueMutexRelease();
            if (earlyReturn) {
              return error_503(res, "Network connection error, please try again after 30 seconds !")
                
            }
            const lockRelease = await getResultsMutex.acquire();
            req.lockRelease = lockRelease
            next()
        } catch (error) {
            console.log(error, "block");
            next()
        }

    },
    unBlockRequest: async (req, res, next) => {
        const lockRelease = req.lockRelease

        try {
            for (const [pendingRequest, pendingResponse] of penddingRequests) {
                success(res, "for success", {
                    pendingRequest,
                    pendingResponse
                })
            }
            queueMutexRelease = await queueMutex.acquire()
            pendingRequest = []
            queueMutexRelease();
            lockRelease();
            next()
        } catch (error) {
            lockRelease();
            next()
            // console.log(error);
        }
    }
}