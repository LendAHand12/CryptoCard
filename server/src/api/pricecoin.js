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
const {
    convertSymbolWallet,
    convertSymbol,
    flagAmountToSymBol,
    updateBalanceWalletOrUser,
    updateBalanceWalletOrUserBonus
} = require('../sockets/functions');
const {
    messageTelegram
} = require('../commons/functions/validateObj');
const {
    getPriceCoin,
    validationBody
} = require('../commons');
const {
    checkRecaptcha
} = require('../middlewares/recaptcha');
const {
    check2fa
} = require('../middlewares/twofa');
const {
    authenticateWallet
} = require('../middlewares/authenticate');
const {
    flagOptionBuyCoin
} = require('../commons/functions/flag');
const { delRedis, existsRedis, setnxRedis, getRedis, incrbyRedis } = require('../model/model.redis');
const { bonusUserReferral } = require('../commons/bonus');
const { swap } = require('../controller/swap');
router.get('/pricecoin', async function (req, res, next) {
    try {
        var array = []
        const dataToken = await customerQuery.getAllToken()
        dataToken.forEach(element => {
            if (element.flag == 0) {
                delete element.set_price
                delete element.flag
                delete element.id
                array.push(element)
            } else if (element.flag == 1) {
                element.price = element.set_price
                delete element.flag
                delete element.id
                delete element.set_price

                array.push(element)
            }
            element.image = `images/${element.name}.png`
        })
        success(res, "Get price success!", array)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/getfee', async function (req, res, next) {
    try {
        const {
            name
        } = req.body
        const flag = validationBody({
            name,
        })
        if (flag.length > 0) return error_400(res, 'Not be empty', flag)
        var data = await customerQuery.getExhange(name)
        success(res, "Get Country Success !", data)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }

});
router.post('/getref', async function (req, res, next) {
    try {

        var data = await customerQuery.getUserToUseName("swaptobe_bot")
        success(res, "Get ref Success !", data[0].unique_code)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }

});
router.post('/pricesymbol', async function (req, res, next) {
    try {
        const {
            symbol
        } = req.body
        const flag = validationBody({
            symbol,
        })
        if (flag.length > 0) return error_400(res, 'Not be empty', flag)
        var array = []
        const dataToken = await customerQuery.getTokenToName(symbol)
        if (dataToken[0].flag == 1) {
            dataToken[0].price = dataToken[0].set_price
        }
        delete dataToken[0].set_price
        delete dataToken[0].flag
        delete dataToken[0].id

        success(res, "Get price success!", dataToken[0])
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/convertcoin', passport.authenticate('jwt', {
    session: false
}), authenticateWallet, swap);
router.post('/convertcoinExchange', passport.authenticate('jwt', {
    session: false
}), authenticateWallet, async function (req, res, next) {

    try {
        const {
            symbolForm,
            symbolTo,
            amountForm,
            amountExchange
        } = req.body
        const flag = validationBody({
            symbolForm,
            symbolTo,
            amountForm,
            amountExchange
        })
        if (flag.length > 0) return error_400(res, 'Not be empty', flag)
        // database :  user_id, package_id, created_at,
        // amount
        const idUser = req.user
        //console.log(idUser);
        if (idUser) {
            const walletTest1 = await customerQuery.getWalletToIdUser(idUser, symbolForm)
            const walletTest2 = await customerQuery.getWalletToIdUser(idUser, symbolTo)
            if (walletTest1.length > 0 && walletTest2.length > 0) {
                var flagSymbolForm = symbolForm,
                    flagSymbolTo = symbolTo,
                    symbolTokenForm = symbolForm,
                    symbolTokenTo = symbolTo
                if (symbolForm == "BOS_TRC20") {
                    flagSymbolForm = "bos"
                    symbolTokenForm = "BOS"
                } else if (symbolForm == "BPAY_TRC20") {
                    flagSymbolForm = "bpay_trc20"
                    symbolTokenForm = "BPAY"
                } else if (symbolForm == "USDT.TRC20") {
                    flagSymbolForm = "usdt"
                    symbolTokenForm = "USDT"
                } else if (symbolForm == "WIN_TRC20") {
                    flagSymbolForm = "win"
                    symbolTokenForm = "WIN"
                }
                if (symbolTo == "BOS_TRC20") {
                    flagSymbolTo = "bos"
                    symbolTokenTo = "BOS"
                } else if (symbolTo == "BPAY_TRC20") {
                    flagSymbolTo = "bpay_trc20"
                    symbolTokenTo = "BPAY"
                } else if (symbolTo == "USDT.TRC20") {
                    flagSymbolTo = "usdt"
                    symbolTokenTo = "USDT"
                } else if (symbolTo == "WIN_TRC20") {
                    flagSymbolTo = "win"
                    symbolTokenTo = "WIN"
                }
                var flagLog = await flagAmountToSymBol(idUser, flagSymbolForm, amountForm)
                var percentAdmin = await customerQuery.getExhange(`SWAP`)
                const percent = parseFloat(percentAdmin[0].raito) / 100
                if (flagLog) {
                    const objSymbol = await convertSymbol(symbolForm, symbolTo)
                    var symbolBonusTo = await convertSymbolWallet(symbolTo)
                    var symbolBonusForm = await convertSymbolWallet(symbolForm)

                    ///// COIN THỊ TRƯỜNG

                    const flag = await flagAmountToSymBol(idUser, flagSymbolForm, amountForm)
                    if (flag) {
                        var prevDayForm, symbol, checkConvert
                        const priceX = await customerQuery.getTokenToName(symbolTokenForm.toUpperCase())
                        const priceY = await customerQuery.getTokenToName(symbolTokenTo.toUpperCase())
                        var x, y
                        //console.log(priceX, priceY);
                        if (priceX.length > 0 && priceY.length > 0) {
                            if (priceX[0].flag == 0) {
                                x = priceX[0].price
                            } else if (priceX[0].flag == 1) {
                                x = priceX[0].set_price
                            }
                            if (priceY[0].flag == 0) {
                                y = priceY[0].price
                            } else if (priceY[0].flag == 1) {
                                y = priceY[0].set_price
                            }
                            const user = await customerQuery.getUserToId(idUser)
                            var prevDayForm = parseFloat(x) / parseFloat(y)
                            const raitoDIFFERENCE = await customerQuery.getExhange("DIFFERENCE")
                            const startPrice = prevDayForm - (prevDayForm * (raitoDIFFERENCE[0].raito / 100))
                            const endPrice = prevDayForm + (prevDayForm * (raitoDIFFERENCE[0].raito / 100))
                            //console.log(startPrice,endPrice,"exchange price");
                            if (startPrice <= amountExchange && amountExchange <= endPrice) {
                                var amountPriceTo, amountPercent, amountTo
                                amountPriceTo = parseFloat(amountForm) * parseFloat(amountExchange)
                                amountPercent = parseFloat(amountPriceTo) * parseFloat(percent)
                                var amountTo = amountPriceTo - amountPercent
                                await updateBalanceWalletOrUser(idUser, flagSymbolForm, amountForm)
                                await customerQuery.addConvenrtCoinAdmin(idUser, amountForm, symbolTokenForm.toUpperCase(), amountTo, amountExchange, symbolBonusTo.toUpperCase())
                                await customerQuery.addNotification(idUser, user[0].username, "Swap", `Successful coin conversion from ${amountForm} ${symbolTokenForm.toUpperCase()} to ${amountTo} ${symbolTokenTo}`)
                                await messageTelegram(`User ${user[0].username} converts from ${amountForm} ${symbolTokenForm.toUpperCase()} to ${amountTo} ${symbolTokenTo} swap function`)
                                success(res, "Create swap command successfully !")
                            } else {
                                error_400(res, `The price must not differ by ${raitoDIFFERENCE[0].raito}% from the market`, 11)
                            }

                        } else {
                            error_400(res, "Symbol is not coin!", 7)
                        }
                    } else {
                        error_400(res, "Invalid balance", 4)
                    }
                } else {
                    error_400(res, "Insufficient balance", 6)
                }
            } else {
                error_400(res, `Users who have not created a ${symbolForm} wallet or ${symbolTo} wallet`, 5)
            }


        }
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
        const flag = validationBody({
            limit,
            page,
            symbol
        })
        if (flag.length > 0) return error_400(res, 'Not be empty', flag)
        const idUser = req.user
        //console.log("ok", limit, page);
        const package = await customerQuery.getHistoryInterestLeding(limit, page, idUser, symbol.toLowerCase())
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
router.post('/getHistoryCommission', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {
        const {
            limit,
            page
        } = req.body
        const flag = validationBody({
            limit,
            page
        })
        if (flag.length > 0) return error_400(res, 'Not be empty', flag)
        const idUser = req.user
        if (idUser) {
            const history = await customerQuery.getHistoryHistoryCommission(idUser, limit, page)
            const allHistory = await customerQuery.getAllHistoryHistoryCommission(idUser)
            history.forEach(e => {
                let day = e.createTime.getDate();
                let month = e.createTime.getMonth() + 1;
                let year = e.createTime.getFullYear();
                var hours = e.createTime.getHours();
                var minutes = e.createTime.getMinutes();
                var seconds = e.createTime.getSeconds();
                e.createTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
            })
            const obj = {
                array: history,
                total: allHistory.length
            }
            success(res, "get success history commission", obj)
        }
    } catch (error) {
        console.log(error);
    }
});

module.exports = router