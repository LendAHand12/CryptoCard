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
const { authenticateAdmin, authenticateAdminEditExchange } = require('../middlewares/authenticate');
router.post('/getExchange', getExchange);
router.post('/editExchange', passport.authenticate('jwt', {

    session: false
}), authenticateAdminEditExchange, editExchange);
router.post('/addExchange', passport.authenticate('jwt', {

    session: false
}), authenticateAdminEditExchange, addExchange);
module.exports = router