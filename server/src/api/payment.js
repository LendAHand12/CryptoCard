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
const { getExchange, editExchange, addExchange } = require('../controller/exchange');
const { authenticateAdmin, authenticateOtpSendEmail, authenticateOtpPaymentWallet } = require('../middlewares/authenticate');
const { sendCodeWalletTransferArray, confirmWalletTransferArray } = require('../controller/payment');
router.post('/getExchange', getExchange);
router.post('/sendCodeWalletTransferArray',sendCodeWalletTransferArray)

router.post('/confirmWalletTransferArray'
,authenticateOtpPaymentWallet
,confirmWalletTransferArray)

module.exports = router