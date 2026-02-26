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
router.post('/deposit', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {

        const {
            limit,
            page,
            symbol
        } = req.body
        const idUser = req.user
      //console.log("ok");
        const package = await customerQuery.getHistoryDeposit(limit, page, idUser, symbol.toLowerCase())
        const allPackage = await customerQuery.getHistoryDepositPagination(idUser, symbol.toLowerCase())
        if (package.length > 0) {
            for await (pack of package) {
                // console.log(pack.createTime.getDate(), i);
             pack.created_at = new Date(pack.created_at * 1000 + 25200000)
                let day = pack.created_at.getDate();
                let month = pack.created_at.getMonth() + 1;
                let year = pack.created_at.getFullYear();
                var hours = pack.created_at.getHours();
                var minutes = pack.created_at.getMinutes();
                var seconds = pack.created_at.getSeconds();
                pack.created_at = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
            }
        }

        const obj = {
            array: package,
            total: allPackage.length
        }
        success(res, "get list historyTransfer success!", obj)
    } catch (error) {
      console.log(error);
        error_500(res, error)
    }
});

router.post('/interestlending', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {

        const {
            limit,
            page,
            symbol
        } = req.body
        const idUser = req.user
      //console.log("ok",limit,page);
        const package = await customerQuery.getHistoryInterestLeding(limit, page, idUser,symbol.toLowerCase())
      //console.log("xzxz");
        const allPackage = await customerQuery.getHistoryInterestLedingPagination(idUser, symbol.toLowerCase())
        if (package.length > 0) {
            for await (pack of package) {
                // console.log(pack.createTime.getDate(), i);
             pack.created_at = new Date(pack.created_at * 1000 + 25200000)
                let day = pack.created_at.getDate();
                let month = pack.created_at.getMonth() + 1;
                let year = pack.created_at.getFullYear();
                var hours = pack.created_at.getHours();
                var minutes = pack.created_at.getMinutes();
                var seconds = pack.created_at.getSeconds();
                pack.created_at = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
            }
        }

        const obj = {
            array: package,
            total: allPackage.length
        }
        success(res, "get list historyTransfer success!", obj)
    } catch (error) {
        
        error_500(res, error)
    }
});
module.exports = router