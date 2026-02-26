var express = require('express');
var router = express.Router();
const {
    error_400,
    error_500,
    success
} = require('../message');
const passport = require('passport');
const passportConfig = require('../middlewares/passport');
const customerQuery = require('../sockets/queries/customerQuery');
const { getToken } = require('../commons');
router.post('/scanqr', passport.authenticate('jwt', {
    session: false
}), async function (req, res, next) {
    try {
        const {
            qrcode
        } = req.body
        const idUser = req.user
        const io = req.io
        const data = await customerQuery.getQrCodeToQr(qrcode)
        if (data.length > 0) {
            io.to(`${qrcode}`).emit('qrsuccess', 'success')
            success(res, "Successful qr code scan")
        } else {
            error_400(res, "QR code does not exist", 1)
        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/login', passport.authenticate('jwt', {
    session: false
}), async function (req, res, next) {
    try {
        const {
            qrcode
        } = req.body
        const idUser = req.user
        const io = req.io
        const data = await customerQuery.getQrCodeToQr(qrcode)
        if (data.length > 0) {
            const user = await customerQuery.getUserToId(idUser)
            if (user.length > 0) {
                 user[0].token = getToken(user[0])
                io.to(`${qrcode}`).emit('loginqrcode', {data:user[0]})
                success(res)
            } else {

            }
            success(res, "Successfully granted login permission")
        } else {
            error_400(res, "QR code does not exist", 1)
        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
module.exports = router