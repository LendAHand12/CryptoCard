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
const { companyAddAds, getAllAds, getAllAdsPendding, confirmAds, refuseAds, getAdsToWhere, getListAdsBuy, getListAdsSell, getConfig, updateConfig, getListAdsBuyToUser, getListAdsBuyPenddingToUser, getListAdsSellToUser, getListAdsSellPenddingToUser, sreachBuyQuick, sreachSellQuick, createP2p, getInfoP2p, userCancelP2pCommand, getListHistoryP2p, userConfirmP2pCommand, CompanyConfirmP2pCommand, CompanyCancelP2pCommand, getListHistoryP2pPendding, getListHistoryP2pWhere, cancelP2p, getConfigAdmin, updateConfigAdmin, getHistoryToWhereAdmin, AdminConfirmP2pCommand } = require('../controller/p2pBank');
const { authenticateAdmin, authenticateAdminAds, authenticateAdminEditAds, authenticateAdminEditConfig, authenticateAdminEditP2p, authenticateAdminConfig, authenticateAdminP2p } = require('../middlewares/authenticate');
///// import tb_history_p2p, tb_p2p
router.post('/companyAddAds', passport.authenticate('jwt', {

    session: false
}), companyAddAds);
router.post('/getListAdsBuy', getListAdsBuy);
router.post('/getConfig', getConfig);
router.post('/sreachBuyQuick', sreachBuyQuick);
router.post('/sreachSellQuick', sreachSellQuick);
router.post('/buyAds', sreachBuyQuick);

router.post('/getListAdsBuyToUser', passport.authenticate('jwt', {

    session: false
}), getListAdsBuyToUser);
router.post('/getListAdsSellToUser', passport.authenticate('jwt', {

    session: false
}), getListAdsSellToUser);
router.post('/createP2p', passport.authenticate('jwt', {

    session: false
}), createP2p);
router.post('/cancelP2p', passport.authenticate('jwt', {

    session: false
}), cancelP2p);
router.post('/getListHistoryP2p', passport.authenticate('jwt', {

    session: false
}), getListHistoryP2p);
router.post('/getListHistoryP2pPendding', passport.authenticate('jwt', {

    session: false
}), getListHistoryP2pPendding);
router.post('/getListHistoryP2pWhere', passport.authenticate('jwt', {
    session: false
}), getListHistoryP2pWhere);

router.post('/userCancelP2pCommand', passport.authenticate('jwt', {
    session: false
}), userCancelP2pCommand);
router.post('/CompanyConfirmP2pCommand', passport.authenticate('jwt', {
    session: false
}), CompanyConfirmP2pCommand);
router.post('/CompanyCancelP2pCommand', passport.authenticate('jwt', {
    session: false
}), CompanyCancelP2pCommand);

router.post('/userConfirmP2pCommand', passport.authenticate('jwt', {

    session: false
}), userConfirmP2pCommand);

router.post('/getInfoP2p', passport.authenticate('jwt', {

    session: false
}), getInfoP2p);
router.post('/getListAdsBuyPenddingToUser', passport.authenticate('jwt', {

    session: false
}), getListAdsBuyPenddingToUser);
router.post('/getListAdsSellPenddingToUser', passport.authenticate('jwt', {

    session: false
}), getListAdsSellPenddingToUser);


/////////////////// ADMIN /////////////////
router.post('/updateConfig', passport.authenticate('jwt', {

    session: false
}), authenticateAdminEditConfig, updateConfig);

router.post('/getListAdsSell', getListAdsSell);
router.post('/getAllAds', passport.authenticate('jwt', {

    session: false
}), authenticateAdminAds, getAllAds);
router.post('/getAdsToWhere', passport.authenticate('jwt', {

    session: false
}), authenticateAdminAds, getAdsToWhere);
router.post('/getConfigAdmin', passport.authenticate('jwt', {

    session: false
}), authenticateAdminConfig, getConfigAdmin)
router.post('/AdminConfirmP2pCommand', passport.authenticate('jwt', {

    session: false
}), authenticateAdminEditP2p, AdminConfirmP2pCommand)

router.post('/getHistoryToWhereAdmin', passport.authenticate('jwt', {

    session: false
}), authenticateAdminP2p, getHistoryToWhereAdmin);

router.post('/updateConfigAdmin', passport.authenticate('jwt', {

    session: false
}), authenticateAdminEditAds, updateConfigAdmin);

router.post('/getAllAdsPendding', passport.authenticate('jwt', {
    session: false
}), authenticateAdminAds, getAllAdsPendding);
router.post('/confirmAds', passport.authenticate('jwt', {
    session: false
}), authenticateAdminEditAds, confirmAds);
router.post('/refuseAds', passport.authenticate('jwt', {
    session: false
}), authenticateAdminEditAds, refuseAds);
module.exports = router
