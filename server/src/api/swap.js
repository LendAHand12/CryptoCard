const express = require('express');
const app = express();

var router = express.Router();

const passport = require('passport');

const { swap, historyswapExchange, historySwap, historySwapAdmin } = require('../controller/swap');
const { authenticateAdmin, authenticateAdminSwap } = require('../middlewares/authenticate');

router.post('/swap', passport.authenticate('jwt', {
    session: false
}), swap)

router.post('/historyswapExchange', passport.authenticate('jwt', {

    session: false
}),historyswapExchange
);
router.post('/historyswap', passport.authenticate('jwt', {

    session: false
}),historySwap
);
router.post('/historySwapAdmin', passport.authenticate('jwt', {

    session: false
}),authenticateAdminSwap,historySwapAdmin
);

module.exports = router;