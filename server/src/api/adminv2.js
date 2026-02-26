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
const { authenticateAdmin, authenticateAdminUser, authenticateAdminTransfer, authenticateAdminDeposit, authenticateAdminWidthdraw, authenticateAdminEditAdmin, authenticateAdminEditUser, authenticateAdminBuyToken } = require('../middlewares/authenticate');
const { getWalletToUserAdmin, historytransferAdmin, updateAmountWalletToId, getHistoryDepositAdmin, getHistoryDepositAdminAll, historytransferAdminAll, getUserAll, sreachWalletWithdraw, sreachWalletToWithdraw, getWalletToWithdrawWhere, getAllUserWallet, getUserToId, addAdmin, editAdmin, getAdmim, deleteAdmin, checkAdmin, sreachDepositToAdmin, sreachUserToAddressWallet, getHistoryBuyCoin, getHistoryUpdateWallet, editFuncAdmin } = require('../controller/admin');
const { getHistoryDepositToCardToKeyword, getHistoryDepositToCardToTime, getHistoryDepositToCardToTimeAll } = require('../controller/visaCard');
router.post('/getWalletToUserAdmin', passport.authenticate('jwt', {

    session: false
}), authenticateAdminUser,getWalletToUserAdmin);
router.post('/sreachUserToAddressWallet', passport.authenticate('jwt', {

    session: false
}), authenticateAdminUser,sreachUserToAddressWallet);
router.post('/getHistoryDepositToCardToTime', passport.authenticate('jwt', {
    session: false
}),authenticateAdminUser, getHistoryDepositToCardToTime);
router.post('/getHistoryDepositToCardToTimeAll', passport.authenticate('jwt', {
    session: false
}),authenticateAdminUser, getHistoryDepositToCardToTimeAll);

router.post('/getHistoryDepositToCardToKeyword', passport.authenticate('jwt', {
    session: false
}),authenticateAdminUser, getHistoryDepositToCardToKeyword);
router.post('/sreachWalletToWithdraw', passport.authenticate('jwt', {

    session: false
}), authenticateAdminWidthdraw,sreachWalletToWithdraw);
router.post('/sreachDepositToAdmin', passport.authenticate('jwt', {

    session: false
}), authenticateAdminDeposit,sreachDepositToAdmin);

router.post('/getUserToId', passport.authenticate('jwt', {

    session: false
}), authenticateAdminUser,getUserToId);
router.post('/getWalletToWithdrawWhere', passport.authenticate('jwt', {

    session: false
}), authenticateAdminWidthdraw,getWalletToWithdrawWhere);

router.post('/historytransferAdmin', passport.authenticate('jwt', {

    session: false
}), authenticateAdminTransfer,historytransferAdmin);
router.post('/getHistoryBuyCoin', passport.authenticate('jwt', {

    session: false
}), authenticateAdminBuyToken,getHistoryBuyCoin);


router.post('/updateAmountWalletToId', passport.authenticate('jwt', {

    session: false
}), authenticateAdminEditUser,updateAmountWalletToId);
router.post('/getHistoryUpdateWallet', passport.authenticate('jwt', {

    session: false
}), authenticateAdminUser,getHistoryUpdateWallet);
router.post('/editFuncAdmin', passport.authenticate('jwt', {

    session: false
}), authenticateAdminEditAdmin,editFuncAdmin);

router.post('/getHistoryDepositAdmin', passport.authenticate('jwt', {

    session: false
}), authenticateAdminDeposit,getHistoryDepositAdmin);
router.post('/getHistoryDepositAdminAll', passport.authenticate('jwt', {

    session: false
}), authenticateAdminDeposit,getHistoryDepositAdminAll);
router.post('/historytransferAdminAll', passport.authenticate('jwt', {

    session: false
}), authenticateAdminTransfer,historytransferAdminAll);
router.post('/getUserAll', passport.authenticate('jwt', {

    session: false
}), authenticateAdminUser,getUserAll);
router.post('/getAllUserWallet', passport.authenticate('jwt', {

    session: false
}), authenticateAdminUser,getAllUserWallet);
///// Admin sub ///
router.post('/addAdmin', passport.authenticate('jwt', {

    session: false
}), authenticateAdminEditAdmin,addAdmin);
router.post('/editAdmin', passport.authenticate('jwt', {

    session: false
}), authenticateAdminEditAdmin,editAdmin);
router.post('/getAdmin', passport.authenticate('jwt', {

    session: false
}), authenticateAdminEditAdmin,getAdmim);
router.post('/deleteAdmin', passport.authenticate('jwt', {

    session: false
}), authenticateAdminEditAdmin,deleteAdmin);
router.post('/checkAdmin', passport.authenticate('jwt', {

    session: false
}),checkAdmin);



module.exports = router
