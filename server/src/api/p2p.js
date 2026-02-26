var express = require('express');
var router = express.Router();
const customerQuery = require('../sockets/queries/customerQuery');
const passport = require('passport');
const passportConfig = require('../middlewares/passport');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const {
    success,
    error_400,
    error_500
} = require('../message');
const Binance = require('node-binance-api');
const binance = new Binance({
    APIKEY: '<key>',
    APISECRET: '<secret>'
});
const arraySymbol = ["BTC",
    "LTC",
    "USDT",
    "ETH",
    "BCH",
    "BPAY"
]
const crypto = require("crypto");
const {
    validatePage,
    validateRegisterUser
} = require('../sockets/functions/validation');
const {
    validationResult
} = require('express-validator');
const {
    flagAmountToSymBol,
    updateBalanceWalletOrUser,
    getWallet,
    updateBalanceWalletOrUserBonus,
    priceCoinAdmin,
    convertSymbolGetWallet
} = require('../sockets/functions');
const { authenticateWallet } = require('../middlewares/authenticate');
const { getPriceCoin } = require('../commons/functions/validateObj');
const { bonusUserReferral } = require('../commons/bonus');
router.post('/deleteSellUser', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {

        const {
            idP2P,
        } = req.body
        const idUser = req.user
        //console.log(idUser);
        const getTransaction = await customerQuery.getSellAdListUserActiveDelete(idP2P, idUser)
        if (getTransaction.length > 0) {
            await updateBalanceWalletOrUserBonus(idUser, getTransaction[0].type, parseFloat(getTransaction[0].amount_maximum))
            await customerQuery.deleteSell(idP2P, 1)
            success(res, "Delete successfully!")
        } else {
            error_400(res, "Transaction is not exit!", 1)
        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/deleteBuyUser', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {

        const {
            idP2P,
        } = req.body
        const idUser = req.user
        //console.log(idUser);
        const getTransaction = await customerQuery.getBuyAdListUserActiveDelete(idP2P, idUser)
        if (getTransaction.length > 0) {
            const arrayAmount = JSON.parse(getTransaction[0].amount_accept)
            // var total = 0
            // arrayAmount.forEach(element => {
            //     parseFloat(total) += parseFloat(element)
            // })
            const vnd = getTransaction[0].amount_exchange_usd * getTransaction[0].amount_exchange_vnd
            const amountType = getTransaction[0].amount_maximum * vnd
            const walletUser = await customerQuery.getWalletToIdUser(idUser, "VND")
            const amountUser = walletUser[0].amount + parseFloat(amountType)
            await customerQuery.updateBalance(idUser, amountUser, `VND`)
            await customerQuery.deleteBuy(idP2P, 1)
            success(res, "Delete successfully!")
        } else {
            error_400(res, "Transaction is not exit!", 1)
        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/activeBuyUser', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {

        const {
            idP2P,
        } = req.body
        const idUser = req.user
        const getTransaction = await customerQuery.getBuyAdListUserActive(idP2P, idUser)
        if (getTransaction.length > 0) {
            await customerQuery.disableTransactionP2PBuy(idP2P, 1)
            success(res, "Disable successfully!")
        } else {
            error_400(res, "Transaction is not exit!", 1)
        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/disablebuyUser', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {

        const {
            idP2P,
        } = req.body
        const idUser = req.user
        const getTransaction = await customerQuery.getBuyAdListUserActive(idP2P, idUser)
        if (getTransaction.length > 0) {
            await customerQuery.disableTransactionP2PBuy(idP2P, 0)
            success(res, "Disable successfully!")
        } else {
            error_400(res, "Transaction is not exit!", 1)
        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/activeSellUser', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {

        const {
            idP2P,
        } = req.body
        const idUser = req.user
        const getTransaction = await customerQuery.getSellAdListUserActive(idP2P, idUser)
        if (getTransaction.length > 0) {
            await customerQuery.disableTransactionP2PSell(idP2P, 1)
            success(res, "Disable successfully!")
        } else {
            error_400(res, "Transaction is not exit!", 1)
        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/disableSellUser', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {

        const {
            idP2P,
        } = req.body
        const idUser = req.user
        const getTransaction = await customerQuery.getSellAdListUserActive(idP2P, idUser)
        if (getTransaction.length > 0) {
            await customerQuery.disableTransactionP2PSell(idP2P, 0)
            success(res, "Disable successfully!")
        } else {
            error_400(res, "Transaction is not exit!", 1)
        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/buyadlistUserCancel', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {

        const {
            limit,
            page
        } = req.body
        const idUser = req.user
        //console.log("ok");
        const package = await customerQuery.getBuyAdListUserCancel(limit, page, idUser)
        const allPackage = await customerQuery.getBuyAdListPaginationUserCancel(idUser)
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
        success(res, "get list add as success!", obj)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/selladlistUserCancel', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {

        const {
            limit,
            page
        } = req.body
        const idUser = req.user
        const package = await customerQuery.getSellAdListUserCancel(limit, page, idUser)
        const allPackage = await customerQuery.getSellAdListPaginationUserCancel(idUser)
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
        success(res, "get list add as success!", obj)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/selladlistUserSuccess', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {

        const {
            limit,
            page
        } = req.body
        const idUser = req.user
        const package = await customerQuery.getSellAdListUserACCEPT(limit, page, idUser)
        const allPackage = await customerQuery.getSellAdListPaginationUserACCEPT(idUser)
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
        success(res, "get list add as success!", obj)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/buyadlistUserSuccess', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {

        const {
            limit,
            page
        } = req.body
        const idUser = req.user
        //console.log("ok");
        // ACCEPT
        const package = await customerQuery.getBuyAdListUserACCEPT(limit, page, idUser)
        const allPackage = await customerQuery.getBuyAdListPaginationUserACCEPT(idUser)
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
        success(res, "get list add as success!", obj)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/buyadlistUserPendding', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {

        const {
            limit,
            page
        } = req.body
        const idUser = req.user
        //console.log("ok");
        const package = await customerQuery.getBuyAdListUserPendding(limit, page, idUser)
        const allPackage = await customerQuery.getBuyAdListPaginationUserPendding(idUser)
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
        success(res, "get list add as success!", obj)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/buyadlistUser', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {

        const {
            limit,
            page
        } = req.body
        const idUser = req.user
        //console.log("ok");
        const package = await customerQuery.getBuyAdListUser(limit, page, idUser)
        const allPackage = await customerQuery.getBuyAdListPaginationUser(idUser)
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
        success(res, "get list add as success!", obj)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/selladlistUser', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {

        const {
            limit,
            page
        } = req.body
        const idUser = req.user
        const package = await customerQuery.getSellAdListUser(limit, page, idUser)
        const allPackage = await customerQuery.getSellAdListPaginationUser(idUser)
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
        success(res, "get list add as success!", obj)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/selladlistUserPendding', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {

        const {
            limit,
            page
        } = req.body
        const idUser = req.user
        const package = await customerQuery.getSellAdListUserPedding(limit, page, idUser)
        const allPackage = await customerQuery.getSellAdListPaginationUserPedding(idUser)
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
        success(res, "get list add as success!", obj)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
//////////
router.post('/sreachSellNow', async function (req, res, next) {
    const {
        amount,
        symbol,
        type
    } = req.body
    const ListAdSell = await customerQuery.getBuyAdListPagination(symbol)
    let array = []
    //console.log(ListAdSell);
    ListAdSell.forEach(element => {
        var priceVnd = element.amount_exchange_vnd * element.amount_exchange_usd + (element.amount_exchange_vnd * element.amount_exchange_usd / 100 * element.percent)
        var priceUsd = element.amount_exchange_usd + (element.amount_exchange_usd / 100 * element.percent)
        var priceStart, priceEnd
        if (type == 1) {
            priceStart = element.amount * priceVnd
            priceEnd = element.amount_maximum * priceVnd
        } else if (type == 0) {
            priceStart = element.amount
            priceEnd = element.amount_maximum
        }
        //console.log(priceStart, priceEnd);
        if (amount >= priceStart && amount <= priceEnd) {
            array.push(element)
        }
    })
    success(res, "Get ad list success !", array)
})
router.post('/sreachBuyNow', async function (req, res, next) {
    const {
        amount,
        symbol,
        type
    } = req.body
    const ListAdSell = await customerQuery.getSellAdListPagination(symbol)
    let array = []

    ListAdSell.forEach(element => {
        var priceVnd = element.amount_exchange_vnd * element.amount_exchange_usd + (element.amount_exchange_vnd * element.amount_exchange_usd / 100 * element.percent)
        var priceUsd = element.amount_exchange_usd + (element.amount_exchange_usd / 100 * element.percent)
        var priceStart, priceEnd
        if (type == 1) {
            priceStart = element.amount * priceVnd
            priceEnd = element.amount_maximum * priceVnd
        } else if (type == 0) {
            priceStart = element.amount
            priceEnd = element.amount_maximum
        }
        if (amount >= priceStart && amount <= priceEnd) {
            array.push(element)
        }
    })
    success(res, "Get ad list success !", array)
})
router.post('/buyadlist', validatePage(), async function (req, res, next) {

    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const {
            limit,
            page,
            symbol
        } = req.body
        //console.log("ok");
        const package = await customerQuery.getBuyAdList(limit, page, symbol)
        const allPackage = await customerQuery.getBuyAdListPagination(symbol)
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
        success(res, "get list add as success!", obj)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});


router.post('/selladlist', validatePage(), async function (req, res, next) {

    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const {
            limit,
            page,
            symbol
        } = req.body
        //console.log("ok");
        const package = await customerQuery.getSellAdList(limit, page, symbol)
        const allPackage = await customerQuery.getSellAdListPagination(symbol)
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
        success(res, "get list add as success!", obj)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/addSellP2P', passport.authenticate('jwt', {
    session: false
}), authenticateWallet, async function (req, res, next) {

    try {

        var {
            symbol,
            amountExchange,
            amountCoin,
            amountMaximum,
            typeExchange

        } = req.body
        const phone = req.user
        //console.log(phone);
        const profileUser = await customerQuery.getUserToId(phone)
        if (profileUser.length > 0) {
            if (profileUser[0].verified == 1) {

                const coin = await getPriceCoin(symbol);
                if (coin.lastPrice) {

                    var priceX = coin.lastPrice
                    var priceDifference = parseFloat(priceX) / 100 * 5
                    var priceStart = parseFloat(priceX) - parseFloat(priceDifference)
                    var priceEnd = parseFloat(priceX) + parseFloat(priceDifference)

                    //console.log(parseFloat(priceStart), parseFloat(priceEnd));

                    if (priceStart <= parseFloat(amountExchange) && priceEnd >= parseFloat(amountExchange)) {
                        //console.log(parseFloat(amountCoin), parseFloat(amountExchange));
                        if (parseFloat(amountCoin) > 0 && parseFloat(amountMaximum) > 0) {
                            if (parseFloat(amountCoin) <= parseFloat(amountMaximum)) {
                                var vndToUSD = await customerQuery.getVNDTOUSD()

                                const tbcoin = await customerQuery.getTokenToName(symbol)

                                var symbolWallet = await convertSymbolGetWallet(symbol)

                                var walletUser = await customerQuery.getWalletToIdUser(phone, symbolWallet)

                                // console.log(walletUser);
                                if (walletUser.length > 0) {
                                    const flag = await flagAmountToSymBol(phone, symbol, amountMaximum)
                                    //console.log(flag, "flagzzz");
                                    if (flag) {
                                        const obj = await getWallet(phone)
                                        await updateBalanceWalletOrUser(phone, symbol, amountMaximum)
                                        const id = crypto.randomBytes(6).toString("hex");
                                        var array = []
                                        var stringArray = JSON.stringify(array)
                                        var percent = await customerQuery.getBUYSELLP2P()

                                        await customerQuery.addBalanceLog(phone, `-${amountMaximum}`, obj[`${symbol.toLowerCase()}_balance`], parseFloat(obj[`${symbol.toLowerCase()}_balance`]) - parseFloat(amountMaximum), "P2P", `${symbol}_balance`, `Create an advertisement to sell ${symbol}`)
                                        await customerQuery.addSellP2P(id, phone, amountCoin, priceX, priceX * vndToUSD[0].raito, symbol, profileUser[0].username, typeExchange, amountMaximum, stringArray, stringArray, amountExchange, percent[0].raito, vndToUSD[0].raito)
                                        await customerQuery.addNotification(phone, profileUser[0].username, "P2P", `Post a successful sale`)
                                        await messageTelegram(`===========================`)
                                        await messageTelegram(`[P2P]: ${profileUser[0].username} Post a successful sale`)
                                        await messageTelegram(`===========================`)
                                        success(res, "Create successful sell ads !")
                                    } else {
                                        error_400(res, `${symbol} balance is not enough`, 9)
                                    }
                                } else {
                                    error_400(res, `The user has not created a ${symbol} wallet!`, 12)
                                }
                            } else {
                                error_400(res, "The number of coins sold cannot be less than the maximum number of coins! ", 8)
                            }
                        } else {
                            error_400(res, "Invalid amount ! ", 7)
                        }
                    } else {
                        error_400(res, "Price must not differ by more than 5 % of the market !", 2)
                    }
                } else {
                    error_400(res, "Invalid coin ! ", 5)
                }

            } else {
                error_400(res, "User has not verified KYC ! ", 4)

            }


        } else {
            error_400(res, "User has not enabled 2Fa feature ! ", 3)

        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/addBuyP2P', passport.authenticate('jwt', {
    session: false
}), authenticateWallet, async function (req, res, next) {

    try {

        const {
            symbol,
            amountExchange,
            amountCoin,
            amountMaximum,
            typeExchange

        } = req.body
        const phone = req.user
        const profileUser = await customerQuery.getUserToId(phone)
        if (profileUser.length > 0) {
            if (profileUser[0].verified == 1) {

                const tbcoin = await getPriceCoin(symbol)
                if (tbcoin.lastPrice) {
                    var priceX = tbcoin.lastPrice

                    var priceDifference = parseFloat(priceX) / 100 * 5
                    var priceStart = parseFloat(priceX) - parseFloat(priceDifference)
                    var priceEnd = parseFloat(priceX) + parseFloat(priceDifference)
                    if (priceStart <= parseFloat(amountExchange) && priceEnd >= parseFloat(amountExchange)) {
                        if (parseFloat(amountCoin) > 0 && parseFloat(amountMaximum) > 0) {
                            if (parseFloat(amountCoin) <= parseFloat(amountMaximum)) {
                                var vndToUSD = await customerQuery.getVNDTOUSD()
                                var balance = false
                                var symbolWallet = await convertSymbolGetWallet(symbol)
                                const walletUser = await customerQuery.getWalletToIdUser(phone, symbolWallet)

                                if (walletUser.length > 0) {

                                    const walletVND = await customerQuery.getWalletToIdUser(phone, "VND")

                                    let priceMaximumCoinToVND = amountMaximum * (priceX * vndToUSD[0].raito)
                                    if (priceMaximumCoinToVND <= walletVND[0].amount) {
                                        var amountUser = walletVND[0].amount - priceMaximumCoinToVND

                                        await customerQuery.updateBalance(phone, amountUser, "VND")
                                        const id = crypto.randomBytes(6).toString("hex");
                                        var array = []
                                        var stringArray = JSON.stringify(array)
                                        var percent = await customerQuery.getBUYSELLP2P()
                                        await customerQuery.addBalanceLog(phone, `-${priceMaximumCoinToVND}`, walletVND[0].amount, parseFloat(walletVND[0].amount) - parseFloat(priceMaximumCoinToVND), "P2P", "vnd_balance", `Create an advertisement to sell ${symbol}`)
                                        await customerQuery.addBuyP2P(id, phone, amountCoin, priceX, priceX * vndToUSD[0].raito, symbol, profileUser[0].username, typeExchange, amountMaximum, stringArray, stringArray, amountExchange, percent[0].raito, vndToUSD[0].raito)
                                        await customerQuery.addNotification(phone, profileUser[0].username, "P2P", `Post successful purchase`)
                                        await messageTelegram(`===========================`)
                                        await messageTelegram(`[P2P]: ${profileUser[0].username} Post successful purchase`)
                                        await messageTelegram(`===========================`)
                                        success(res, "Create successful buy ads !")
                                    } else {
                                        error_400(res, `Vietnam dong balance is not enough`, 9)
                                    }

                                } else {
                                    error_400(res, `The user has not created a ${symbol} wallet!`, 12)
                                }
                            } else {
                                error_400(res, "The number of coins sold cannot be less than the maximum number of coins! ", 8)
                            }
                        } else {
                            error_400(res, "Invalid amount ! ", 7)
                        }
                    } else {
                        error_400(res, "Price must not differ by more than 5 % of the market !", 2)
                    }
                } else {
                    error_400(res, "Invalid coin ! ", 5)
                }
            } else {
                error_400(res, "User has not verified KYC ! ", 4)

            }


        } else {
            error_400(res, "User has not enabled 2Fa feature ! ", 3)

        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/sellP2Padlist', passport.authenticate('jwt', {


    session: false
}), authenticateWallet, async function (req, res, next) {

    try {

        const {
            symbol,
            amountCoin,
            idP2P,
            typeExchange
        } = req.body

        const idUser = req.user
        //console.log(idUser);
        const profileUser = await customerQuery.getUserToId(idUser)
        if (amountCoin > 0) {
            if (profileUser.length > 0) {
                const getWalletUserSymbol = await customerQuery.getWalletToIdUser(idUser, symbol)
                if (getWalletUserSymbol.length > 0) {
                    const getTransactionP2P = await customerQuery.getTransactionP2PBuyToId(idP2P, symbol, typeExchange)
                    if (getTransactionP2P.length > 0) {
                        if (getTransactionP2P[0].userid != idUser) {
                            if (amountCoin >= getTransactionP2P[0].amount && amountCoin <= getTransactionP2P[0].amount_maximum) {
                                if (typeExchange == 1) {
                                    const priceCoin = amountCoin * (getTransactionP2P[0].amount_exchange_usd * getTransactionP2P[0].amount_exchange_vnd - getTransactionP2P[0].amount_exchange_usd * getTransactionP2P[0].amount_exchange_vnd / 100 * getTransactionP2P[0].percent)
                                    const walletUser = await customerQuery.getWalletToIdUser(idUser, "VND")
                                    const flagIf = await flagAmountToSymBol(idUser, symbol, amountCoin)
                                    if (flagIf) {
                                        if (amountCoin == getTransactionP2P[0].amount_maximum) {
                                            const balanceUser = walletUser[0].amount + priceCoin
                                            // const balanceUserAd = getUserAd[0].vnd_balance + priceCoinAdList
                                            var stringArrayAmount = JSON.stringify([`${getTransactionP2P[0].amount_maximum}`])
                                            var stringArrayIdSell = JSON.stringify([`${getTransactionP2P[0].id}`])
                                            const idbuy_accept = JSON.parse(getTransactionP2P[0].idsell_accept)
                                            const amount_accept = JSON.parse(getTransactionP2P[0].amount_accept)
                                            const vndToUSD = await customerQuery.getVNDTOUSD()
                                            await customerQuery.updateBalance(idUser, balanceUser, "VND")
                                            await updateBalanceWalletOrUser(idUser, symbol, amountCoin)
                                            await updateBalanceWalletOrUserBonus(getTransactionP2P[0].userid, symbol, amountCoin)
                                            const id = crypto.randomBytes(6).toString("hex");
                                            await customerQuery.addSellP2PACCEPT(id, idUser, amountCoin, getTransactionP2P[0].amount_usd,
                                                getTransactionP2P[0].amount_money, symbol,
                                                profileUser[0].username, typeExchange, idP2P, amountCoin,
                                                stringArrayAmount, stringArrayIdSell, getTransactionP2P[0].amount_exchange_usd,
                                                getTransactionP2P[0].percent, getTransactionP2P[0].amount_exchange_vnd, getTransactionP2P[0].id)
                                            amount_accept.push(amountCoin)
                                            idbuy_accept.push(id)
                                            const amountMaximum = getTransactionP2P[0].amount_maximum - amountCoin
                                            const stringIdbuy_accept = JSON.stringify(idbuy_accept)
                                            const stringAmount_accept = JSON.stringify(amount_accept)
                                            const amountFeeP2P = await customerQuery.getExhange(`P2P`)
                                            const amountFee = amountCoin / 100 * amountFeeP2P[0].raito
                                            ///// bonus Rederral feee
                                            await bonusUserReferral(idUser, amountFee, symbol, "SWAP")
                                            ///// end bonus Rederral fee
                                            await customerQuery.updateBuyAdListOne(idP2P, stringIdbuy_accept, new Date().getTime() / 1000, id, stringAmount_accept, amountMaximum, amountCoin)
                                            await customerQuery.addNotification(idUser, profileUser[0].username, "P2P", `Successfully sold ${amountCoin}  ${symbol} for ${getTransactionP2P[0].username}`)
                                            await customerQuery.addNotification(getTransactionP2P[0].userid, getTransactionP2P[0].username, "P2P", `Successfully bought ${amountCoin} ${symbol} to ${profileUser[0].username}`)
                                            io.to(`${idUser}`).emit(`notification`, {
                                                title: "P2P",
                                                detail: `Successfully sold ${amountCoin}  ${symbol} for ${getTransactionP2P[0].username}`
                                            });
                                            io.to(`${getTransactionP2P[0].userid}`).emit(`notification`, {
                                                title: "P2P",
                                                detail: `Successfully bought ${amountCoin} ${symbol} to ${profileUser[0].username}`
                                            });
                                            await messageTelegram(`===========================`)
                                            await messageTelegram(`[P2P]  ${getTransactionP2P[0].username} successfully sold ${amountCoin} ${symbol} `)
                                            await messageTelegram(`[P2P]  ${profileUser[0].username} bought ${amountCoin} ${symbol} successfully `)
                                            await messageTelegram(`===========================`)

                                            success(res, `Sell ${amountCoin} ${symbol} successfully`)
                                        } else if (amountCoin < getTransactionP2P[0].amount_maximum) {
                                            const balanceUser = walletUser[0].amount + priceCoin
                                            const getUserAd = await customerQuery.getWalletToIdUser(getTransactionP2P[0].userid)
                                            // const balanceUserAd = getUserAd[0].vnd_balance + priceCoinAdList
                                            await customerQuery.updateBalance(idUser, balanceUser, "VND")
                                            await updateBalanceWalletOrUser(idUser, symbol, amountCoin)
                                            await updateBalanceWalletOrUserBonus(getTransactionP2P[0].userid, symbol, amountCoin)
                                            var stringArrayAmount = JSON.stringify([`${getTransactionP2P[0].amount_maximum}`])
                                            var stringArrayIdSell = JSON.stringify([`${getTransactionP2P[0].id}`])
                                            const idbuy_accept = JSON.parse(getTransactionP2P[0].idsell_accept)
                                            const amount_accept = JSON.parse(getTransactionP2P[0].amount_accept)
                                            const vndToUSD = await customerQuery.getVNDTOUSD()

                                            const id = crypto.randomBytes(6).toString("hex");
                                            await customerQuery.addSellP2PACCEPT(id, idUser, amountCoin, getTransactionP2P[0].amount_usd,
                                                getTransactionP2P[0].amount_money, symbol,
                                                profileUser[0].username, typeExchange, getTransactionP2P[0].id, amountCoin,
                                                stringArrayAmount, stringArrayIdSell, getTransactionP2P[0].amount_exchange_usd,
                                                getTransactionP2P[0].percent, getTransactionP2P[0].amount_exchange_vnd)
                                            amount_accept.push(amountCoin)
                                            idbuy_accept.push(id)
                                            const amountMaximum = parseFloat(getTransactionP2P[0].amount_maximum) - parseFloat(amountCoin)
                                            const stringIdbuy_accept = JSON.stringify(idbuy_accept)
                                            const stringAmount_accept = JSON.stringify(amount_accept)
                                            var str = amountMaximum.toFixed(2); // => '10.23'
                                            var number = Number(str)
                                            //console.log(parseFloat(getTransactionP2P[0].amount_maximum), parseFloat(amountCoin), number);
                                            await customerQuery.updateBuy(idP2P, stringIdbuy_accept, new Date().getTime() / 1000, id, stringAmount_accept, number, amountCoin, "BUYPENDDING")

                                            if (getTransactionP2P[0].amount_maximum - amountCoin <= getTransactionP2P[0].amount) {
                                                await customerQuery.updateBuyMinium(idP2P, getUserAd[0].minimum)
                                            }
                                            const amountFeeP2P = await customerQuery.getExhange(`P2P`)
                                            const amountFee = amountCoin / 100 * amountFeeP2P[0].raito
                                            ///// bonus Rederral feee
                                            await bonusUserReferral(idUser, amountFee, symbol, "SWAP")
                                            ///// end bonus Rederral fee
                                            await customerQuery.addNotification(idUser, profileUser[0].username, "P2P", `Successfully sold ${amountCoin}  ${symbol} for ${getTransactionP2P[0].username}`)
                                            await customerQuery.addNotification(getTransactionP2P[0].userid, getTransactionP2P[0].username, "P2P", `Successfully bought ${amountCoin} ${symbol} to ${profileUser[0].username}`)
                                            io.to(`${idUser}`).emit(`notification`, {
                                                title: "P2P",
                                                detail: `Successfully sold ${amountCoin}  ${symbol} for ${getTransactionP2P[0].username}`
                                            });
                                            io.to(`${getTransactionP2P[0].userid}`).emit(`notification`, {
                                                title: "P2P",
                                                detail: `Successfully bought ${amountCoin} ${symbol} to ${profileUser[0].username}`
                                            });
                                            await messageTelegram(`===========================`)
                                            await messageTelegram(`[P2P]  ${getTransactionP2P[0].username} successfully sold ${amountCoin} ${symbol} `)
                                            await messageTelegram(`[P2P]  ${profileUser[0].username} bought ${amountCoin} ${symbol} successfully `)
                                            await messageTelegram(`===========================`)
                                            success(res, `Sell ${amountCoin} ${symbol} successfully`)


                                        }
                                        ///////////////////////
                                    } else {
                                        error_400(res, "Insufficient balance ! ", 4)
                                    }
                                }
                            } else {
                                error_400(res, "Invalid coin amount ! ", 1)
                            }
                        } else {
                            error_400(res, "Seller can't sell his coin ! ", 3)
                        }
                    } else {
                        error_400(res, "Transaction does not exist ! ", 2)
                    }
                } else {
                    error_400(res, `Users who have not created a ${symbol} wallet ONLY`, 16)
                }

            }
        } else {
            error_400(res, "Invalid coin amount ! ", 1)
        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/buyP2Padlist', passport.authenticate('jwt', {

    session: false
}), authenticateWallet, async function (req, res, next) {

    try {

        const {
            symbol,
            amountCoin,
            idP2P,
            typeExchange
        } = req.body

        const idUser = req.user
        //console.log(idUser);
        const profileUser = await customerQuery.getUserToId(idUser)
        if (amountCoin > 0) {
            if (profileUser.length > 0) {
                const walletProfileUser = await customerQuery.getWalletToIdUser(idUser, symbol)
                if (walletProfileUser.length > 0) {
                    const getTransactionP2P = await customerQuery.getTransactionP2PSellToId(idP2P, symbol, typeExchange)
                    if (getTransactionP2P.length > 0) {
                        if (getTransactionP2P[0].userid != idUser) {
                            if (amountCoin >= getTransactionP2P[0].amount && amountCoin <= getTransactionP2P[0].amount_maximum) {
                                if (typeExchange == 1) {
                                    const priceCoin = amountCoin * (getTransactionP2P[0].amount_exchange_usd * getTransactionP2P[0].amount_exchange_vnd + getTransactionP2P[0].amount_exchange_usd * getTransactionP2P[0].amount_exchange_vnd / 100 * getTransactionP2P[0].percent)
                                    const walletUser = await customerQuery.getWalletToIdUser(idUser, "VND")
                                    //console.log(priceCoin);
                                    if (walletUser[0].amount >= priceCoin) {
                                        if (amountCoin == getTransactionP2P[0].amount_maximum) {
                                            //console.log("aaa");
                                            const balanceUser = walletUser[0].amount - priceCoin
                                            const getUserAd = await customerQuery.getWalletToIdUser(getTransactionP2P[0].userid, "VND")
                                            const priceCoinAdList = amountCoin * (getTransactionP2P[0].amount_exchange_usd * getTransactionP2P[0].amount_exchange_vnd + getTransactionP2P[0].amount_exchange_usd * getTransactionP2P[0].amount_exchange_vnd / 100 * getTransactionP2P[0].percent)
                                            const balanceUserAd = getUserAd[0].amount + priceCoinAdList
                                            var stringArrayAmount = JSON.stringify([`${getTransactionP2P[0].amount_maximum}`])
                                            var stringArrayIdSell = JSON.stringify([`${getTransactionP2P[0].id}`])
                                            const idbuy_accept = JSON.parse(getTransactionP2P[0].idbuy_accept)
                                            const amount_accept = JSON.parse(getTransactionP2P[0].amount_accept)
                                            const vndToUSD = await customerQuery.getVNDTOUSD()
                                            await customerQuery.updateBalance(idUser, balanceUser, "VND")
                                            await updateBalanceWalletOrUserBonus(idUser, symbol, amountCoin)
                                            await customerQuery.updateBalance(getTransactionP2P[0].userid, balanceUserAd, "VND")
                                            const id = crypto.randomBytes(6).toString("hex");
                                            await customerQuery.addBuyP2PACCEPT(id, idUser, amountCoin, getTransactionP2P[0].amount_usd,
                                                getTransactionP2P[0].amount_money, symbol,
                                                profileUser[0].username, typeExchange, idP2P, amountCoin,
                                                stringArrayAmount, stringArrayIdSell, getTransactionP2P[0].amount_exchange_usd,
                                                getTransactionP2P[0].percent, vndToUSD[0].raito, getTransactionP2P[0].id)
                                            amount_accept.push(amountCoin)
                                            idbuy_accept.push(id)
                                            const amountMaximum = getTransactionP2P[0].amount_maximum - amountCoin
                                            const stringIdbuy_accept = JSON.stringify(idbuy_accept)
                                            const stringAmount_accept = JSON.stringify(amount_accept)
                                            const amountFeeP2P = await customerQuery.getExhange(`P2P`)
                                            const amountFee = amountCoin / 100 * amountFeeP2P[0].raito
                                            ///// bonus Rederral feee
                                            await bonusUserReferral(idUser, amountFee, symbol, "SWAP")
                                            ///// end bonus Rederral fee
                                            await customerQuery.updateSellAdListOne(idP2P, stringIdbuy_accept, new Date().getTime() / 1000, id, stringAmount_accept, amountMaximum, amountCoin)
                                            await customerQuery.addNotification(idUser, profileUser[0].username, "P2P", `Successfully bought ${amountCoin} ${symbol} to ${getTransactionP2P[0].username}`)
                                            await customerQuery.addNotification(getTransactionP2P[0].userid, getTransactionP2P[0].username, "P2P", `Successfully sold ${amountCoin}  ${symbol} for ${profileUser[0].username}`)
                                            io.to(`${idUser}`).emit(`notification`, {
                                                title: "P2P",
                                                detail: `Successfully bought ${amountCoin} ${symbol} to ${getTransactionP2P[0].username}`
                                            });
                                            io.to(`${getTransactionP2P[0].userid}`).emit(`notification`, {
                                                title: "P2P",
                                                detail: `Successfully sold ${amountCoin}  ${symbol} for ${profileUser[0].username}`
                                            });
                                            await messageTelegram(`===========================`)
                                            await messageTelegram(`[P2P]  ${profileUser[0].username} successfully sold ${amountCoin} ${symbol} `)
                                            await messageTelegram(`[P2P]  ${getTransactionP2P[0].username} bought ${amountCoin} ${symbol} successfully `)
                                            await messageTelegram(`===========================`)
                                            success(res, `Buy ${amountCoin} ${symbol} successfully`)
                                        } else if (amountCoin < getTransactionP2P[0].amount_maximum) {
                                            const balanceUser = walletUser[0].amount - priceCoin
                                            const getUserAd = await customerQuery.getWalletToIdUser(getTransactionP2P[0].userid, "VND")
                                            const priceCoinAdList = amountCoin * (getTransactionP2P[0].amount_exchange_usd * getTransactionP2P[0].amount_exchange_vnd)
                                            const balanceUserAd = getUserAd[0].amount + priceCoinAdList
                                            await customerQuery.updateBalance(idUser, balanceUser, "VND")
                                            await updateBalanceWalletOrUserBonus(idUser, symbol, amountCoin)
                                            await customerQuery.updateBalance(getTransactionP2P[0].userid, balanceUserAd, "VND")
                                            var stringArrayAmount = JSON.stringify([`${getTransactionP2P[0].amount_maximum}`])
                                            var stringArrayIdSell = JSON.stringify([`${getTransactionP2P[0].id}`])
                                            const idbuy_accept = JSON.parse(getTransactionP2P[0].idbuy_accept)
                                            const amount_accept = JSON.parse(getTransactionP2P[0].amount_accept)
                                            const vndToUSD = await customerQuery.getVNDTOUSD()

                                            const id = crypto.randomBytes(6).toString("hex");
                                            await customerQuery.addBuyP2PACCEPT(id, idUser, amountCoin, getTransactionP2P[0].amount_usd,
                                                getTransactionP2P[0].amount_money, symbol,
                                                profileUser[0].username, typeExchange, getTransactionP2P[0].id, amountCoin,
                                                stringArrayAmount, stringArrayIdSell, getTransactionP2P[0].amount_exchange_usd,
                                                getTransactionP2P[0].percent, vndToUSD[0].raito, getTransactionP2P[0].id)
                                            amount_accept.push(amountCoin)
                                            idbuy_accept.push(id)
                                            const amountMaximum = parseFloat(getTransactionP2P[0].amount_maximum) - parseFloat(amountCoin)
                                            const stringIdbuy_accept = JSON.stringify(idbuy_accept)
                                            const stringAmount_accept = JSON.stringify(amount_accept)
                                            var str = amountMaximum.toFixed(2); // => '10.23'
                                            var number = Number(str)
                                            //console.log(parseFloat(getTransactionP2P[0].amount_maximum), parseFloat(amountCoin), number);
                                            await customerQuery.updateSell(idP2P, stringIdbuy_accept, new Date().getTime() / 1000, id, stringAmount_accept, number, amountCoin, "SELLPENDDING")

                                            if (getTransactionP2P[0].amount_maximum - amountCoin <= getTransactionP2P[0].amount) {
                                                await customerQuery.updateSellMinium(idP2P, getUserAd[0].minimum)
                                            }
                                            const amountFeeP2P = await customerQuery.getExhange(`P2P`)
                                            const amountFee = amountCoin / 100 * amountFeeP2P[0].raito
                                            ///// bonus Rederral feee
                                            await bonusUserReferral(idUser, amountFee, symbol, "SWAP")
                                            ///// end bonus Rederral fee
                                            await customerQuery.addNotification(idUser, profileUser[0].username, "P2P", `Successfully bought ${amountCoin} ${symbol} to ${getTransactionP2P[0].username}`)
                                            await customerQuery.addNotification(getTransactionP2P[0].userid, getTransactionP2P[0].username, "P2P", `Successfully sold ${amountCoin}  ${symbol} for ${profileUser[0].username}`)
                                            io.to(`${idUser}`).emit(`notification`, {
                                                title: "P2P",
                                                detail: `Successfully bought ${amountCoin} ${symbol} to ${getTransactionP2P[0].username}`
                                            });
                                            io.to(`${getTransactionP2P[0].userid}`).emit(`notification`, {
                                                title: "P2P",
                                                detail: `Successfully sold ${amountCoin}  ${symbol} for ${profileUser[0].username}`
                                            });
                                            await messageTelegram(`===========================`)
                                            await messageTelegram(`[P2P]  ${profileUser[0].username} successfully sold ${amountCoin} ${symbol} `)
                                            await messageTelegram(`[P2P]  ${getTransactionP2P[0].username} bought ${amountCoin} ${symbol} successfully `)
                                            await messageTelegram(`===========================`)
                                            success(res, `Buy ${amountCoin} ${symbol} successfully`)


                                        }
                                        ///////////////////////
                                    } else {
                                        error_400(res, "Insufficient balance ! ", 4)
                                    }
                                }
                            } else {
                                error_400(res, "Invalid coin amount ! ", 1)
                            }
                        } else {
                            error_400(res, "Seller can't buy his coin ! ", 3)
                        }
                    } else {
                        error_400(res, "Transaction does not exist ! ", 2)
                    }
                } else {
                    error_400(res, `Users who have not created a ${symbol} wallet ONLY ! `, 2)

                }
            }
        } else {
            error_400(res, "Invalid coin amount ! ", 1)
        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});

router.get('/exchange', async function (req, res, next) {

    try {
        const data = await customerQuery.getExchangeP2P()
        success(res, "get success !", data)

    } catch (error) {
        error_500(res, error)
    }
});
router.get('/exchange/buysell', async function (req, res, next) {

    try {
        const data = await customerQuery.getExchangeP2PBUYSELL()
        success(res, "get success !", data)

    } catch (error) {
        error_500(res, error)
    }
});
router.get('/getTransactionForm', async function (req, res, next) {

    try {
        const data = await customerQuery.getExchgetTransaction()
        success(res, "get success !", data)

    } catch (error) {
        error_500(res, error)
    }
});
router.get('/exchange/vndusd', async function (req, res, next) {

    try {
        const data = await customerQuery.getVNDTOUSD()
        success(res, "get success !", data)

    } catch (error) {
        error_500(res, error)
    }
});
module.exports = router;